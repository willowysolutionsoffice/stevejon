"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductWithRelations } from "./inventory-table";
import { Badge } from "@/components/ui/badge";

export const inventoryColumns: ColumnDef<ProductWithRelations>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{product.name}</span>
          <span className="text-xs text-muted-foreground">{product.sku}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => row.original.category?.name || "N/A",
  },
  {
    accessorKey: "brand.name",
    header: "Brand",
    cell: ({ row }) => row.original.brand?.name || "N/A",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "qty",
    header: "Stock",
    cell: ({ row }) => {
      const qty = row.original.qty;
      const isLowStock = row.original.isLowStock;
      return (
        <div className="flex items-center gap-2">
          <span>{qty}</span>
          {isLowStock && (
            <Badge variant="destructive" className="text-[10px] px-1 py-0">
              Low
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const qty = row.original.qty;
      if (qty <= 0) return <Badge variant="destructive">Out of Stock</Badge>;
      if (row.original.isLowStock) return <Badge variant="outline" className="text-orange-500 border-orange-500">Low Stock</Badge>;
      return <Badge variant="outline" className="text-green-500 border-green-500">In Stock</Badge>;
    },
  },
];
