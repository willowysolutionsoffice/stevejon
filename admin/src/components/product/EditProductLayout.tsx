"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EditProductProvider, useEditProduct } from "@/context/EcitProductContext";
import type { ProductDetail } from "@/types/product";
import EditProductFormSection from "./EditProductForm";
import EditProductImageAndCategories from "./EditProductImageAndCategories";
import EditAddVariant from "./EditAddVariant";
import { API_URL } from "@/lib/api-client";

interface EditProductLayoutProps {
  productId: string;
}

function EditProductFormContent({ productId }: { productId: string }) {
  const {
    baseProduct,
    variants,
    setBaseProduct,
    setVariants,
    deletedVariantIds,
    getNewImages,
    getExistingImages,
  } = useEditProduct();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Fetch and populate product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products/${productId}`);
        const res = await response.json();
        
        if (response.ok && res.data) {
          const product: ProductDetail = res.data;

          // Set base product data
          setBaseProduct({
            name: product.name,
            description: product.description || "",
            mainImage: product.image, // URL string
            basePrice: product.variants[0]?.price || 0,
            baseQuantity: product.variants.reduce((sum, v) => sum + v.qty, 0),
            baseDiscountPrice: product.variants[0]?.offerPrice || 0,
            thumbnails: [], // Assuming subimages were handled differently or not present in schema
            brandId: product.brandId,
            categoryId: product.categoryId || "",
            subCategoryId: product.subCategoryId || "",
            isCustomerFavorite: product.isCustomerFavorite || false,
            isNewArrival: product.isNewArrival || false,
          });

          // Set variants data
          const mappedVariants = product.variants.map((variant) => ({
            id: variant.id,
            price: variant.price,
            qty: variant.qty,
            offerPrice: variant.offerPrice || undefined,
            images: variant.images, // URLs
            attributes: variant.options.map((opt) => ({
              attributeId: opt.attributeId,
              valueId: opt.valueId,
              attributeName: opt.attribute.name,
              value: opt.attributeValue.value,
            })),
            isNew: false,
            isModified: false,
          }));

          setVariants(mappedVariants);
          setInitialLoadDone(true);
        } else {
          toast.error(res.error || "Failed to load product");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while fetching the product.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId, setBaseProduct, setVariants]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Validation
      if (!baseProduct.name.trim()) {
        toast.error("Product name is required");
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

      if (baseProduct.basePrice <= 0) {
        toast.error("Base price must be greater than 0");
        return;
      }

      if (variants.length === 0) {
        toast.error("At least one variant is required");
        return;
      }

      // Validate each variant has attributes
      for (let i = 0; i < variants.length; i++) {
        if (variants[i].attributes.length === 0) {
          toast.error(`Variant ${i + 1} must have at least one attribute`);
          return;
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

      // Handle main image (new File or existing URL)
      if (baseProduct.mainImage instanceof File) {
        formData.append("mainImage", baseProduct.mainImage);
      } else {
        formData.append("existingMainImage", baseProduct.mainImage);
      }

      // Prepare variants data
      const variantsData = variants.map((v) => ({
        id: v.isNew ? undefined : v.id, // Include ID for existing variants
        price: v.price,
        qty: v.qty,
        offerPrice: v.offerPrice,
        attributes: v.attributes.map((a) => ({
          attributeId: a.attributeId,
          valueId: a.valueId,
        })),
        isNew: v.isNew,
        isModified: v.isModified,
      }));

      formData.append("variants", JSON.stringify(variantsData));

      // Add variant images
      variants.forEach((variant, variantIndex) => {
        const newImages = getNewImages(variant.images);
        const existingImages = getExistingImages(variant.images);

        newImages.forEach((file, imgIndex) => {
          formData.append(`variantImages[${variantIndex}][${imgIndex}]`, file);
        });

        if (existingImages.length > 0) {
          formData.append(
            `existingVariantImages[${variantIndex}]`,
            JSON.stringify(existingImages)
          );
        }
      });

      // Add deleted variant IDs
      if (deletedVariantIds.length > 0) {
        formData.append("deletedVariantIds", JSON.stringify(deletedVariantIds));
      }

      // Submit to API
      const response = await fetch(`${API_URL}/products/withvariant/${productId}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update product");
      }

      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (!initialLoadDone) {
    return (
      <div className="text-center text-gray-500 py-10">
        Product not found or failed to load.
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="h-9 px-4 cursor-pointer"
        >
          {submitting ? "Updating..." : "Update Product"}
        </Button>
      </div>

      <div className="flex gap-3 w-full items-start">
        <div className="w-1/2">
          <EditProductFormSection />
        </div>
        <div className="w-1/2">
          <EditProductImageAndCategories />
        </div>
      </div>

      <EditAddVariant />
    </div>
  );
}

export default function EditProductLayout({
  productId,
}: EditProductLayoutProps) {
  return (
    <EditProductProvider>
      <EditProductFormContent productId={productId} />
    </EditProductProvider>
  );
}
