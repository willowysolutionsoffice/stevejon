import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

export const getAdminProfile = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const profile = await prisma.user.findFirst({
            where: { id: user.id, role: "admin" },
            select: { id: true, role: true, name: true, email: true, phone: true, image: true },
        });

        if (!profile) return res.status(404).json({ error: "Profile not found" });

        res.json({
            success: true,
            profile: {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                image: profile.image,
                phone: profile.phone,
                role: profile.role,
            },
            message: "Profile fetched successfully",
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password, newPassword } = req.body;
        
        const result = await auth.api.changePassword({
            headers: fromNodeHeaders(req.headers),
            body: { newPassword, currentPassword: password },
        });

        res.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ error: err.message || "Failed to update password" });
    }
};
