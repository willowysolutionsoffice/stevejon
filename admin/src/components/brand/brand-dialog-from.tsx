'use client';

import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Brand } from "@prisma/client";
import { createBrandSchema } from "@/schema/brand-schema";
import { API_URL } from "@/lib/api-client";

interface BrandDialogFormProps {
  brand?: Brand;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BrandDialogForm: FC<BrandDialogFormProps> = ({
  brand,
  open: isOpen = false,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(isOpen);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  const form = useForm<z.infer<typeof createBrandSchema>>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: brand?.name || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createBrandSchema>) => {
    setLoading(true);
    try {
        const url = brand ? `${API_URL}/brands/${brand.id}` : `${API_URL}/brands`;
        const method = brand ? "PATCH" : "POST";
        
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            toast.success(brand ? "Brand updated" : "Brand added");
            form.reset();
            router.refresh();
            setOpen(false);
            window.dispatchEvent(new CustomEvent("brands:updated"));
        } else {
            toast.error(result.error || "Failed to save brand");
        }
    } catch {
        toast.error("An error occurred");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!brand && (
        <DialogTrigger asChild>
          <Button variant="outline">Add Brand</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{brand ? "Edit" : "Add"} Brand</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {brand ? "Update brand details" : "Fill details of the brand here."}
        </DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
