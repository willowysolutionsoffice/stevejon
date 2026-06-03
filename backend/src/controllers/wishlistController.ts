import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// Helper to resolve variant ID from productId, size, and color
const resolveVariantId = async (productId: string, size?: string, color?: string): Promise<string> => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            variants: {
                include: {
                    options: {
                        include: {
                            attribute: true,
                            attributeValue: true
                        }
                    }
                }
            }
        }
    });

    if (!product) {
        throw new Error("Product not found");
    }

    if (product.variants.length === 0) {
        throw new Error("Product has no variants");
    }

    // Try to find matching variant
    const match = product.variants.find(v => {
        const hasSize = size ? v.options.some(opt => opt.attribute.name.toLowerCase() === 'size' && opt.attributeValue.value.toLowerCase() === size.toLowerCase()) : true;
        const hasColor = color ? v.options.some(opt => opt.attribute.name.toLowerCase() === 'color' && opt.attributeValue.value.toLowerCase() === color.toLowerCase()) : true;
        return hasSize && hasColor;
    });

    if (match) return match.id;

    // Fallback to the first variant
    return product.variants[0].id;
};

// GET /api/wishlist
export const getWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const wishlist = await prisma.wishlist.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        category: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }) || await prisma.wishlist.create({
            data: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        category: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Map items to WishlistItem format
        const mappedItems = wishlist.items.map(item => {
            const variant = item.variant;
            const product = variant.product;
            
            return {
                id: variant.id, // we can use variantId as the id
                productId: product.id,
                variantId: variant.id,
                title: product.name,
                category: product.category?.name || 'Apparel',
                price: variant.price,
                image: variant.images[0] || product.image
            };
        });

        res.json({ success: true, data: mappedItems });
    } catch (error: any) {
        console.error("Get wishlist error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch wishlist" });
    }
};

// POST /api/wishlist
export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { productId, variantId } = req.body;

        let resolvedVariantId = variantId;

        if (!resolvedVariantId) {
            if (!productId) {
                return res.status(400).json({ error: "Either variantId or productId is required" });
            }
            resolvedVariantId = await resolveVariantId(productId);
        }

        // Get or create wishlist
        let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
        if (!wishlist) {
            wishlist = await prisma.wishlist.create({ data: { userId } });
        }

        const wishlistItem = await prisma.wishlistItem.upsert({
            where: {
                wishlistId_variantId: {
                    wishlistId: wishlist.id,
                    variantId: resolvedVariantId
                }
            },
            update: {}, // Nothing to update if already exists
            create: {
                wishlistId: wishlist.id,
                variantId: resolvedVariantId
            }
        });

        res.json({ success: true, data: wishlistItem });
    } catch (error: any) {
        console.error("Add to wishlist error:", error);
        res.status(500).json({ error: error.message || "Failed to add item to wishlist" });
    }
};

// DELETE /api/wishlist/items/:variantId
export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const variantId = req.params.variantId as string;

        const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
        if (!wishlist) {
            return res.status(404).json({ error: "Wishlist not found" });
        }

        await prisma.wishlistItem.delete({
            where: {
                wishlistId_variantId: {
                    wishlistId: wishlist.id,
                    variantId
                }
            }
        });

        res.json({ success: true, message: "Item removed from wishlist" });
    } catch (error: any) {
        console.error("Remove from wishlist error:", error);
        res.status(500).json({ error: error.message || "Failed to remove item from wishlist" });
    }
};

// POST /api/wishlist/sync
export const syncWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { items } = req.body; // Expect array of { productId, variantId }

        if (!Array.isArray(items)) {
            return res.status(400).json({ error: "Items array is required" });
        }

        let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
        if (!wishlist) {
            wishlist = await prisma.wishlist.create({ data: { userId } });
        }

        for (const item of items) {
            try {
                let resolvedVariantId = item.variantId;
                if (!resolvedVariantId && item.productId) {
                    resolvedVariantId = await resolveVariantId(item.productId);
                }

                if (resolvedVariantId) {
                    await prisma.wishlistItem.upsert({
                        where: {
                            wishlistId_variantId: {
                                wishlistId: wishlist.id,
                                variantId: resolvedVariantId
                            }
                        },
                        update: {},
                        create: {
                            wishlistId: wishlist.id,
                            variantId: resolvedVariantId
                        }
                    });
                }
            } catch (err) {
                console.warn(`Sync wishlist item skipped due to error:`, err);
            }
        }

        res.json({ success: true, message: "Wishlist synced successfully" });
    } catch (error: any) {
        console.error("Sync wishlist error:", error);
        res.status(500).json({ error: error.message || "Failed to sync wishlist" });
    }
};
