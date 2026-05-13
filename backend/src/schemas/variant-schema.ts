import { z } from "zod";

export const createVariantSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  sku: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  qty: z.number().int().nonnegative("Qty must be non-negative"),
  options: z.array(z.object({
    attributeId: z.string().min(1),
    valueId: z.string().min(1),
  })).optional(),
});

export const updateVariantSchema = z.object({
  id: z.string().min(1, "Variant id is required"),
  sku: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  qty: z.number().int().nonnegative().optional(),
  options: z.array(z.object({
    attributeId: z.string().min(1),
    valueId: z.string().min(1),
  })).optional(),
});

export const deleteVariantSchema = z.object({ id: z.string().min(1) });

export type CreateVariantValues = z.infer<typeof createVariantSchema>;
export type UpdateVariantValues = z.infer<typeof updateVariantSchema>;
