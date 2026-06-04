import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const status = req.query.status as string; // 'active' | 'banned'
        const sort = req.query.sort as string || 'desc'; // 'asc' | 'desc'
        const joinedDate = req.query.joinedDate as string;

        const conditions: any[] = [
            { role: { not: 'admin' } }
        ];

        if (search) {
            conditions.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        if (status === 'banned') {
            conditions.push({ banned: true });
        } else if (status === 'active') {
            conditions.push({
                OR: [
                    { banned: false },
                    { banned: null }
                ]
            });
        }

        if (joinedDate) {
            const startOfDay = new Date(joinedDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(joinedDate);
            endOfDay.setHours(23, 59, 59, 999);
            conditions.push({
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            });
        }

        const where = { AND: conditions };
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    image: true,
                    createdAt: true,
                    banned: true,
                    banExpires: true,
                },
                orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            data: users,
            users: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const getUserDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: id as string },
            include: {
                orders: {
                    include: { items: true },
                    orderBy: { createdAt: 'desc' },
                },
                wishlists: {
                    include: {
                        items: {
                            include: {
                                variant: {
                                    include: {
                                        product: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ success: true, user });
    } catch (error) {
        console.error("getUserDetails error:", error);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
};

export const banUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.user.update({
            where: { id: id as string },
            data: { banned: true },
        });
        res.json({ success: true, message: "User banned" });
    } catch (error) {
        res.status(500).json({ error: "Failed to ban user" });
    }
};

export const unbanUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.user.update({
            where: { id: id as string },
            data: { banned: false },
        });
        res.json({ success: true, message: "User unbanned" });
    } catch (error) {
        res.status(500).json({ error: "Failed to unban user" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // check if user has orders
        const orders = await prisma.order.count({ where: { userId: id as string } });
        if (orders > 0) return res.status(400).json({ error: "Cannot delete user with existing orders" });

        await prisma.user.delete({ where: { id: id as string } });
        res.json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};
