import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").transform((val) => val.toUpperCase().trim()),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("Discount value must be positive"),
  minCartAmount: z.number().nonnegative().optional().default(0),
  maxDiscount: z.number().positive().nullable().optional(),
  startDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  endDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateCouponSchema = z.object({
  code: z.string().min(1).transform((val) => val.toUpperCase().trim()).optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().positive().optional(),
  minCartAmount: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().nullable().optional(),
  startDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  endDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").transform((val) => val.toUpperCase().trim()),
  cartTotal: z.number().nonnegative("Cart total must be positive"),
});
