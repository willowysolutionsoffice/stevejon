import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  subcategoryId: z.string().optional().nullable(),
  isCustomerFavorite: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
});

export const updateProductSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Product name is required").optional(),
  description: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  subcategoryId: z.string().optional().nullable(),
  isCustomerFavorite: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
});

export const deleteProductSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type CreateProductValues = z.infer<typeof createProductSchema>;
export type UpdateProductValues = z.infer<typeof updateProductSchema>;
