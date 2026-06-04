import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function formatVariantOptions(options: any[]): string {
    return options.map(opt => `${opt.attribute.name}: ${opt.attributeValue.value}`).join(', ');
}

export const getInventory = async (req: Request, res: Response) => {
    try {
        const { search, categoryId, brandId, sortBy = 'createdAt', sortOrder = 'desc', page = '1', limit = '10' } = req.query;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const whereClause: any = {};

        if (categoryId && categoryId !== 'all') {
            whereClause.product = { ...whereClause.product, categoryId };
        }

        if (brandId && brandId !== 'all') {
            whereClause.product = { ...whereClause.product, brandId };
        }

        if (search && search !== 'all') {
            whereClause.OR = [
                { sku: { contains: search as string, mode: 'insensitive' } },
                { product: { name: { contains: search as string, mode: 'insensitive' } } },
                { product: { description: { contains: search as string, mode: 'insensitive' } } },
            ];
        }

        const [variants, totalCount] = await Promise.all([
            prisma.productVariant.findMany({
                where: whereClause,
                include: {
                    product: {
                        include: {
                            brand: { select: { id: true, name: true } },
                            category: { select: { id: true, name: true } },
                            subCategory: { select: { id: true, name: true } },
                        }
                    },
                    options: {
                        include: {
                            attribute: { select: { name: true } },
                            attributeValue: { select: { value: true } },
                        }
                    }
                },
                orderBy: sortBy === 'name' ? { product: { name: sortOrder as any } } : { [sortBy as string]: sortOrder as any },
                skip,
                take,
            }),
            prisma.productVariant.count({ where: whereClause })
        ]);

        const formattedData = variants.map(v => ({
            ...v.product,
            id: v.id, // Use variant ID as the primary ID for the table rows
            variantId: v.id,
            productId: v.product.id,
            name: v.product.name,
            sku: v.sku,
            price: v.price,
            qty: v.qty,
            options: formatVariantOptions(v.options),
            brand: v.product.brand,
            category: v.product.category,
            subCategory: v.product.subCategory,
            isLowStock: v.qty <= 10,
        }));

        res.json({
            data: formattedData,
            meta: {
                total: totalCount,
                page: parseInt(page as string),
                pageSize: take,
                totalPages: Math.ceil(totalCount / take),
                sortBy,
                sortOrder,
            }
        });
    } catch (error) {
        console.error("Get inventory error:", error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};

export const batchUpdateStock = async (req: Request, res: Response) => {
    try {
        const { variantIds, qty, type } = req.body; // type can be 'set', 'add', 'subtract'

        if (!Array.isArray(variantIds) || variantIds.length === 0) {
            return res.status(400).json({ error: "No variants selected" });
        }

        await prisma.$transaction(async (tx: any) => {
            for (const id of variantIds) {
                if (type === 'set') {
                    await tx.productVariant.update({ where: { id }, data: { qty: parseInt(qty) } });
                } else if (type === 'add') {
                    await tx.productVariant.update({ where: { id }, data: { qty: { increment: parseInt(qty) } } });
                } else if (type === 'subtract') {
                    await tx.productVariant.update({ where: { id }, data: { qty: { decrement: parseInt(qty) } } });
                }
            }
        });

        res.json({ success: true, message: `Batch updated ${variantIds.length} variants` });
    } catch (error) {
        console.error("Batch update stock error:", error);
        res.status(500).json({ error: 'Failed to update stock' });
    }
};
