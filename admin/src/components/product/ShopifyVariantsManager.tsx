"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, AlertCircle, Eye, EyeOff, Upload, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfigurableProduct } from "@/context/ConfigurableProductContext";
import { useEditProduct } from "@/context/EcitProductContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { API_URL } from "@/lib/api-client";

interface ShopifyVariantsManagerProps {
  mode: "create" | "edit";
}

interface OptionBlock {
  id: string;
  name: string;
  values: string[];
  isEditing: boolean;
}

interface DbAttribute {
  id: string;
  name: string;
  values: { id: string; value: string }[];
}

interface VariantAttribute {
  attributeId: string;
  valueId: string;
  attributeName: string;
  value: string;
}

interface ShopifyVariant {
  id: string;
  price?: number;
  qty?: number;
  offerPrice?: number;
  images: (File | string)[];
  attributes: VariantAttribute[];
  isNew?: boolean;
  isModified?: boolean;
}

// Wrapper for Create Mode
function CreateShopifyVariantsWrapper() {
  const ctx = useConfigurableProduct();
  return <ShopifyVariantsManagerUI ctx={ctx as unknown as ShopifyVariantsManagerUIProps["ctx"]} mode="create" />;
}

// Wrapper for Edit Mode
function EditShopifyVariantsWrapper() {
  const ctx = useEditProduct();
  return <ShopifyVariantsManagerUI ctx={ctx as unknown as ShopifyVariantsManagerUIProps["ctx"]} mode="edit" />;
}

// Main component delegates to wrapper
export default function ShopifyVariantsManager({ mode }: ShopifyVariantsManagerProps) {
  if (mode === "create") {
    return <CreateShopifyVariantsWrapper />;
  }
  return <EditShopifyVariantsWrapper />;
}

interface ShopifyVariantsManagerUIProps {
  ctx: {
    baseProduct: {
      basePrice?: number;
      baseQuantity?: number;
      baseDiscountPrice?: number;
    };
    variants: ShopifyVariant[];
    setVariants: React.Dispatch<React.SetStateAction<ShopifyVariant[]>>;
  };
  mode: "create" | "edit";
}

function ShopifyVariantsManagerUI({ ctx, mode }: ShopifyVariantsManagerUIProps) {
  const {
    baseProduct,
    variants,
    setVariants,
  } = ctx;

  // Local state for option cards
  const [optionsState, setOptionsState] = useState<OptionBlock[]>([]);
  const [availableAttributes, setAvailableAttributes] = useState<DbAttribute[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [syncingOptionId, setSyncingOptionId] = useState<string | null>(null);

  // Expanded groups tracking in the grid list
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [groupByOption, setGroupByOption] = useState<string>("");

  // Input state for adding new option values
  const [newValueInputs, setNewValueInputs] = useState<{ [key: string]: string }>({});

  // Active (selected) variants for publishing
  const [activeVariantIds, setActiveVariantIds] = useState<{ [key: string]: boolean }>({});

  // 1. Fetch backend attributes on mount
  const fetchAttributes = async () => {
    setLoadingAttributes(true);
    try {
      const response = await fetch(`${API_URL}/attributes`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setAvailableAttributes(data);
      }
    } catch (e) {
      console.error("Failed to fetch attributes:", e);
    } finally {
      setLoadingAttributes(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // 2. Reconstruct option cards in Edit Mode from database variants
  useEffect(() => {
    if (variants.length > 0 && optionsState.length === 0) {
      const optionMap: { [key: string]: Set<string> } = {};
      variants.forEach((v: ShopifyVariant) => {
        v.attributes.forEach((attr: VariantAttribute) => {
          if (!optionMap[attr.attributeName]) {
            optionMap[attr.attributeName] = new Set<string>();
          }
          optionMap[attr.attributeName].add(attr.value);
        });
      });

      const reconstructed = Object.keys(optionMap).map((name, idx) => ({
        id: `opt-${idx}-${Date.now()}`,
        name: name,
        values: Array.from(optionMap[name]),
        isEditing: false,
      }));
      setOptionsState(reconstructed);

      // Default Group By to first option
      if (reconstructed.length > 0) {
        setGroupByOption(reconstructed[0].name);
      }
    }
  }, [variants]);

  // Set default group by option when options change
  useEffect(() => {
    const doneOptions = optionsState.filter(opt => !opt.isEditing && opt.name.trim() !== "");
    if (doneOptions.length > 0 && (!groupByOption || !doneOptions.some(o => o.name === groupByOption))) {
      setGroupByOption(doneOptions[0].name);
    }
  }, [optionsState, groupByOption]);

  // Sync checkboxes with active variants
  useEffect(() => {
    if (variants.length > 0 && Object.keys(activeVariantIds).length === 0) {
      const initialActive: { [key: string]: boolean } = {};
      variants.forEach((v: ShopifyVariant) => {
        initialActive[v.id] = true;
      });
      setActiveVariantIds(initialActive);
    }
  }, [variants]);

  // 3. Sync attribute and values with backend database on "Done" click
  const handleDone = async (blockId: string) => {
    const block = optionsState.find(o => o.id === blockId);
    if (!block) return;

    const optName = block.name.trim();
    if (!optName) {
      toast.error("Option name is required");
      return;
    }

    if (block.values.length === 0) {
      toast.error("Please add at least one value for this option");
      return;
    }

    setSyncingOptionId(blockId);
    try {
      // Step A: Find or Create Attribute in DB
      let attribute = availableAttributes.find(
        (a) => a.name.toLowerCase() === optName.toLowerCase()
      );

      if (!attribute) {
        // Create new attribute
        const response = await fetch(`${API_URL}/attributes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: optName }),
          credentials: "include",
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to create attribute in database");
        }
        const newAttr = await response.json();
        attribute = { ...newAttr, values: [] };
        // Update local available list
        setAvailableAttributes((prev: DbAttribute[]) => [...prev, attribute!]);
      }

      const attributeId = attribute!.id;
      const dbValues = attribute!.values || [];

      // Step B: For each value, Find or Create AttributeValue in DB
      const syncedValues: { id: string; value: string }[] = [];

      for (const valName of block.values) {
        let valObj = dbValues.find(
          (v) => v.value.toLowerCase() === valName.toLowerCase()
        );

        if (!valObj) {
          // Create new value
          const response = await fetch(`${API_URL}/attributes/values`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ attributeId, value: valName }),
            credentials: "include",
          });
          if (!response.ok) {
            throw new Error(`Failed to create value "${valName}" in database`);
          }
          const newVal = await response.json();
          valObj = newVal;
          // Update local state value cache
          attribute!.values = [...(attribute!.values || []), valObj!];
        }

        syncedValues.push(valObj!);
      }

      // Step C: Update optionsState block
      setOptionsState((prev: OptionBlock[]) =>
        prev.map(o => (o.id === blockId ? { ...o, isEditing: false } : o))
      );

      // Re-trigger combinations regeneration
      toast.success(`Option "${optName}" synced successfully!`);
      fetchAttributes(); // Refresh lists
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to sync option with backend";
      toast.error(message);
    } finally {
      setSyncingOptionId(null);
    }
  };

  // 4. Cartesian combinations calculations
  useEffect(() => {
    // Generate combinations only from options that are NOT editing
    const activeOpts = optionsState.filter(o => !o.isEditing && o.name.trim() !== "" && o.values.length > 0);
    if (activeOpts.length === 0) {
      if (mode === "edit") return; // Keep existing DB variants if we have none active
      setVariants([]);
      return;
    }

    const combinations: VariantAttribute[][] = [];
    const helper = (acc: VariantAttribute[], index: number) => {
      if (index === activeOpts.length) {
        combinations.push(acc);
        return;
      }

      const opt = activeOpts[index];
      const dbAttr = availableAttributes.find(a => a.name.toLowerCase() === opt.name.toLowerCase());
      if (!dbAttr) return;

      opt.values.forEach(val => {
        const valObj = dbAttr.values?.find(v => v.value.toLowerCase() === val.toLowerCase());
        if (valObj) {
          helper(
            [
              ...acc,
              {
                attributeId: dbAttr.id,
                valueId: valObj.id,
                attributeName: dbAttr.name,
                value: valObj.value,
              },
            ],
            index + 1
          );
        }
      });
    };

    helper([], 0);

    if (combinations.length === 0) return;

    // Map combinations to VariantData/EditVariantData
    const newVariants = combinations.map((combo, idx) => {
      // Find matching existing variant to preserve price/stock/images
      const title = combo.map(c => c.value).join(" / ");
      
      const existing = variants.find((v: ShopifyVariant) => {
        if (v.attributes.length !== combo.length) return false;
        return combo.every(c =>
          v.attributes.some(
            (a: VariantAttribute) =>
              a.attributeId === c.attributeId &&
              a.valueId === c.valueId
          )
        );
      });

      if (existing) {
        return existing;
      }

      return {
        id: `new-${idx}-${Date.now()}`,
        price: baseProduct.basePrice || 0,
        qty: baseProduct.baseQuantity || 0,
        offerPrice: baseProduct.baseDiscountPrice || undefined,
        images: [],
        attributes: combo,
        isNew: true,
        isModified: false,
      };
    });

    setVariants(newVariants);
  }, [optionsState, availableAttributes]);

  // Option row manipulations
  const addOptionCard = () => {
    if (optionsState.length >= 3) {
      toast.error("You can add up to 3 options maximum");
      return;
    }
    const newBlock: OptionBlock = {
      id: `opt-${Date.now()}`,
      name: "",
      values: [],
      isEditing: true,
    };
    setOptionsState([...optionsState, newBlock]);
  };

  const deleteOptionCard = (id: string) => {
    setOptionsState(optionsState.filter(o => o.id !== id));
  };

  const editOptionCard = (id: string) => {
    setOptionsState(
      optionsState.map(o => (o.id === id ? { ...o, isEditing: true } : o))
    );
  };

  const handleValueAdd = (blockId: string) => {
    const rawVal = newValueInputs[blockId] || "";
    const cleanVal = rawVal.trim().replace(/,/g, "");

    if (!cleanVal) return;

    setOptionsState((prev: OptionBlock[]) =>
      prev.map(o => {
        if (o.id === blockId) {
          if (o.values.includes(cleanVal)) {
            toast.error(`"${cleanVal}" is already added`);
            return o;
          }
          return { ...o, values: [...o.values, cleanVal] };
        }
        return o;
      })
    );

    setNewValueInputs((prev: Record<string, string>) => ({ ...prev, [blockId]: "" }));
  };

  const removeValueIndex = (blockId: string, index: number) => {
    setOptionsState((prev: OptionBlock[]) =>
      prev.map(o => {
        if (o.id === blockId) {
          return { ...o, values: o.values.filter((_, idx) => idx !== index) };
        }
        return o;
      })
    );
  };

  const updateValueIndex = (blockId: string, index: number, value: string) => {
    setOptionsState((prev: OptionBlock[]) =>
      prev.map(o => {
        if (o.id === blockId) {
          const copy = [...o.values];
          copy[index] = value;
          return { ...o, values: copy };
        }
        return o;
      })
    );
  };

  // Grouping variations for Combinations table
  const getGroupedVariants = () => {
    if (!groupByOption) return {};

    const groups: { [key: string]: typeof variants } = {};
    variants.forEach((v: ShopifyVariant) => {
      const match = v.attributes.find((a: VariantAttribute) => a.attributeName === groupByOption);
      const key = match ? match.value : "Default";
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    });

    return groups;
  };

  const handleGroupPriceChange = (groupKey: string, priceStr: string) => {
    const price = parseFloat(priceStr) || 0;
    setVariants((prev: ShopifyVariant[]) =>
      prev.map((v: ShopifyVariant) => {
        const match = v.attributes.find((a: VariantAttribute) => a.attributeName === groupByOption);
        if (match && match.value === groupKey) {
          return { ...v, price, isModified: !v.isNew };
        }
        return v;
      })
    );
  };

  const handleGroupQtyChange = (groupKey: string, qtyStr: string) => {
    const qty = parseInt(qtyStr, 10) || 0;
    setVariants((prev: ShopifyVariant[]) =>
      prev.map((v: ShopifyVariant) => {
        const match = v.attributes.find((a: VariantAttribute) => a.attributeName === groupByOption);
        if (match && match.value === groupKey) {
          return { ...v, qty, isModified: !v.isNew };
        }
        return v;
      })
    );
  };

  const handleSinglePriceChange = (variantId: string, priceStr: string) => {
    const price = parseFloat(priceStr) || 0;
    setVariants((prev: ShopifyVariant[]) =>
      prev.map((v: ShopifyVariant) => (v.id === variantId ? { ...v, price, isModified: !v.isNew } : v))
    );
  };

  const handleSingleQtyChange = (variantId: string, qtyStr: string) => {
    const qty = parseInt(qtyStr, 10) || 0;
    setVariants((prev: ShopifyVariant[]) =>
      prev.map((v: ShopifyVariant) => (v.id === variantId ? { ...v, qty, isModified: !v.isNew } : v))
    );
  };

  // Handle variant image local upload
  const handleVariantImageUpload = (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setVariants((prev: ShopifyVariant[]) =>
        prev.map((v: ShopifyVariant) => {
          if (v.id === variantId) {
            return {
              ...v,
              images: [...v.images, ...newFiles],
              isModified: !v.isNew,
            };
          }
          return v;
        })
      );
    }
  };

  const removeVariantImage = (variantId: string, imgIdx: number) => {
    setVariants((prev: ShopifyVariant[]) =>
      prev.map((v: ShopifyVariant) => {
        if (v.id === variantId) {
          return {
            ...v,
            images: v.images.filter((_: File | string, idx: number) => idx !== imgIdx),
            isModified: !v.isNew,
          };
        }
        return v;
      })
    );
  };

  const getVariantPreviewUrl = (img: File | string) => {
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    return img;
  };

  const toggleGroupExpand = (key: string) => {
    setExpandedGroups((prev: Record<string, boolean>) => ({ ...prev, [key]: !prev[key] }));
  };

  const groupedVariants = getGroupedVariants();

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm w-full bg-white dark:bg-black rounded-xl overflow-hidden mt-6">
      <CardHeader className="border-b border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/30 py-4 px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight">Variants</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Replicate Shopify&apos;s clean options and cartesian grouped variants grid.
            </p>
          </div>
          {optionsState.length < 3 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOptionCard}
              className="h-8 border-dashed flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add option
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* 1. Dynamic Option Blocks */}
        {optionsState.length > 0 ? (
          <div className="space-y-4">
            {optionsState.map((opt) => (
              <div
                key={opt.id}
                className="border border-gray-150 dark:border-gray-900 rounded-xl bg-white dark:bg-black overflow-hidden shadow-sm transition-all"
              >
                {opt.isEditing ? (
                  /* EDITING MODE BLOCK ( Shopify Layout) */
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500">Option name</Label>
                        <Input
                          placeholder="e.g. size, meterial, color"
                          value={opt.name}
                          onChange={(e) =>
                            setOptionsState(prev =>
                              prev.map(o => (o.id === opt.id ? { ...o, name: e.target.value } : o))
                            )
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>

                    <div className="pl-7 space-y-2">
                      <Label className="text-xs font-semibold text-gray-500">Option values</Label>
                      <div className="space-y-2">
                        {opt.values.map((val, valIdx) => (
                          <div key={valIdx} className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-300" />
                            <Input
                              value={val}
                              onChange={(e) => updateValueIndex(opt.id, valIdx, e.target.value)}
                              className="h-9 text-sm flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeValueIndex(opt.id, valIdx)}
                              className="h-9 w-9 text-gray-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        {/* Add Another Value input field */}
                        <div className="flex items-center gap-2 pl-6">
                          <Input
                            placeholder="Add another value"
                            value={newValueInputs[opt.id] || ""}
                            onChange={(e) =>
                              setNewValueInputs(prev => ({ ...prev, [opt.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleValueAdd(opt.id);
                              }
                            }}
                            className="h-9 text-sm flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-900 pt-3 pl-7">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => deleteOptionCard(opt.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 cursor-pointer text-xs"
                      >
                        Delete
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleDone(opt.id)}
                        disabled={syncingOptionId === opt.id}
                        className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 h-8 px-4 cursor-pointer text-xs font-semibold"
                      >
                        {syncingOptionId === opt.id ? "Syncing..." : "Done"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* COLLAPSED / DONE STATE */
                  <div className="p-4 flex items-center justify-between pl-6 hover:bg-gray-50/40 dark:hover:bg-gray-950/20">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-300" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {opt.name}
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {opt.values.map((tagVal, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-850"
                            >
                              {tagVal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => editOptionCard(opt.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50/20 cursor-pointer"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-150 dark:border-gray-900 rounded-xl">
            <AlertCircle className="h-8 w-8 text-gray-300 mx-auto" />
            <p className="text-sm font-medium mt-2 text-gray-500">This product has no variants.</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click &apos;Add option&apos; at the top to configure dynamic options.
            </p>
          </div>
        )}

        {/* 2. Grouped Combinations Matrix Table */}
        {variants.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-gray-150 dark:border-gray-900">
            {/* Group By Selector and Toolbar */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Group by</span>
                <select
                  value={groupByOption}
                  onChange={(e) => setGroupByOption(e.target.value)}
                  className="h-8 px-2 text-xs rounded border border-gray-200 bg-white dark:bg-black dark:border-gray-800 focus:outline-none"
                >
                  {optionsState.filter(o => !o.isEditing && o.name.trim() !== "").map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                  <option value="">Ungrouped</option>
                </select>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="border border-gray-150 dark:border-gray-900 rounded-xl overflow-hidden bg-white dark:bg-black">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-950/30 text-xs font-semibold text-gray-500 border-b border-gray-100 dark:border-gray-900">
                    <th className="py-3 px-4 w-12 text-center">Active</th>
                    <th className="py-3 px-4">Variant</th>
                    <th className="py-3 px-4 w-36">Price (INR)</th>
                    <th className="py-3 px-4 w-32">Available</th>
                    <th className="py-3 px-4 w-28 text-center">Publishing</th>
                    <th className="py-3 px-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                  {Object.keys(groupedVariants).map((groupKey) => {
                    const groupItems = groupedVariants[groupKey];
                    const isExpanded = !!expandedGroups[groupKey];

                    // Find primary base values for bulk fields
                    const baseItem = groupItems[0] || {};
                    const groupTitle = groupKey;
                    const variantCount = groupItems.length;

                    return (
                      <React.Fragment key={groupKey}>
                        {/* Parent Group Row (Bulk Edit Row) */}
                        <tr className="bg-gray-50/20 dark:bg-gray-950/5 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-colors">
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={groupItems.every((item: ShopifyVariant) => activeVariantIds[item.id])}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setActiveVariantIds((prev) => {
                                  const updated = { ...prev };
                                  groupItems.forEach((item: ShopifyVariant) => {
                                    updated[item.id] = checked;
                                  });
                                  return updated;
                                });
                              }}
                              className="rounded border-gray-300 dark:border-gray-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/10">
                              {baseItem.images?.length > 0 ? (
                                <Image
                                  src={getVariantPreviewUrl(baseItem.images[0])}
                                  alt={groupTitle}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover rounded"
                                />
                              ) : (
                                <Upload className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-semibold">{groupTitle}</span>
                              <span className="block text-xs font-normal text-muted-foreground">
                                {variantCount} variant{variantCount > 1 ? "s" : ""}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                                <span className="text-xs text-gray-400">₹</span>
                              </div>
                              <Input
                                type="number"
                                value={baseItem.price || ""}
                                onChange={(e) => handleGroupPriceChange(groupKey, e.target.value)}
                                className="h-8 pl-6 text-xs font-semibold"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              value={baseItem.qty === 0 ? "0" : baseItem.qty || ""}
                              onChange={(e) => handleGroupQtyChange(groupKey, e.target.value)}
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/50">
                              <Eye className="h-3 w-3" /> Live
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleGroupExpand(groupKey)}
                              className="h-8 w-8 text-gray-400 hover:text-gray-700 cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </td>
                        </tr>

                        {/* Collapsed Child Combinations Sub-rows */}
                        {isExpanded &&
                          groupItems.map((variant: ShopifyVariant, varIdx: number) => {
                            const subTitle = variant.attributes
                              .filter((a: VariantAttribute) => a.attributeName !== groupByOption)
                              .map((a: VariantAttribute) => a.value)
                              .join(" / ") || "Standard";

                            const isSubActive = !!activeVariantIds[variant.id];

                            return (
                              <tr
                                key={variant.id}
                                className={cn(
                                  "bg-gray-50/10 dark:bg-gray-950/5 hover:bg-gray-50/40 transition-colors border-l-2 border-blue-500 pl-4",
                                  !isSubActive && "opacity-50"
                                )}
                              >
                                <td className="py-2.5 px-4 text-center pl-6">
                                  <input
                                    type="checkbox"
                                    checked={isSubActive}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setActiveVariantIds(prev => ({ ...prev, [variant.id]: checked }));
                                    }}
                                    className="rounded border-gray-300 dark:border-gray-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                  />
                                </td>
                                <td className="py-2.5 px-4 flex items-center gap-2 pl-6">
                                  {/* Sub Image Upload */}
                                  <div className="relative h-8 w-8 shrink-0 rounded border border-dashed border-gray-250 dark:border-gray-800 bg-white dark:bg-black flex items-center justify-center overflow-hidden group">
                                    {variant.images?.length > 0 ? (
                                      <>
                                        <Image
                                          src={getVariantPreviewUrl(variant.images[0])}
                                          alt={subTitle}
                                          width={32}
                                          height={32}
                                          className="h-full w-full object-cover"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeVariantImage(variant.id, 0)}
                                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 hidden group-hover:block"
                                        >
                                          <X className="h-2 w-2" />
                                        </button>
                                      </>
                                    ) : (
                                      <label className="cursor-pointer h-full w-full flex items-center justify-center">
                                        <Upload className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleVariantImageUpload(variant.id, e)}
                                          className="hidden"
                                        />
                                      </label>
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                      {subTitle}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4">
                                  <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                                      <span className="text-[10px] text-gray-400">₹</span>
                                    </div>
                                    <Input
                                      type="number"
                                      value={variant.price || ""}
                                      onChange={(e) => handleSinglePriceChange(variant.id, e.target.value)}
                                      className="h-7 pl-5 text-[11px]"
                                    />
                                  </div>
                                </td>
                                <td className="py-2.5 px-4">
                                  <Input
                                    type="number"
                                    value={variant.qty === 0 ? "0" : variant.qty || ""}
                                    onChange={(e) => handleSingleQtyChange(variant.id, e.target.value)}
                                    className="h-7 text-[11px]"
                                  />
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const checked = !isSubActive;
                                      setActiveVariantIds(prev => ({ ...prev, [variant.id]: checked }));
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                  >
                                    {isSubActive ? <Eye className="h-4.5 w-4.5 text-green-600" /> : <EyeOff className="h-4.5 w-4.5" />}
                                  </button>
                                </td>
                                <td className="py-2.5 px-4"></td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground text-right italic">
              Total Inventory: {variants.reduce((sum: number, v: ShopifyVariant) => sum + (activeVariantIds[v.id] ? v.qty || 0 : 0), 0)} items available across variants.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
