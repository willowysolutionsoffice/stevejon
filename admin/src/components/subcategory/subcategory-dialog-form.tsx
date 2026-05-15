'use client';

import { FC, useEffect, useState } from "react";
import { SubCategory, Category } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_URL } from "@/lib/api-client";

const subcategorySchema = z.object({
  name: z.string().min(1, "Subcategory name is required"),
  categoryId: z.string().min(1, "Category is required"),
});

interface SubcategoryDialogFormProps {
  open?: boolean;
  openChange?: (v: boolean) => void;
  subcategory?: SubCategory;
}

export const SubcategoryDialogForm: FC<SubcategoryDialogFormProps> = ({
  open: isOpen = false,
  openChange,
  subcategory,
}) => {
  const [open, setOpen] = useState(isOpen);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch categories for dropdown
  useEffect(() => {
    fetch(`${API_URL}/categories`, { cache: "no-store" })
      .then(res => res.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => toast.error("Failed to fetch categories"));
  }, []);

  useEffect(() => {
    openChange?.(open);
  }, [open, openChange]);

  const form = useForm<z.infer<typeof subcategorySchema>>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: subcategory?.name || "",
      categoryId: subcategory?.categoryId || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof subcategorySchema>) => {
    setLoading(true);
    try {
        const url = subcategory 
            ? `${API_URL}/subcategories/${subcategory.id}`
            : `${API_URL}/subcategories`;
        
        const method = subcategory ? "PATCH" : "POST";
        
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            toast.success(subcategory ? "Subcategory updated" : "Subcategory created");
            form.reset();
            router.refresh();
            setOpen(false);
            window.dispatchEvent(new CustomEvent("subcategories:updated"));
        } else {
            toast.error(result.error || "Failed to save subcategory");
        }
    } catch {
        toast.error("An error occurred");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!subcategory && (
        <DialogTrigger asChild>
          <Button variant="outline">Add Subcategory</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{subcategory ? "Edit" : "Add"} Subcategory</DialogTitle>
        </DialogHeader>
        <DialogDescription>Fill subcategory details below.</DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Subcategory Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
