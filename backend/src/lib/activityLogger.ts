import { Request } from 'express';
import { prisma } from './prisma.js';

export async function logActivity(action: string, details: string, req: Request) {
    try {
        const user = (req as any).user;
        await prisma.activityLog.create({
            data: {
                action,
                details,
                userId: user?.id || null,
                userEmail: user?.email || null,
                ipAddress: req.ip || req.socket?.remoteAddress || null,
            }
        });
    } catch (error) {
        console.error("❌ Failed to log system activity:", error);
    }
}
