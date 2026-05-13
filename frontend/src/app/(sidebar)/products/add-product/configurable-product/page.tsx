import ProductFormLayout from "@/components/product/ConfigProductFormLayout";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AddConfigurableProductPage() {
  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <div className="container flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6  py-4 md:py-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Add New Product
              </h1>
              <p className="text-muted-foreground">
                Fill in the details below to create a new product
              </p>
            </div>
            <Link 
              href="/products/add-product/simple-product"
              className="inline-flex items-center gap-2 px-4 py-2 border text-sm border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add Simple Product
            </Link>
          </div>

          {/* Product Form */}
            <ProductFormLayout isSimpleProduct={false} />
        </div>
      </div>
    </div>
  );
}
