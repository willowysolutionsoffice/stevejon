import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { uploadToCloudinary } from '../lib/upload.js';
import cloudinary from '../lib/cloudinary.js';
import { createProductSchema, updateProductSchema } from '../schemas/product-schema.js';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const file = req.file;

        // validate input
        const parsedInput = createProductSchema.parse({
            ...data,
            isCustomerFavorite: data.isCustomerFavorite === 'true',
            isNewArrival: data.isNewArrival === 'true',
        });

        let photoUrl: string = "";
        if (file) {
            photoUrl = await uploadToCloudinary(file.buffer, file.originalname);
        }

        if (!photoUrl) return res.status(400).json({ error: "Image is required" });

        const product = await prisma.product.create({
            data: {
                name: (parsedInput as any).name,
                description: (parsedInput as any).description || null,
                brandId: (parsedInput as any).brandId || null,
                categoryId: (parsedInput as any).categoryId || null,
                subCategoryId: (parsedInput as any).subcategoryId || null,
                image: photoUrl,
                isCustomerFavorite: (parsedInput as any).isCustomerFavorite,
                isNewArrival: (parsedInput as any).isNewArrival,
            },
        });

        res.status(201).json({ success: true, data: product, message: "Product created successfully" });
    } catch (error: any) {
        console.error("Create product error:", error);
        res.status(500).json({ error: error.message || "Failed to create product" });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const file = req.file;

        const parsedInput = updateProductSchema.parse({
            id,
            ...data,
            isCustomerFavorite: data.isCustomerFavorite !== undefined ? data.isCustomerFavorite === 'true' : undefined,
            isNewArrival: data.isNewArrival !== undefined ? data.isNewArrival === 'true' : undefined,
        });

        const existingProduct = await prisma.product.findUnique({
            where: { id: id as string },
            select: { image: true }
        });

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        let photoUrl: string | undefined;
        if (file) {
            photoUrl = await uploadToCloudinary(file.buffer, file.originalname);
            
            if (existingProduct.image) {
                const oldPublicId = existingProduct.image.split("/").pop()?.split(".")[0];
                if (oldPublicId) {
                    try {
                        await (cloudinary as any).uploader.destroy(`Deco moja/${oldPublicId}`);
                    } catch (error) {
                        console.warn("Failed to delete old image:", error);
                    }
                }
            }
        }

        const updateData: any = {};
        if ((parsedInput as any).name) updateData.name = (parsedInput as any).name;
        if ((parsedInput as any).description !== undefined) updateData.description = (parsedInput as any).description;
        if ((parsedInput as any).brandId !== undefined) updateData.brandId = (parsedInput as any).brandId;
        if ((parsedInput as any).categoryId !== undefined) updateData.categoryId = (parsedInput as any).categoryId;
        if ((parsedInput as any).subcategoryId !== undefined) updateData.subCategoryId = (parsedInput as any).subcategoryId;
        if ((parsedInput as any).isCustomerFavorite !== undefined) updateData.isCustomerFavorite = (parsedInput as any).isCustomerFavorite;
        if ((parsedInput as any).isNewArrival !== undefined) updateData.isNewArrival = (parsedInput as any).isNewArrival;
        if (photoUrl) updateData.image = photoUrl;

        const updated = await prisma.product.update({
            where: { id: id as string },
            data: updateData,
        });

        res.json({ success: true, data: updated, message: "Product updated successfully" });
    } catch (error: any) {
        console.error("Update product error:", error);
        res.status(500).json({ error: error.message || "Failed to update product" });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({ where: { id: id as string } });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (product.image) {
            const oldPublicId = product.image.split("/").pop()?.split(".")[0];
            if (oldPublicId) {
                try {
                    await (cloudinary as any).uploader.destroy(`Deco moja/${oldPublicId}`);
                } catch (e) {
                    console.warn("Failed to delete product image:", e);
                }
            }
        }

        await prisma.product.delete({ where: { id: id as string } });

        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
        console.error("Delete product error:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: id as string },
            include: {
                brand: true,
                category: true,
                subCategory: true,
                variants: {
                    include: {
                        options: {
                            include: {
                                attribute: true,
                                attributeValue: true,
                            }
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Failed to fetch product:', error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
};
