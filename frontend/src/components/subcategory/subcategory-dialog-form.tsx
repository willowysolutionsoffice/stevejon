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
import { useAction } from "next-safe-action/hooks";
import { createSubCategoryAction, updateSubCategoryAction } from "@/server/actions/subcategory-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const router = useRouter();

  const { 
    execute: create, 
    isExecuting: isCreating, 
    hasSucceeded: hasCreated, 
    hasErrored: hasCreatedError, 
    result: createResult 
  } = useAction(createSubCategoryAction);
  
  const { 
    execute: updateSub, 
    isExecuting: isUpdating,
    hasSucceeded: hasUpdated,
    hasErrored: hasUpdateError,
    result: updateResult
  } = useAction(updateSubCategoryAction);

  // Fetch categories for dropdown
  useEffect(() => {
    fetch("/api/category", { cache: "no-store" })
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

  // Handle create responses
  useEffect(() => {
    if (hasCreated && createResult?.data) {
      if (createResult.data.success) {
        toast.success(createResult.data.message || "Subcategory created successfully");
        form.reset();
        router.refresh();
        setOpen(false);
      } else if (createResult.data.error) {
        toast.error(createResult.data.error);
      }
    } else if (hasCreatedError) {
      toast.error("Failed to create subcategory");
      console.log('create error', createResult);
    }
  }, [hasCreated, hasCreatedError, createResult, form, router]);

  // Handle update responses
  useEffect(() => {
    if (hasUpdated && updateResult?.data) {
      if (updateResult.data.success) {
        toast.success(updateResult.data.message || "Subcategory updated successfully");
        form.reset();
        router.refresh();
        setOpen(false);
      } else if (updateResult.data.error) {
        toast.error(updateResult.data.error);
      }
    } else if (hasUpdateError) {
      toast.error("Failed to update subcategory");
      console.log('update error', updateResult);
    }
  }, [hasUpdated, hasUpdateError, updateResult, form, router]);

  const onSubmit = async (values: z.infer<typeof subcategorySchema>) => {
    if (!subcategory) {
      create(values);
    } else {
      updateSub({ id: subcategory.id, ...values });
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
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Loading..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
