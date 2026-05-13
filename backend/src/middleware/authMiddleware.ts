import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session || !session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        (req as any).user = session.user;
        (req as any).session = session.session;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session || !session.user || (session.user as any).role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        (req as any).user = session.user;
        (req as any).session = session.session;
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Internal server error during admin check' });
    }
};
