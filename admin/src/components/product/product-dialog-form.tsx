"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

export const ProductDialogForm = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOptionClick = (type: "simple" | "configurable") => {
    if (type === "simple") {
      router.push(`/products/add-product/simple-product`);
    } else {
      router.push(`/products/add-product/configurable-product`);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Product Type</DialogTitle>
          <DialogDescription>
            Choose the type of product you want to create.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={() => handleOptionClick("simple")}
          >
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 mt-0.5" />
              <div className="text-left">
                <div className="font-semibold">Simple Product</div>
                <div className="text-sm text-muted-foreground font-normal">
                  A single product without variations
                </div>
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-4"
            onClick={() => handleOptionClick("configurable")}
          >
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 mt-0.5" />
              <div className="text-left">
                <div className="font-semibold">Configurable Product</div>
                <div className="text-sm text-muted-foreground font-normal">
                  A product with multiple variations
                </div>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
