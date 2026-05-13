import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getSubcategories = async (req: Request, res: Response) => {
    try {
        const subcategories = await prisma.subCategory.findMany({
            include: { category: true, _count: { select: { products: true } } },
            orderBy: { name: 'asc' }
        });
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch subcategories" });
    }
};

export const createSubcategory = async (req: Request, res: Response) => {
    try {
        const { name, categoryId } = req.body;
        const subcategory = await prisma.subCategory.create({
            data: { name, categoryId },
        });
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(500).json({ error: "Failed to create subcategory" });
    }
};

export const updateSubcategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, categoryId } = req.body;
        const subcategory = await prisma.subCategory.update({
            where: { id: id as string },
            data: { name, categoryId },
        });
        res.json(subcategory);
    } catch (error) {
        res.status(500).json({ error: "Failed to update subcategory" });
    }
};

export const deleteSubcategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const used = await prisma.product.count({ where: { subCategoryId: id as string } });
        if (used > 0) return res.status(400).json({ error: `Cannot delete. Used by ${used} products.` });

        await prisma.subCategory.delete({ where: { id: id as string } });
        res.json({ message: "Subcategory deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete subcategory" });
    }
};
