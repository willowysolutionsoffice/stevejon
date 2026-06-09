import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/logs/activity
router.get('/activity', async (req, res) => {
    try {
        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: logs });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message || 'Error fetching activity logs' });
    }
});

// GET /api/logs/payment
router.get('/payment', async (req, res) => {
    try {
        const logs = await prisma.paymentLog.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: logs });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message || 'Error fetching payment logs' });
    }
});

export default router;

// DELETE /api/logs/activity - clear all activity logs
router.delete('/activity', async (req, res) => {
  try {
    const result = await prisma.activityLog.deleteMany();
    res.json({ success: true, deleted: result.count });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message || 'Error clearing activity logs' });
  }
});

// DELETE /api/logs/payment - clear all payment logs
router.delete('/payment', async (req, res) => {
  try {
    const result = await prisma.paymentLog.deleteMany();
    res.json({ success: true, deleted: result.count });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message || 'Error clearing payment logs' });
  }
});
