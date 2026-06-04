import { Request, Response } from 'express';
import { prisma as prismaClient } from '../lib/prisma.js';
import { orderStatusSchema } from '../schemas/order-schema.js';

const prisma = prismaClient as any;

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
        const { id } = req.params;
        const { status: targetStatus } = req.body;

        // validate status using schema
        orderStatusSchema.parse(targetStatus);

        const updatedOrder = await prisma.$transaction(async (tx: any) => {
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
            return tx.order.update({
                where: { id },
                data: { status: targetStatus }
            });
        });

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
        const { shippingDetails, paymentMethod, items } = req.body;

        if (!shippingDetails || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Missing shipping details or items" });
        }

        const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

        // Run order creation and stock decrement in a transaction
        const order = await prisma.$transaction(async (tx: any) => {
            // 1. Create the Order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    status: "PROCESSING",
                    paymentMethod,
                    phoneNumber: shippingDetails.phone,
                    street: shippingDetails.street,
                    city: shippingDetails.city,
                    state: shippingDetails.state,
                    pincode: shippingDetails.pincode,
                    items: {
                        create: items.map((item: any) => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: {
                    items: true
                }
            });

            // 2. Decrement quantities of the variants in stock
            for (const item of items) {
                const variant = await tx.productVariant.findUnique({
                    where: { id: item.variantId }
                });

                if (!variant || variant.qty < item.quantity) {
                    throw new Error(`Insufficient stock for item: ${item.title || item.variantId}`);
                }

                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: {
                        qty: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            // 3. Clear user's Cart in MongoDB
            const userCart = await tx.cart.findUnique({
                where: { userId }
            });

            if (userCart) {
                await tx.cartItem.deleteMany({
                    where: { cartId: userCart.id }
                });
            }

            return newOrder;
        });

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
