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
import { useAction } from "next-safe-action/hooks";
import { createBrandAction, updateBrandAction } from "@/server/actions/brand-actions";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Brand } from "@prisma/client";
import { createBrandSchema } from "@/schema/brand-schema";

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
  const router = useRouter();

  const { 
    execute: createBrand, 
    isExecuting: isCreating,
    hasSucceeded: hasCreated,
    hasErrored: hasCreateError,
    result: createResult
  } = useAction(createBrandAction);
  
  const { 
    execute: updateBrand, 
    isExecuting: isUpdating,
    hasSucceeded: hasUpdated,
    hasErrored: hasUpdateError,
    result: updateResult
  } = useAction(updateBrandAction);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  const form = useForm<z.infer<typeof createBrandSchema>>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: brand?.name || "",
    },
  });

  // Handle create responses
  useEffect(() => {
    if (hasCreated && createResult?.data) {
      if (createResult.data.success) {
        toast.success(createResult.data.message || "Brand added successfully");
        form.reset();
        router.refresh();
        setOpen(false);
      } else if (createResult.data.error) {
        toast.error(createResult.data.error);
      }
    } else if (hasCreateError) {
      toast.error("Failed to add brand");
      console.log('create error', createResult);
    }
  }, [hasCreated, hasCreateError, createResult, form, router]);

  // Handle update responses
  useEffect(() => {
    if (hasUpdated && updateResult?.data) {
      if (updateResult.data.success) {
        toast.success(updateResult.data.message || "Brand updated successfully");
        form.reset();
        router.refresh();
        setOpen(false);
      } else if (updateResult.data.error) {
        toast.error(updateResult.data.error);
      }
    } else if (hasUpdateError) {
      toast.error("Failed to update brand");
      console.log('update error', updateResult);
    }
  }, [hasUpdated, hasUpdateError, updateResult, form, router]);

  const onSubmit = async (values: z.infer<typeof createBrandSchema>) => {
    if (brand) {
      updateBrand({ id: brand.id, name: values.name });
    } else {
      createBrand({ name: values.name });
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
