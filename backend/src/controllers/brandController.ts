import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getBrands = async (req: Request, res: Response) => {
    try {
        const brands = await prisma.brand.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: 'asc' }
        });
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch brands" });
    }
};

export const createBrand = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const brand = await prisma.brand.create({
            data: { name },
        });
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({ error: "Failed to create brand" });
    }
};

export const updateBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const brand = await prisma.brand.update({
            where: { id: id as string },
            data: { name },
        });
        res.json(brand);
    } catch (error) {
        res.status(500).json({ error: "Failed to update brand" });
    }
};

export const deleteBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const used = await prisma.product.count({ where: { brandId: id as string } });
        if (used > 0) return res.status(400).json({ error: `Cannot delete. Used by ${used} products.` });

        await prisma.brand.delete({ where: { id: id as string } });
        res.json({ message: "Brand deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete brand" });
    }
};
