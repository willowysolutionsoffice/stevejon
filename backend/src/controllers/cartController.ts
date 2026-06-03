import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// Helper to resolve variant ID from productId, size, and color if variantId is not provided
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

    // Try color-only or size-only partial match
    const partialMatch = product.variants.find(v => {
        const hasSize = size ? v.options.some(opt => opt.attribute.name.toLowerCase() === 'size' && opt.attributeValue.value.toLowerCase() === size.toLowerCase()) : false;
        const hasColor = color ? v.options.some(opt => opt.attribute.name.toLowerCase() === 'color' && opt.attributeValue.value.toLowerCase() === color.toLowerCase()) : false;
        return hasSize || hasColor;
    });

    if (partialMatch) return partialMatch.id;

    // Fallback to the first variant
    return product.variants[0].id;
};

// GET /api/cart
export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // Get user's cart with items
        const cart = await prisma.cart.findUnique({
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
                                },
                                options: {
                                    include: {
                                        attribute: true,
                                        attributeValue: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }) || await prisma.cart.create({
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
                                },
                                options: {
                                    include: {
                                        attribute: true,
                                        attributeValue: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Map items to frontend format
        const mappedItems = cart.items.map(item => {
            const variant = item.variant;
            const product = variant.product;
            
            const sizeOption = variant.options.find(opt => opt.attribute.name.toLowerCase() === 'size');
            const colorOption = variant.options.find(opt => opt.attribute.name.toLowerCase() === 'color');
            
            return {
                id: `${product.id}-${sizeOption?.attributeValue.value || 'Classic'}-${colorOption?.attributeValue.value || 'Classic'}`,
                productId: product.id,
                variantId: variant.id,
                title: product.name,
                category: product.category?.name || 'Apparel',
                price: variant.price,
                image: variant.images[0] || product.image,
                size: sizeOption?.attributeValue.value || 'M',
                color: colorOption?.attributeValue.value || 'Classic',
                quantity: item.quantity,
                stock: variant.qty
            };
        });

        res.json({ success: true, data: mappedItems });
    } catch (error: any) {
        console.error("Get cart error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch cart" });
    }
};

// POST /api/cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { productId, variantId, size, color, quantity = 1 } = req.body;

        let resolvedVariantId = variantId;

        if (!resolvedVariantId) {
            if (!productId) {
                return res.status(400).json({ error: "Either variantId or productId is required" });
            }
            resolvedVariantId = await resolveVariantId(productId, size, color);
        }

        // Get or create cart
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        // Fetch variant to check stock
        const variant = await prisma.productVariant.findUnique({
            where: { id: resolvedVariantId }
        });

        if (!variant) {
            return res.status(404).json({ error: "Product variant not found" });
        }

        // Check existing cart item quantity
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_variantId: {
                    cartId: cart.id,
                    variantId: resolvedVariantId
                }
            }
        });

        const currentQtyInCart = existingItem ? existingItem.quantity : 0;
        if (currentQtyInCart + quantity > variant.qty) {
            return res.status(400).json({
                error: `Only ${variant.qty} items left in stock. You already have ${currentQtyInCart} in your cart.`
            });
        }

        // Upsert cart item
        const cartItem = await prisma.cartItem.upsert({
            where: {
                cartId_variantId: {
                    cartId: cart.id,
                    variantId: resolvedVariantId
                }
            },
            update: {
                quantity: {
                    increment: quantity
                }
            },
            create: {
                cartId: cart.id,
                variantId: resolvedVariantId,
                quantity: quantity
            }
        });

        res.json({ success: true, data: cartItem });
    } catch (error: any) {
        console.error("Add to cart error:", error);
        res.status(500).json({ error: error.message || "Failed to add item to cart" });
    }
};

// PUT /api/cart
export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { variantId, quantity } = req.body;

        if (!variantId || quantity === undefined) {
            return res.status(400).json({ error: "variantId and quantity are required" });
        }

        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        if (quantity <= 0) {
            // Delete if quantity is 0 or less
            await prisma.cartItem.delete({
                where: {
                    cartId_variantId: {
                        cartId: cart.id,
                        variantId
                    }
                }
            });
            return res.json({ success: true, message: "Item removed from cart" });
        }

        // Fetch variant to check stock
        const variant = await prisma.productVariant.findUnique({
            where: { id: variantId }
        });

        if (!variant) {
            return res.status(404).json({ error: "Product variant not found" });
        }

        if (quantity > variant.qty) {
            return res.status(400).json({
                error: `Requested quantity exceeds stock. Only ${variant.qty} items left in stock.`
            });
        }

        const updated = await prisma.cartItem.update({
            where: {
                cartId_variantId: {
                    cartId: cart.id,
                    variantId
                }
            },
            data: { quantity }
        });

        res.json({ success: true, data: updated });
    } catch (error: any) {
        console.error("Update cart item error:", error);
        res.status(500).json({ error: error.message || "Failed to update cart item" });
    }
};

// DELETE /api/cart/items/:variantId
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const variantId = req.params.variantId as string;

        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        await prisma.cartItem.delete({
            where: {
                cartId_variantId: {
                    cartId: cart.id,
                    variantId
                }
            }
        });

        res.json({ success: true, message: "Item removed from cart" });
    } catch (error: any) {
        console.error("Remove from cart error:", error);
        res.status(500).json({ error: error.message || "Failed to remove item from cart" });
    }
};

// DELETE /api/cart
export const clearCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }

        res.json({ success: true, message: "Cart cleared successfully" });
    } catch (error: any) {
        console.error("Clear cart error:", error);
        res.status(500).json({ error: error.message || "Failed to clear cart" });
    }
};

// POST /api/cart/sync
export const syncCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { items } = req.body; // Expect array of { productId, variantId, size, color, quantity }

        if (!Array.isArray(items)) {
            return res.status(400).json({ error: "Items array is required" });
        }

        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        for (const item of items) {
            try {
                let resolvedVariantId = item.variantId;
                if (!resolvedVariantId && item.productId) {
                    resolvedVariantId = await resolveVariantId(item.productId, item.size, item.color);
                }

                if (resolvedVariantId) {
                    await prisma.cartItem.upsert({
                        where: {
                            cartId_variantId: {
                                cartId: cart.id,
                                variantId: resolvedVariantId
                            }
                        },
                        update: {
                            quantity: item.quantity
                        },
                        create: {
                            cartId: cart.id,
                            variantId: resolvedVariantId,
                            quantity: item.quantity
                        }
                    });
                }
            } catch (err) {
                console.warn(`Sync item skipped due to error:`, err);
            }
        }

        res.json({ success: true, message: "Cart synced successfully" });
    } catch (error: any) {
        console.error("Sync cart error:", error);
        res.status(500).json({ error: error.message || "Failed to sync cart" });
    }
};
