//product/page.tsx
import { productColumns } from "@/components/product/product-columns";
import ProductTable from "@/components/product/product-table";


export default async function ProductPage() {
  return <ProductTable columns={productColumns} />;
}
