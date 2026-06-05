import { Request, Response } from 'express';
import { prisma as prismaClient } from '../lib/prisma.js';
const prisma = prismaClient as any;

// GET /api/profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                createdAt: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error: any) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch profile" });
    }
};

// PUT /api/profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { name, phone, image } = req.body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (image !== undefined) updateData.image = image;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                createdAt: true,
                role: true
            }
        });

        res.json({ success: true, data: updatedUser });
    } catch (error: any) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: error.message || "Failed to update profile" });
    }
};

// GET /api/profile/addresses
export const getAddresses = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        res.json({ success: true, data: addresses });
    } catch (error: any) {
        console.error("Get addresses error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch addresses" });
    }
};

// POST /api/profile/addresses
export const createAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { name, phone, street, city, state, pincode, isDefault = false } = req.body;

        if (!name || !phone || !street || !city || !state || !pincode) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already has addresses
        const existingCount = await prisma.address.count({ where: { userId } });
        const shouldBeDefault = existingCount === 0 || isDefault;

        // Start a transaction if marking as default
        const address = await prisma.$transaction(async (tx: any) => {
            if (shouldBeDefault) {
                // Remove default flag from other addresses
                await tx.address.updateMany({
                    where: { userId },
                    data: { isDefault: false }
                });
            }

            return tx.address.create({
                data: {
                    userId,
                    name,
                    phone,
                    street,
                    city,
                    state,
                    pincode,
                    isDefault: shouldBeDefault
                }
            });
        });

        res.status(201).json({ success: true, data: address });
    } catch (error: any) {
        console.error("Create address error:", error);
        res.status(500).json({ error: error.message || "Failed to create address" });
    }
};

// PUT /api/profile/addresses/:id
export const updateAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const addressId = req.params.id as string;
        const { name, phone, street, city, state, pincode, isDefault } = req.body;

        // Verify address ownership
        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId }
        });

        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ error: "Address not found" });
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (street !== undefined) updateData.street = street;
        if (city !== undefined) updateData.city = city;
        if (state !== undefined) updateData.state = state;
        if (pincode !== undefined) updateData.pincode = pincode;

        const address = await prisma.$transaction(async (tx: any) => {
            if (isDefault === true && !existingAddress.isDefault) {
                // Remove default flag from other addresses
                await tx.address.updateMany({
                    where: { userId },
                    data: { isDefault: false }
                });
                updateData.isDefault = true;
            }

            return tx.address.update({
                where: { id: addressId },
                data: updateData
            });
        });

        res.json({ success: true, data: address });
    } catch (error: any) {
        console.error("Update address error:", error);
        res.status(500).json({ error: error.message || "Failed to update address" });
    }
};

// DELETE /api/profile/addresses/:id
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const addressId = req.params.id as string;

        // Verify address ownership
        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId }
        });

        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ error: "Address not found" });
        }

        await prisma.address.delete({
            where: { id: addressId }
        });

        // If we deleted the default address, set another one as default if exists
        if (existingAddress.isDefault) {
            const nextAddress = await prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });

            if (nextAddress) {
                await prisma.address.update({
                    where: { id: nextAddress.id },
                    data: { isDefault: true }
                });
            }
        }

        res.json({ success: true, message: "Address deleted successfully" });
    } catch (error: any) {
        console.error("Delete address error:", error);
        res.status(500).json({ error: error.message || "Failed to delete address" });
    }
};

// PUT /api/profile/addresses/:id/default
export const setDefaultAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const addressId = req.params.id as string;

        // Verify address ownership
        const existingAddress = await prisma.address.findUnique({
            where: { id: addressId }
        });

        if (!existingAddress || existingAddress.userId !== userId) {
            return res.status(404).json({ error: "Address not found" });
        }

        const address = await prisma.$transaction(async (tx: any) => {
            // Remove default flag from all other addresses of this user
            await tx.address.updateMany({
                where: { userId },
                data: { isDefault: false }
            });

            // Set this one as default
            return tx.address.update({
                where: { id: addressId },
                data: { isDefault: true }
            });
        });

        res.json({ success: true, data: address, message: "Default address updated successfully" });
    } catch (error: any) {
        console.error("Set default address error:", error);
        res.status(500).json({ error: error.message || "Failed to set default address" });
    }
};

// GET /api/profile/tickets
export const getMyTickets = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const tickets = await prisma.luckyTicket.findMany({
            where: { userId },
            include: {
                drawCampaign: {
                    select: {
                        name: true,
                        prizeName: true,
                        prizeImage: true,
                        startDate: true,
                        endDate: true,
                        status: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        totalAmount: true,
                        status: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: tickets });
    } catch (error: any) {
        console.error("❌ Get my tickets error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch tickets" });
    }
};
