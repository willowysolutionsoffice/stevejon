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
        const { status } = req.body;

        // validate status using schema
        orderStatusSchema.parse(status);

        const order = await prisma.order.update({
            where: { id: id as string },
            data: { status },
        });

        res.json(order);
    } catch (error) {
        console.error("❌ Update order status error:", error);
        res.status(500).json({ error: "Failed to update order status" });
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

        res.json(order);
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
