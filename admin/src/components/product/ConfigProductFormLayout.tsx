"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import ProductFormSection from "../AddProductForm";
import AddVariant from "./AddVariant";
import ProductImageAndCategories from "./configurable-product";
import { useRouter } from "next/navigation";
import {
  ConfigurableProductProvider,
  useConfigurableProduct,
} from "@/context/ConfigurableProductContext";
import { toast } from "sonner";
import { compressImage } from "@/lib/image-utils";
import { API_URL } from "@/lib/api-client";

interface ProductFormContentProps {
  isSimpleProduct: boolean;
  isEdit?: boolean;
  productId?: string;
}

function ProductFormContent({ isSimpleProduct }: ProductFormContentProps) {
  const router = useRouter();
  const { baseProduct, variants, setVariants, resetBaseProduct } =
    useConfigurableProduct();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validation
      if (!baseProduct.name.trim()) {
        toast.error("Product name is required");
        return;
      }

      if (!baseProduct.description.trim()) {
        toast.error("Product description is required");
        return;
      }

      if (!baseProduct.brandId) {
        toast.error("Brand is required");
        return;
      }

      if (!baseProduct.categoryId) {
        toast.error("Category is required");
        return;
      }

      if (!baseProduct.subCategoryId) {
        toast.error("Sub-category is required");
        return;
      }

      if (!baseProduct.mainImage) {
        toast.error("Main product image is required");
        return;
      }

      if (baseProduct.thumbnails.length === 0) {
        toast.error("At least one thumbnail is required");
        return;
      }

      if (baseProduct.basePrice <= 0) {
        toast.error("Base price must be greater than 0");
        return;
      }

      // Prepare final variants list
      let finalVariants = [...variants];
      
      // If no variants were added, automatically create a single default variant
      if (finalVariants.length === 0) {
        finalVariants = [{
          id: 'default-simple-variant',
          qty: baseProduct.baseQuantity,
          price: baseProduct.basePrice,
          offerPrice: baseProduct.baseDiscountPrice || undefined,
          images: [],
          attributes: [],
        }];
      }

      // Validate each variant has attributes (only for user-added variants)
      if (variants.length > 0) {
        for (let i = 0; i < finalVariants.length; i++) {
          if (finalVariants[i].attributes.length === 0) {
            toast.error(`Variant ${i + 1} must have at least one attribute`);
            return;
          }
        }
      }

      // Prepare FormData
      const formData = new FormData();

      // Add base product data
      formData.append("name", baseProduct.name);
      formData.append("description", baseProduct.description);
      formData.append("basePrice", baseProduct.basePrice.toString());
      formData.append("baseQuantity", baseProduct.baseQuantity.toString());
      formData.append("baseDiscountPrice", baseProduct.baseDiscountPrice.toString());
      formData.append("categoryId", baseProduct.categoryId);
      formData.append("subCategoryId", baseProduct.subCategoryId);
      
      if (baseProduct.brandId) {
        formData.append("brandId", baseProduct.brandId);
      }

      formData.append("isCustomerFavorite", baseProduct.isCustomerFavorite.toString());
      formData.append("isNewArrival", baseProduct.isNewArrival.toString());

      // Add main image (compressed)
      if (baseProduct.mainImage) {
        const compressedMain = await compressImage(baseProduct.mainImage);
        formData.append("mainImage", compressedMain);
      }

      // Add thumbnails (compressed)
      const compressedThumbnails = await Promise.all(
        baseProduct.thumbnails.map((file) => compressImage(file))
      );
      compressedThumbnails.forEach((file, index) => {
        formData.append(`thumbnails[${index}]`, file);
      });

      // Prepare variants data (without File objects), fallback to base details
      const variantsData = finalVariants.map((v) => ({
        price: v.price !== undefined && v.price !== null ? v.price : baseProduct.basePrice,
        qty: v.qty !== undefined && v.qty !== null ? v.qty : baseProduct.baseQuantity,
        offerPrice: v.offerPrice !== undefined && v.offerPrice !== null ? v.offerPrice : baseProduct.baseDiscountPrice,
        attributes: v.attributes.map((a) => ({
          attributeId: a.attributeId,
          valueId: a.valueId,
        })),
      }));

      formData.append("variants", JSON.stringify(variantsData));

      // Add variant images (compressed)
      for (let i = 0; i < finalVariants.length; i++) {
        const variant = finalVariants[i];
        const compressedVariantImages = await Promise.all(
          variant.images.map((file) => compressImage(file))
        );
        compressedVariantImages.forEach((file, imgIndex) => {
          formData.append(`variantImages[${i}][${imgIndex}]`, file);
        });
      }

      // Submit to API
      const response = await fetch(`${API_URL}/products/withvariant`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create product");
        } else {
          // Handle non-JSON errors (like 413 Request Entity Too Large)
          if (response.status === 413) {
            throw new Error("Product data and images are too large to upload. Please reduce image sizes or use fewer images.");
          }
          const text = await response.text();
          throw new Error(text.slice(0, 100) || "Server error occurred");
        }
      }

      const result = await response.json();

      toast.success("Product created successfully!");
      console.log("Created product:", result.product);

      // Reset form
      resetBaseProduct();
      setVariants([]);
      
      // Redirect to products list
      router.push("/products");
      router.refresh();

    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-9 px-4 cursor-pointer"
        >
          {loading ? "Saving..." : "Add Product"}
        </Button>
      </div>

      <div className="flex gap-3 w-full items-start">
        <div className="w-1/2">
          <ProductFormSection />
        </div>
        <div className="w-1/2">
          <ProductImageAndCategories />
        </div>
      </div>
      <AddVariant />
    </div>
  );
}

function ProductFormLayout({ isSimpleProduct }: { isSimpleProduct?: boolean }) {
  return (
    <ConfigurableProductProvider>
      <ProductFormContent isSimpleProduct={!!isSimpleProduct} />
    </ConfigurableProductProvider>
  );
}

export default ProductFormLayout;
