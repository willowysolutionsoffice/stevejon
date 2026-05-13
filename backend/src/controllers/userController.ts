import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

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
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
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
            }
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
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
