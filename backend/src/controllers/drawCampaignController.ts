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

// POST /api/draws/:id/draw-winners
export const drawCampaignWinners = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const result = await prisma.$transaction(async (tx: any) => {
            const campaign = await tx.drawCampaign.findUnique({
                where: { id }
            });

            if (!campaign) {
                throw new Error("Draw campaign not found");
            }

            if (campaign.status !== "ACTIVE") {
                throw new Error(`Campaign must be ACTIVE to draw winners. Current status: ${campaign.status}`);
            }

            // Fetch all tickets for this campaign that belong to ACTIVE orders (status is not CANCELLED or FAILED)
            const tickets = await tx.luckyTicket.findMany({
                where: {
                    drawCampaignId: id,
                    order: {
                        status: {
                            notIn: ["CANCELLED", "FAILED"]
                        }
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true
                        }
                    }
                }
            });

            if (tickets.length === 0) {
                throw new Error("No active, eligible tickets found in this campaign to draw from");
            }

            // Shuffle tickets randomly using Fisher-Yates
            const shuffled = [...tickets];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            // Select up to winnerCount
            const countToSelect = Math.min(campaign.winnerCount, shuffled.length);
            const winners = shuffled.slice(0, countToSelect);

            const winnerIds = winners.map((w: any) => w.id);

            // Update winners
            await tx.luckyTicket.updateMany({
                where: {
                    id: { in: winnerIds }
                },
                data: {
                    isWinner: true
                }
            });

            // Set campaign status to COMPLETED
            const updatedCampaign = await tx.drawCampaign.update({
                where: { id },
                data: {
                    status: "COMPLETED"
                }
            });

            return {
                campaign: updatedCampaign,
                winners: winners
            };
        });

        res.json({ success: true, message: `Successfully drew ${result.winners.length} winner(s)!`, data: result });
    } catch (error: any) {
        console.error("❌ Draw campaign winners error:", error);
        res.status(400).json({ error: error.message || "Failed to draw winners" });
    }
};

// GET /api/draws/showcase – public, returns winners that have showcase data filled
export const getWinnersShowcase = async (req: Request, res: Response) => {
    try {
        const winners = await prisma.luckyTicket.findMany({
            where: {
                isWinner: true,
                winnerImage: { not: null },
            },
            include: {
                drawCampaign: {
                    select: { name: true, prizeName: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 8,
        });
        res.json({ success: true, data: winners });
    } catch (error: any) {
        console.error('❌ Get showcase error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch showcase winners' });
    }
};

// PATCH /api/draws/winners/:ticketId/showcase – admin uploads winner photo + sets display info
export const updateWinnerShowcase = async (req: Request, res: Response) => {
    try {
        const { ticketId } = req.params;
        const { winnerName, winnerPlace } = req.body;
        const file = req.file;

        const ticket = await prisma.luckyTicket.findUnique({ where: { id: ticketId } });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        if (!ticket.isWinner) return res.status(400).json({ error: 'Ticket is not a winning ticket' });

        let imageUrl = ticket.winnerImage;
        if (file) {
            imageUrl = await uploadToCloudinary(file.buffer, file.originalname);
        }

        const updated = await prisma.luckyTicket.update({
            where: { id: ticketId },
            data: {
                winnerImage: imageUrl,
                winnerName: winnerName?.trim() || ticket.winnerName,
                winnerPlace: winnerPlace?.trim() || ticket.winnerPlace,
            }
        });

        res.json({ success: true, data: updated });
    } catch (error: any) {
        console.error('❌ Update winner showcase error:', error);
        res.status(500).json({ error: error.message || 'Failed to update winner showcase' });
    }
};
