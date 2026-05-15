import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { uploadToCloudinary } from '../lib/upload.js';
import cloudinary from '../lib/cloudinary.js';

export const getBanners = async (req: Request, res: Response) => {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch banners" });
    }
};

export const createBanner = async (req: Request, res: Response) => {
    try {
        const { title, order } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!files?.desktopImage?.[0] || !files?.mobileImage?.[0]) {
            return res.status(400).json({ error: "Both desktop and mobile images are required" });
        }

        const desktopUrl = await uploadToCloudinary(files.desktopImage[0].buffer, files.desktopImage[0].originalname);
        const mobileUrl = await uploadToCloudinary(files.mobileImage[0].buffer, files.mobileImage[0].originalname);

        const banner = await prisma.banner.create({
            data: {
                title,
                order: order ? parseInt(order) : 0,
                desktopImage: desktopUrl,
                mobileImage: mobileUrl,
                isActive: true
            }
        });

        res.status(201).json(banner);
    } catch (error) {
        console.error("Create banner error:", error);
        res.status(500).json({ error: "Failed to create banner" });
    }
};

export const updateBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, order, isActive } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const existingBanner = await prisma.banner.findUnique({ where: { id } });
        if (!existingBanner) return res.status(404).json({ error: "Banner not found" });

        let desktopUrl = existingBanner.desktopImage;
        let mobileUrl = existingBanner.mobileImage;

        if (files?.desktopImage?.[0]) {
            // Delete old desktop image
            const publicId = existingBanner.desktopImage.split("/").pop()?.split(".")[0];
            if (publicId) await (cloudinary as any).uploader.destroy(`Deco moja/${publicId}`);
            desktopUrl = await uploadToCloudinary(files.desktopImage[0].buffer, files.desktopImage[0].originalname);
        }

        if (files?.mobileImage?.[0]) {
            // Delete old mobile image
            const publicId = existingBanner.mobileImage.split("/").pop()?.split(".")[0];
            if (publicId) await (cloudinary as any).uploader.destroy(`Deco moja/${publicId}`);
            mobileUrl = await uploadToCloudinary(files.mobileImage[0].buffer, files.mobileImage[0].originalname);
        }

        const updatedBanner = await prisma.banner.update({
            where: { id },
            data: {
                title: title !== undefined ? title : existingBanner.title,
                order: order !== undefined ? parseInt(order) : existingBanner.order,
                isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingBanner.isActive,
                desktopImage: desktopUrl,
                mobileImage: mobileUrl
            }
        });

        res.json(updatedBanner);
    } catch (error) {
        console.error("Update banner error:", error);
        res.status(500).json({ error: "Failed to update banner" });
    }
};

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const banner = await prisma.banner.findUnique({ where: { id } });
        if (!banner) return res.status(404).json({ error: "Banner not found" });

        // Delete images from Cloudinary
        const desktopId = banner.desktopImage.split("/").pop()?.split(".")[0];
        const mobileId = banner.mobileImage.split("/").pop()?.split(".")[0];

        if (desktopId) await (cloudinary as any).uploader.destroy(`Deco moja/${desktopId}`);
        if (mobileId) await (cloudinary as any).uploader.destroy(`Deco moja/${mobileId}`);

        await prisma.banner.delete({ where: { id } });
        res.json({ message: "Banner deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete banner" });
    }
};
