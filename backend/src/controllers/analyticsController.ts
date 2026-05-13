import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function formatVariantOptions(options: any[]): string {
    return options.map(opt => `${opt.attribute.name}: ${opt.attributeValue.value}`).join(', ');
}

export const getSalesMetrics = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, status, paymentMethod, userId } = req.query;
        const whereClause: any = {};

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
            if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
        }

        if (status) whereClause.status = status as string;
        if (paymentMethod) whereClause.paymentMethod = paymentMethod as string;
        if (userId) whereClause.userId = userId as string;

        const [totalSales, salesAggregation] = await Promise.all([
            prisma.order.count({ where: whereClause }),
            prisma.order.aggregate({
                where: whereClause,
                _sum: { totalAmount: true },
                _avg: { totalAmount: true },
            }),
        ]);

        res.json({
            totalSales,
            totalOrders: totalSales,
            averageOrderValue: salesAggregation._avg.totalAmount || 0,
            totalRevenue: salesAggregation._sum.totalAmount || 0,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales metrics' });
    }
};

export const getTopSellingProducts = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const { startDate, endDate } = req.query;
        const whereClause: any = {};

        if (startDate || endDate) {
            whereClause.order = { createdAt: {} };
            if (startDate) whereClause.order.createdAt.gte = new Date(startDate as string);
            if (endDate) whereClause.order.createdAt.lte = new Date(endDate as string);
        }

        const topVariants = await prisma.orderItem.groupBy({
            by: ['variantId'],
            where: whereClause,
            _sum: { quantity: true, price: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit,
        });

        const variantsWithDetails = await Promise.all(
            topVariants.map(async (item: any) => {
                const variant = await prisma.productVariant.findUnique({
                    where: { id: item.variantId },
                    include: {
                        product: { include: { brand: true, category: true } },
                        options: { include: { attribute: true, attributeValue: true } },
                    },
                });

                if (!variant) return null;

                return {
                    id: variant.product.id,
                    variantId: variant.id,
                    name: variant.product.name,
                    sku: variant.sku,
                    totalQuantity_sold: item._sum.quantity || 0,
                    totalRevenue: item._sum.price || 0,
                    currentStock: variant.qty,
                    brand: variant.product.brand?.name,
                    category: variant.product.category?.name,
                    image: variant.images[0] || variant.product.image,
                    variantOptions: formatVariantOptions(variant.options),
                };
            })
        );

        res.json(variantsWithDetails.filter((v: any) => v !== null));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top selling products' });
    }
};

export const getSalesByDateRange = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;
        const whereClause: any = {};

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
            if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            select: { createdAt: true, totalAmount: true },
            orderBy: { createdAt: 'asc' },
        });

        const salesByDate = orders.reduce((acc: any, order: any) => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!acc[date]) acc[date] = { sales: 0, orders: 0 };
            acc[date].sales += order.totalAmount;
            acc[date].orders += 1;
            return acc;
        }, {});

        res.json(Object.entries(salesByDate).map(([date, data]: any) => ({
            date,
            sales: data.sales,
            orders: data.orders,
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales by date range' });
    }
};
