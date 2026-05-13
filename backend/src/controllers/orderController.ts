import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { orderStatusSchema } from '../schemas/order-schema.js';

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
