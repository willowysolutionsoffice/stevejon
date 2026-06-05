import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { uploadToCloudinary } from '../lib/upload.js';
import cloudinary from '../lib/cloudinary.js';
import { createDrawCampaignSchema, updateDrawCampaignSchema } from '../schemas/draw-campaign-schema.js';

// GET /api/draws
export const getAllDrawCampaigns = async (req: Request, res: Response) => {
    try {
        const campaigns = await prisma.drawCampaign.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: campaigns });
    } catch (error: any) {
        console.error("❌ Fetch draw campaigns error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch draw campaigns" });
    }
};

// POST /api/draws
export const createDrawCampaign = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "Prize image is required" });
        }

        // Validate text fields using Zod
        const parsed = createDrawCampaignSchema.parse(req.body);

        // Upload prize image to Cloudinary
        const photoUrl = await uploadToCloudinary(file.buffer, file.originalname);

        const campaign = await prisma.drawCampaign.create({
            data: {
                name: parsed.name,
                prizeName: parsed.prizeName,
                prizeImage: photoUrl,
                startDate: parsed.startDate,
                endDate: parsed.endDate,
                winnerCount: parsed.winnerCount,
                status: parsed.status,
            }
        });

        res.status(201).json({ success: true, data: campaign, message: "Draw campaign created successfully" });
    } catch (error: any) {
        console.error("❌ Create draw campaign error:", error);
        res.status(400).json({ error: error.message || "Failed to create draw campaign" });
    }
};

// PATCH /api/draws/:id
export const updateDrawCampaign = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const file = req.file;

        const existing = await prisma.drawCampaign.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({ error: "Draw campaign not found" });
        }

        // Validate fields
        const parsed = updateDrawCampaignSchema.parse(req.body);

        let photoUrl: string | undefined;
        if (file) {
            // Upload new image
            photoUrl = await uploadToCloudinary(file.buffer, file.originalname);

            // Delete old image from Cloudinary
            if (existing.prizeImage) {
                const publicId = existing.prizeImage.split("/").pop()?.split(".")[0];
                if (publicId) {
                    try {
                        await (cloudinary as any).uploader.destroy(`Deco moja/${publicId}`);
                    } catch (err) {
                        console.warn("⚠️ Failed to delete old image:", err);
                    }
                }
            }
        }

        const updated = await prisma.drawCampaign.update({
            where: { id },
            data: {
                ...(parsed.name !== undefined && { name: parsed.name }),
                ...(parsed.prizeName !== undefined && { prizeName: parsed.prizeName }),
                ...(photoUrl && { prizeImage: photoUrl }),
                ...(parsed.startDate !== undefined && { startDate: parsed.startDate }),
                ...(parsed.endDate !== undefined && { endDate: parsed.endDate }),
                ...(parsed.winnerCount !== undefined && { winnerCount: parsed.winnerCount }),
                ...(parsed.status !== undefined && { status: parsed.status }),
            }
        });

        res.json({ success: true, data: updated, message: "Draw campaign updated successfully" });
    } catch (error: any) {
        console.error("❌ Update draw campaign error:", error);
        res.status(400).json({ error: error.message || "Failed to update draw campaign" });
    }
};

// DELETE /api/draws/:id
export const deleteDrawCampaign = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const existing = await prisma.drawCampaign.findUnique({
            where: { id }
        });

        if (!existing) {
            return res.status(404).json({ error: "Draw campaign not found" });
        }

        // Clean up Cloudinary image
        if (existing.prizeImage) {
            const publicId = existing.prizeImage.split("/").pop()?.split(".")[0];
            if (publicId) {
                try {
                    await (cloudinary as any).uploader.destroy(`Deco moja/${publicId}`);
                } catch (err) {
                    console.warn("⚠️ Failed to delete image:", err);
                }
            }
        }

        await prisma.drawCampaign.delete({
            where: { id }
        });

        res.json({ success: true, message: "Draw campaign deleted successfully" });
    } catch (error: any) {
        console.error("❌ Delete draw campaign error:", error);
        res.status(500).json({ error: error.message || "Failed to delete draw campaign" });
    }
};

// GET /api/draws/:id/tickets
export const getDrawCampaignTickets = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        
        const campaign = await prisma.drawCampaign.findUnique({
            where: { id }
        });
        if (!campaign) {
            return res.status(404).json({ error: "Draw campaign not found" });
        }

        const tickets = await prisma.luckyTicket.findMany({
            where: { drawCampaignId: id },
            include: {
                order: {
                    select: {
                        id: true,
                        totalAmount: true,
                        createdAt: true,
                        status: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: tickets });
    } catch (error: any) {
        console.error("❌ Fetch campaign tickets error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch tickets for campaign" });
    }
};

