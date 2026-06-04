import { Request, Response } from 'express';
import { prisma as prismaClient } from '../lib/prisma.js';
import { createCouponSchema, updateCouponSchema, validateCouponSchema } from '../schemas/coupon-schema.js';

const prisma = prismaClient as any;

// Helper to check coupon validity and calculate discount amount
export const calculateCouponDiscount = (coupon: any, cartTotal: number) => {
    if (!coupon.isActive) {
        throw new Error("Coupon is inactive");
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
        throw new Error("Coupon is not active yet");
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
        throw new Error("Coupon has expired");
    }

    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
        throw new Error("Coupon usage limit has been reached");
    }

    if (cartTotal < coupon.minCartAmount) {
        throw new Error(`Minimum subtotal of Rs. ${coupon.minCartAmount} is required to apply this coupon`);
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
        discount = (cartTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount !== null && coupon.maxDiscount !== undefined) {
            discount = Math.min(discount, coupon.maxDiscount);
        }
    } else if (coupon.discountType === 'FIXED') {
        discount = coupon.discountValue;
    }

    return Math.min(discount, cartTotal);
};

// GET /api/coupons
export const getAllCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: coupons });
    } catch (error: any) {
        console.error("❌ Fetch coupons error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch coupons" });
    }
};

// POST /api/coupons
export const createCoupon = async (req: Request, res: Response) => {
    try {
        const validated = createCouponSchema.parse(req.body);

        // Check if coupon code already exists
        const existing = await prisma.coupon.findUnique({
            where: { code: validated.code }
        });

        if (existing) {
            return res.status(400).json({ error: `Coupon code '${validated.code}' already exists` });
        }

        const coupon = await prisma.coupon.create({
            data: validated
        });

        res.status(201).json({ success: true, data: coupon });
    } catch (error: any) {
        console.error("❌ Create coupon error:", error);
        res.status(400).json({ error: error.message || "Failed to create coupon" });
    }
};

// PATCH /api/coupons/:id
export const updateCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validated = updateCouponSchema.parse(req.body);

        // Check if code is being updated and conflicts with existing code
        if (validated.code) {
            const existing = await prisma.coupon.findFirst({
                where: {
                    code: validated.code,
                    NOT: { id }
                }
            });
            if (existing) {
                return res.status(400).json({ error: `Coupon code '${validated.code}' already exists` });
            }
        }

        const updated = await prisma.coupon.update({
            where: { id },
            data: validated
        });

        res.json({ success: true, data: updated });
    } catch (error: any) {
        console.error("❌ Update coupon error:", error);
        res.status(400).json({ error: error.message || "Failed to update coupon" });
    }
};

// DELETE /api/coupons/:id
export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.coupon.delete({
            where: { id }
        });
        res.json({ success: true, message: "Coupon deleted successfully" });
    } catch (error: any) {
        console.error("❌ Delete coupon error:", error);
        res.status(500).json({ error: error.message || "Failed to delete coupon" });
    }
};

// POST /api/coupons/validate
export const validateCoupon = async (req: Request, res: Response) => {
    try {
        const { code, cartTotal } = validateCouponSchema.parse(req.body);

        const coupon = await prisma.coupon.findUnique({
            where: { code }
        });

        if (!coupon) {
            return res.status(404).json({ error: "Coupon not found" });
        }

        try {
            const discountAmount = calculateCouponDiscount(coupon, cartTotal);
            res.json({
                success: true,
                code: coupon.code,
                discountAmount,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minCartAmount: coupon.minCartAmount
            });
        } catch (validationError: any) {
            return res.status(400).json({ error: validationError.message });
        }
    } catch (error: any) {
        console.error("❌ Validate coupon error:", error);
        res.status(400).json({ error: error.message || "Invalid coupon validation request" });
    }
};
