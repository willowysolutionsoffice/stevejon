import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { uploadToCloudinary } from '../lib/upload.js';
import { createVariantSchema, updateVariantSchema } from '../schemas/variant-schema.js';

async function ensureUniqueSku(baseSku: string) {
    let candidate = baseSku;
    let counter = 1;
    while (true) {
        const exists = await prisma.productVariant.findUnique({ where: { sku: candidate } });
        if (!exists) return candidate;
        candidate = `${baseSku}-${counter++}`;
    }
}

function generateSkuFromOptions(base: string, options: { attribute: string; value: string }[]) {
    const parts = options.map((o) => `${o.attribute}-${o.value}`.toUpperCase().replace(/\s+/g, ""));
    const suffix = parts.join("-");
    return suffix ? `${base}-${suffix}` : base;
}

export const createVariant = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const files = req.files as Express.Multer.File[];

        const parsedInput = createVariantSchema.parse({
            ...data,
            price: parseFloat(data.price),
            qty: parseInt(data.qty),
            options: typeof data.options === 'string' ? JSON.parse(data.options) : data.options,
        });

        const imageUrls: string[] = [];
        if (files) {
            for (const file of files) {
                const url = await uploadToCloudinary(file.buffer, file.originalname);
                imageUrls.push(url);
            }
        }

        let finalSku = (parsedInput as any).sku || "";
        if (!finalSku) {
            const product = await prisma.product.findUnique({ where: { id: (parsedInput as any).productId }, select: { name: true } });
            const optionRecords = await Promise.all(((parsedInput as any).options as any[]).map(async (o: any) => {
                const attr = await prisma.attribute.findUnique({ where: { id: o.attributeId }, select: { name: true } });
                const val = await prisma.attributeValue.findUnique({ where: { id: o.valueId }, select: { value: true } });
                return { attribute: attr?.name || "", value: val?.value || "" };
            }));
            const base = (product?.name || "SKU").toUpperCase().replace(/\s+/g, "");
            finalSku = await ensureUniqueSku(generateSkuFromOptions(base, optionRecords));
        }

        const variant = await prisma.productVariant.create({
            data: {
                productId: (parsedInput as any).productId,
                sku: finalSku,
                price: (parsedInput as any).price,
                qty: (parsedInput as any).qty,
                images: imageUrls,
                options: {
                    create: ((parsedInput as any).options as any[]).map((opt: any) => ({
                        attributeId: opt.attributeId,
                        valueId: opt.valueId,
                    })),
                },
            },
            include: { options: true },
        });

        res.status(201).json({ success: true, data: variant });
    } catch (error: any) {
        console.error("Create variant error:", error);
        res.status(500).json({ error: error.message || "Failed to create variant" });
    }
};

export const updateVariant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const files = req.files as Express.Multer.File[];

        const parsedInput = updateVariantSchema.parse({
            id,
            ...data,
            price: data.price ? parseFloat(data.price) : undefined,
            qty: data.qty ? parseInt(data.qty) : undefined,
            options: typeof data.options === 'string' ? JSON.parse(data.options) : data.options,
        });

        const updateData: any = {};
        if ((parsedInput as any).price !== undefined) updateData.price = (parsedInput as any).price;
        if ((parsedInput as any).qty !== undefined) updateData.qty = (parsedInput as any).qty;

        if (files && files.length > 0) {
            const imageUrls: string[] = [];
            for (const file of files) {
                const url = await uploadToCloudinary(file.buffer, file.originalname);
                imageUrls.push(url);
            }
            updateData.images = imageUrls;
        }

        const updated = await prisma.$transaction(async (tx: any) => {
            if ((parsedInput as any).options !== undefined) {
                const opts = (parsedInput as any).options as any[];
                await tx.variantOption.deleteMany({ where: { productVariantId: id as string } });
                if (opts.length > 0) {
                    await tx.variantOption.createMany({
                        data: opts.map((opt: any) => ({
                            productVariantId: id as string,
                            attributeId: opt.attributeId,
                            valueId: opt.valueId,
                        })),
                    });
                }

                // Regenerate SKU
                const variant = await tx.productVariant.findUnique({ where: { id: id as string }, select: { productId: true } });
                const product = variant ? await tx.product.findUnique({ where: { id: variant.productId }, select: { name: true } }) : null;
                const optionRecords = await tx.variantOption.findMany({
                    where: { productVariantId: id as string },
                    include: { attribute: true, attributeValue: true },
                });
                const base = (product?.name || "SKU").toUpperCase().replace(/\s+/g, "");
                const skuBase = generateSkuFromOptions(base, optionRecords.map((o: any) => ({ attribute: o.attribute.name, value: o.attributeValue.value })));
                
                let newSku = skuBase;
                let counter = 1;
                while (await tx.productVariant.findUnique({ where: { sku: newSku, NOT: { id: id as string } } })) {
                    newSku = `${skuBase}-${counter++}`;
                }
                updateData.sku = newSku;
            }

            return tx.productVariant.update({ where: { id: id as string }, data: updateData, include: { options: true } });
        });

        res.json({ success: true, data: updated });
    } catch (error: any) {
        console.error("Update variant error:", error);
        res.status(500).json({ error: error.message || "Failed to update variant" });
    }
};

export const deleteVariant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const used = await prisma.orderItem.findFirst({ where: { variantId: id as string }, select: { id: true } });
        if (used) return res.status(400).json({ error: "Cannot delete variant. It is part of existing orders." });

        await prisma.productVariant.delete({ where: { id: id as string } });
        res.json({ success: true, message: "Variant deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete variant" });
    }
};
