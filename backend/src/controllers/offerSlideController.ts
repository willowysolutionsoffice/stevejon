import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { uploadToCloudinary } from '../lib/upload.js';
import cloudinary from '../lib/cloudinary.js';

export const getOfferSlides = async (req: Request, res: Response) => {
    try {
        const slides = await prisma.offerSlide.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch offer slides" });
    }
};

export const createOfferSlide = async (req: Request, res: Response) => {
    try {
        const { route, order } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: "Image is required" });

        const photoUrl = await uploadToCloudinary(file.buffer, file.originalname);

        const slide = await prisma.offerSlide.create({
            data: { 
                route: route || "/", 
                order: order ? parseInt(order) : 0, 
                image: photoUrl 
            },
        });

        res.status(201).json(slide);
    } catch (error) {
        console.error("Create offer slide error:", error);
        res.status(500).json({ error: "Failed to create offer slide" });
    }
};

export const deleteOfferSlide = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const slide = await prisma.offerSlide.findUnique({ where: { id: id as string } });
        if (!slide) return res.status(404).json({ error: "Slide not found" });

        if (slide.image) {
            const publicId = slide.image.split("/").pop()?.split(".")[0];
            if (publicId) await (cloudinary as any).uploader.destroy(`Deco moja/${publicId}`);
        }

        await prisma.offerSlide.delete({ where: { id: id as string } });
        res.json({ message: "Slide deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete offer slide" });
    }
};
