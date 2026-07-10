import { Request, Response } from 'express';
import { prisma as prismaClient } from '../lib/prisma.js';
import { orderStatusSchema } from '../schemas/order-schema.js';
import { calculateCouponDiscount } from './couponController.js';
import { sendOrderEmails } from '../lib/mailer.js';
import { logActivity } from '../lib/activityLogger.js';

const prisma = prismaClient as any;

// Helper to generate lucky tickets for an order if there are active draw campaigns
async function generateTicketsForOrder(tx: any, orderId: string, userId: string) {
    // Check if tickets already exist for this order to avoid duplicates
    const existingTickets = await tx.luckyTicket.findFirst({
        where: { orderId }
    });

    if (existingTickets) {
        return; // already generated
    }

    const now = new Date();
    const activeCampaigns = await tx.drawCampaign.findMany({
        where: {
            status: "ACTIVE",
            startDate: { lte: now },
            endDate: { gte: now }
        }
    });

    if (activeCampaigns.length === 0) {
        return; // no active campaign
    }

    for (const campaign of activeCampaigns) {
        const year = now.getFullYear();
        // Find the last generated ticket for this year
        const lastTicket = await tx.luckyTicket.findFirst({
            where: {
                ticketNumber: {
                    startsWith: `DRAW-${year}-`
                }
            },
            orderBy: {
                ticketNumber: 'desc'
            }
        });

        let nextNum = 1;
        if (lastTicket) {
            const match = lastTicket.ticketNumber.match(/DRAW-(\d{4})-(\d{6})/);
            if (match) {
                nextNum = parseInt(match[2]) + 1;
            }
        }

        const ticketNumber = `DRAW-${year}-${String(nextNum).padStart(6, '0')}`;

        await tx.luckyTicket.create({
            data: {
                ticketNumber,
                orderId,
                drawCampaignId: campaign.id,
                userId
            }
        });
    }
}

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const search = req.query.search as string;

        const where: any = {};
        if (status) where.status = status.toUpperCase();
        if (search && search.trim()) {
            where.OR = [
                { id: { contains: search.trim(), mode: 'insensitive' } },
                { user: { name: { contains: search.trim(), mode: 'insensitive' } } },
            ];
        }

        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: true,
                                    options: { include: { attribute: true, attributeValue: true } },
                                }
                            }
                        }
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        res.json({
            data: orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error("❌ Fetch orders error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { status: targetStatus } = req.body;

        // validate status using schema
        orderStatusSchema.parse(targetStatus);

        let updatedOrder;
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            try {
                updatedOrder = await prisma.$transaction(async (tx: any) => {
                    // Get current order and its items
                    const order = await tx.order.findUnique({
                        where: { id },
                        include: { items: true }
                    });

                    if (!order) {
                        throw new Error("Order not found");
                    }

                    const currentStatus = order.status;

                    if (currentStatus === targetStatus) {
                        return order; // No change
                    }

                    const isCurrentCancelledOrFailed = currentStatus === 'CANCELLED' || currentStatus === 'FAILED';
                    const isTargetCancelledOrFailed = targetStatus === 'CANCELLED' || targetStatus === 'FAILED';

                    // Transition: Active -> Cancelled/Failed (Restore stock)
                    if (!isCurrentCancelledOrFailed && isTargetCancelledOrFailed) {
                        for (const item of order.items) {
                            await tx.productVariant.update({
                                where: { id: item.variantId },
                                data: { qty: { increment: item.quantity } }
                            });
                        }
                    }
                    // Transition: Cancelled/Failed -> Active (Deduct stock)
                    else if (isCurrentCancelledOrFailed && !isTargetCancelledOrFailed) {
                        for (const item of order.items) {
                            const variant = await tx.productVariant.findUnique({
                                where: { id: item.variantId }
                            });
                            if (!variant || variant.qty < item.quantity) {
                                throw new Error(`Insufficient stock to reactivate order. Item SKU ${variant?.sku || item.variantId} is out of stock.`);
                            }
                            await tx.productVariant.update({
                                where: { id: item.variantId },
                                data: { qty: { decrement: item.quantity } }
                            });
                        }
                    }

                    // Update order status
                    const updated = await tx.order.update({
                        where: { id },
                        data: { status: targetStatus }
                    });

                    // Generate ticket if order transitions to PAID
                    if (targetStatus === 'PAID') {
                        await generateTicketsForOrder(tx, id, order.userId);
                    }

                    return updated;
                });
                break; // success
            } catch (error: any) {
                if (error.code === 'P2002' && error.message?.includes('ticketNumber')) {
                    attempts++;
                    if (attempts >= maxAttempts) throw error;
                    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
                    continue;
                }
                throw error;
            }
        }

        if (updatedOrder) {
            logActivity('UPDATE_ORDER_STATUS', `Updated Order #${id} status to ${targetStatus}.`, req);
        }
        res.json(updatedOrder);
    } catch (error: any) {
        console.error("❌ Update order status error:", error);
        res.status(500).json({ error: error.message || "Failed to update order status" });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: id as string },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                items: {
                    include: {
                        variant: {
                            include: {
                                product: { include: { brand: true, category: true, subCategory: true } },
                                options: { include: { attribute: true, attributeValue: true } },
                            },
                        },
                    },
                },
                tickets: {
                    include: {
                        drawCampaign: true
                    }
                }
            },
        });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        console.error("❌ Fetch order error:", error);
        res.status(500).json({ error: "Failed to fetch order" });
    }
};

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const {
            shippingDetails,
            paymentMethod,
            items,
            couponCode,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        } = req.body;

        if (!shippingDetails || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Missing shipping details or items" });
        }

        const normalizedPaymentMethod = paymentMethod === "Cash on Delivery" ? "COD" : paymentMethod;

        if (!normalizedPaymentMethod || !["COD", "RAZORPAY"].includes(normalizedPaymentMethod)) {
            return res.status(400).json({ error: "Invalid payment method" });
        }

        let verifiedPayment: any = null;

        // IMPORTANT: Never mark a Razorpay order as PAID unless the payment log was verified first.
        if (normalizedPaymentMethod === "RAZORPAY") {
            if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
                return res.status(400).json({ error: "Missing Razorpay payment details" });
            }

            verifiedPayment = await prisma.paymentLog.findFirst({
                where: {
                    gatewayOrderId: razorpayOrderId,
                    gatewayPaymentId: razorpayPaymentId,
                    gatewaySignature: razorpaySignature,
                    status: "SUCCESS",
                    paymentMethod: "RAZORPAY",
                },
            });

            if (!verifiedPayment) {
                return res.status(400).json({ error: "Payment not verified" });
            }

            if (verifiedPayment.orderId) {
                return res.status(400).json({ error: "Payment already used for another order" });
            }
        }

        // Run order creation, coupon usage, stock decrement, and payment log linking in one transaction.
        let order;
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            try {
                order = await prisma.$transaction(async (tx: any) => {
                    const dbItems: { variantId: string; quantity: number; price: number }[] = [];
                    let subtotal = 0;

                    // Always calculate amount from DB price, never frontend price.
                    for (const item of items) {
                        if (!item.variantId || !item.quantity || item.quantity <= 0) {
                            throw new Error("Invalid order item");
                        }

                        const variant = await tx.productVariant.findUnique({
                            where: { id: item.variantId }
                        });

                        if (!variant) {
                            throw new Error("Product variant not found");
                        }

                        if (variant.qty < item.quantity) {
                            throw new Error(`Insufficient stock for item: ${item.title || item.variantId}`);
                        }

                        subtotal += variant.price * item.quantity;
                        dbItems.push({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: variant.price,
                        });
                    }

                    let discountAmount = 0;
                    let finalAmount = subtotal;

                    if (couponCode) {
                        const coupon = await tx.coupon.findUnique({
                            where: { code: couponCode }
                        });

                        if (!coupon) {
                            throw new Error("Coupon code is invalid");
                        }

                        try {
                            discountAmount = calculateCouponDiscount(coupon, subtotal);
                            finalAmount = subtotal - discountAmount;
                        } catch (err: any) {
                            throw new Error(`Coupon error: ${err.message}`);
                        }
                    }

                    if (normalizedPaymentMethod === "RAZORPAY") {
                        const paidAmountPaise = Math.round(Number(verifiedPayment.amount) * 100);
                        const finalAmountPaise = Math.round(Number(finalAmount) * 100);

                        if (paidAmountPaise !== finalAmountPaise) {
                            throw new Error("Paid amount does not match order amount");
                        }
                    }

                    // 1. Create the Order
                    const newOrder = await tx.order.create({
                        data: {
                            userId,
                            totalAmount: finalAmount,
                            discountAmount,
                            couponCode: couponCode || null,
status: "PROCESSING",
                            paymentMethod: normalizedPaymentMethod,

                            razorpayOrderId: razorpayOrderId || null,
                            razorpayPaymentId: razorpayPaymentId || null,
                            razorpaySignature: razorpaySignature || null,

                            phoneNumber: shippingDetails.phone,
                            street: shippingDetails.street,
                            city: shippingDetails.city,
                            state: shippingDetails.state,
                            pincode: shippingDetails.pincode,
                            items: {
                                create: dbItems,
                            }
                        },
                        include: {
                            items: true
                        }
                    });

                    // 2. Increment coupon usage only after order creation succeeds.
                    if (couponCode) {
                        const coupon = await tx.coupon.findUnique({
                            where: { code: couponCode }
                        });

                        if (coupon) {
                            await tx.coupon.update({
                                where: { id: coupon.id },
                                data: { usedCount: { increment: 1 } }
                            });
                        }
                    }

                    // 3. Decrement quantities of the variants in stock
                    for (const item of dbItems) {
                        await tx.productVariant.update({
                            where: { id: item.variantId },
                            data: {
                                qty: {
                                    decrement: item.quantity
                                }
                            }
                        });
                    }

                    // 4. Clear user's Cart in MongoDB
                    const userCart = await tx.cart.findUnique({
                        where: { userId }
                    });

                    if (userCart) {
                        await tx.cartItem.deleteMany({
                            where: { cartId: userCart.id }
                        });
                    }

                    // 5. Generate lucky tickets only for paid online orders.
                    // COD tickets can be generated later when admin changes order status to PAID.
                    if (normalizedPaymentMethod === "RAZORPAY") {
                        await generateTicketsForOrder(tx, newOrder.id, userId);
                    }

                    // 6. Create/link payment log entry
                    const userObj = await tx.user.findUnique({
                        where: { id: userId }
                    });

                    if (normalizedPaymentMethod === "RAZORPAY") {
                        await tx.paymentLog.update({
                            where: { id: verifiedPayment.id },
                            data: {
                                orderId: newOrder.id,
                                buyerName: userObj?.name || "Customer",
                                buyerEmail: userObj?.email || "",
                            },
                        });
                    } else {
                        await tx.paymentLog.create({
                            data: {
                                orderId: newOrder.id,
                                amount: finalAmount,
                                currency: "INR",
                                status: "PENDING",
                                paymentMethod: "COD",
                                buyerName: userObj?.name || "Customer",
                                buyerEmail: userObj?.email || "",
                            }
                        });
                    }

                    return newOrder;
                });
                break; // success
            } catch (error: any) {
                if (error.code === 'P2002' && error.message?.includes('ticketNumber')) {
                    attempts++;
                    if (attempts >= maxAttempts) throw error;
                    // Wait 50-150ms to avoid retry collision
                    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
                    continue;
                }
                throw error;
            }
        }

        // Send order confirmation & admin alert emails asynchronously
        if (order && order.id) {
            sendOrderEmails(order.id).catch((err) => {
                console.error("❌ Failed to trigger order email notifications:", err);
            });
        }

        res.status(201).json({ success: true, data: order });
    } catch (error: any) {
        console.error("Create order error:", error);
        res.status(500).json({ error: error.message || "Failed to place order" });
    }
};

// GET /api/orders/my-orders
export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                options: {
                                    include: {
                                        attribute: true,
                                        attributeValue: true
                                    }
                                }
                            }
                        }
                    }
                },
                tickets: {
                    include: {
                        drawCampaign: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: orders });
    } catch (error: any) {
        console.error("Get my orders error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch orders" });
    }
};

// PATCH /api/orders/:id/cancel
export const cancelMyOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        const updatedOrder = await prisma.$transaction(async (tx: any) => {
            const order = await tx.order.findUnique({
                where: { id },
                include: { items: true }
            });

            if (!order) {
                throw new Error("Order not found");
            }

            if (order.userId !== userId) {
                throw new Error("Unauthorized to cancel this order");
            }

            if (order.status === 'CANCELLED') {
                return order; // Already cancelled
            }

            if (order.status === 'DELIVERED' || order.status === 'FAILED') {
                throw new Error(`Cannot cancel order in ${order.status} state`);
            }

            // Restore variant stocks
            for (const item of order.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { qty: { increment: item.quantity } }
                });
            }

            // Set order status to CANCELLED
            return tx.order.update({
                where: { id },
                data: { status: 'CANCELLED' }
            });
        });

        res.json({ success: true, data: updatedOrder });
    } catch (error: any) {
        console.error("Cancel order error:", error);
        res.status(400).json({ error: error.message || "Failed to cancel order" });
    }
};
