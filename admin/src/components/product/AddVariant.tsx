'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { X, Upload, Trash2, Plus, Loader2 } from 'lucide-react'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConfigurableProduct } from '@/context/ConfigurableProductContext'
import { toast } from 'sonner'
import { API_URL } from '@/lib/api-client'

interface AttributeOption {
  id: string;
  name: string;
}

interface AttributeValue {
  id: string;
  value: string;
}

interface CurrentVariant {
  qty: string;
  price: string;
  discount: string;
  images: File[];
  imagePreviewUrls: string[];
  attributes: {
    attributeId: string;
    valueId: string;
    attributeName: string;
    value: string;
  }[];
}

function AddVariant() {
  const { variants, addVariant, removeVariant } = useConfigurableProduct();
  
  const [currentVariant, setCurrentVariant] = useState<CurrentVariant>({
    qty: '',
    price: '',
    discount: '',
    images: [],
    imagePreviewUrls: [],
    attributes: [],
  });

  const [availableAttributes, setAvailableAttributes] = useState<AttributeOption[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<string, AttributeValue[]>>({});
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);
  const [newAttributeId, setNewAttributeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingValues, setLoadingValues] = useState<Record<string, boolean>>({});

  // Fetch attributes list on mount
  useEffect(() => {
    const fetchAttributes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/attributes`);
        const data = await response.json();
        if (response.ok) {
          setAvailableAttributes(data);
        } else {
          console.error('Failed to fetch attributes:', data.error);
        }
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
      setLoading(false);
    };
    fetchAttributes();
  }, []);

  // Fetch attribute values when an attribute is selected
  const loadAttributeValues = async (attributeId: string) => {
    if (attributeValues[attributeId]) return; // Already loaded

    setLoadingValues(prev => ({ ...prev, [attributeId]: true }));
    try {
      const response = await fetch(`${API_URL}/attributes`); // Backend attributes include values
      const data = await response.json();
      if (response.ok) {
        const attr = data.find((a: { id: string; values: AttributeValue[] }) => a.id === attributeId);
        if (attr) {
          setAttributeValues(prev => ({ ...prev, [attributeId]: attr.values }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch attribute values:', error);
    }
    setLoadingValues(prev => ({ ...prev, [attributeId]: false }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && currentVariant.images.length < 3) {
      const newFiles = Array.from(files).slice(0, 3 - currentVariant.images.length);
      const imageUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setCurrentVariant(v => ({
        ...v,
        images: [...v.images, ...newFiles],
        imagePreviewUrls: [...v.imagePreviewUrls, ...imageUrls]
      }));
    }
  };

  const removeImage = (index: number) => {
    setCurrentVariant(v => ({
      ...v,
      images: v.images.filter((_, i) => i !== index),
      imagePreviewUrls: v.imagePreviewUrls.filter((_, i) => i !== index)
    }));
  };

  const addAttribute = async () => {
    if (newAttributeId && !selectedAttributeIds.includes(newAttributeId)) {
      setSelectedAttributeIds([...selectedAttributeIds, newAttributeId]);
      await loadAttributeValues(newAttributeId);
      setNewAttributeId('');
    }
  };

  const removeAttribute = (attributeId: string) => {
    setSelectedAttributeIds(selectedAttributeIds.filter(id => id !== attributeId));
    setCurrentVariant(v => ({
      ...v,
      attributes: v.attributes.filter(attr => attr.attributeId !== attributeId)
    }));
  };

  const updateAttributeValue = (attributeId: string, valueId: string) => {
    const attribute = availableAttributes.find(a => a.id === attributeId);
    const valueObj = attributeValues[attributeId]?.find(v => v.id === valueId);
    
    if (!attribute || !valueObj) return;

    setCurrentVariant(v => {
      const existingIndex = v.attributes.findIndex(a => a.attributeId === attributeId);
      const newAttr = {
        attributeId,
        valueId,
        attributeName: attribute.name,
        value: valueObj.value
      };

      if (existingIndex >= 0) {
        const newAttributes = [...v.attributes];
        newAttributes[existingIndex] = newAttr;
        return { ...v, attributes: newAttributes };
      } else {
        return { ...v, attributes: [...v.attributes, newAttr] };
      }
    });
  };

  const handleAddVariant = () => {
    // Validate that at least one field is filled
    const hasAnyData = 
      currentVariant.qty || 
      currentVariant.price || 
      currentVariant.discount || 
      currentVariant.images.length > 0 || 
      currentVariant.attributes.length > 0;

    if (!hasAnyData) {
      toast.error('Please fill in at least one field before adding a variant');
      return;
    }

    const newVariant = {
      id: Date.now().toString(),
      qty: currentVariant.qty ? Number(currentVariant.qty) : undefined,
      price: currentVariant.price ? Number(currentVariant.price) : undefined,
      offerPrice: currentVariant.discount ? Number(currentVariant.discount) : undefined,
      images: currentVariant.images,
      attributes: currentVariant.attributes,
    };

    addVariant(newVariant);

    // Reset current variant
    setCurrentVariant({
      qty: '',
      price: '',
      discount: '',
      images: [],
      imagePreviewUrls: [],
      attributes: [],
    });
    setSelectedAttributeIds([]);
  };

  const getAttributeName = (attributeId: string) => {
    return availableAttributes.find(a => a.id === attributeId)?.name || attributeId;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Product Variants</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Added attributes will overwrite base attributes
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Current Variant Form */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
          {/* All Fields in Grid */}
          <div className="grid grid-cols-5 gap-3">
            {/* Core Fields */}
            <div className="space-y-1">
              <Label className="text-sm">Quantity</Label>
              <Input
                type="number"
                value={currentVariant.qty}
                onChange={(e) => setCurrentVariant((v) => ({ ...v, qty: e.target.value }))}
                placeholder="Enter quantity"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Price (₹)</Label>
              <Input
                type="number"
                value={currentVariant.price}
                onChange={(e) => setCurrentVariant((v) => ({ ...v, price: e.target.value }))}
                placeholder="Enter price"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Offer Price (₹)</Label>
              <Input
                type="number"
                value={currentVariant.discount}
                onChange={(e) => setCurrentVariant((v) => ({ ...v, discount: e.target.value }))}
                placeholder="Offer price"
                className="h-9"
              />
            </div>

            {/* Dynamic Attributes with Select Boxes */}
            {selectedAttributeIds.map((attributeId) => {
              const selectedValue = currentVariant.attributes.find(
                a => a.attributeId === attributeId
              )?.valueId;

              return (
                <div key={attributeId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{getAttributeName(attributeId)}</Label>
                    <button
                      onClick={() => removeAttribute(attributeId)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <Select
                    value={selectedValue || ''}
                    onValueChange={(value) => updateAttributeValue(attributeId, value)}
                    disabled={loadingValues[attributeId]}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={loadingValues[attributeId] ? "Loading..." : `Select ${getAttributeName(attributeId).toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {attributeValues[attributeId]?.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          {/* Add Attribute */}
          <div className="flex gap-2">
            <Select value={newAttributeId} onValueChange={setNewAttributeId}>
              <SelectTrigger className="h-9 w-[200px]">
                <SelectValue placeholder="Select attribute" />
              </SelectTrigger>
              <SelectContent>
                {availableAttributes
                  .filter(attr => !selectedAttributeIds.includes(attr.id))
                  .map(attr => (
                    <SelectItem key={attr.id} value={attr.id}>
                      {attr.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={addAttribute} 
              variant="outline" 
              size="sm" 
              className="h-9"
              disabled={!newAttributeId}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Attribute
            </Button>
          </div>

          {/* Images Section */}
          <div className="space-y-2">
            <Label className="text-sm">Images (max 3)</Label>
            <div className="flex items-center gap-2">
              {currentVariant.imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative w-16 h-16 rounded border">
                  <Image src={url} alt={`Variant ${index + 1}`} width={64} height={64} className="w-full h-full object-cover rounded" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {currentVariant.images.length < 3 && (
                <label className="w-16 h-16 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <Button onClick={handleAddVariant} className="h-7 px-3 text-xs cursor-pointer">
            Add Variant
          </Button>
        </div>

        {/* Added Variants List */}
        {variants.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Added Variants ({variants.length})</h3>
            {variants.map((variant, idx) => (
              <div key={variant.id} className="p-3 border rounded-lg bg-background space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Variant #{idx + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(variant.id)}
                    className="h-7 w-7 p-0 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {variant.qty && <div><span className="text-muted-foreground">Qty:</span> {variant.qty}</div>}
                  {variant.price && <div><span className="text-muted-foreground">Price:</span> ₹{variant.price}</div>}
                  {variant.offerPrice && <div><span className="text-muted-foreground">Offer:</span> ₹{variant.offerPrice}</div>}
                  {variant.attributes.map((attr) => (
                    <div key={attr.attributeId}>
                      <span className="text-muted-foreground">{attr.attributeName}:</span> {attr.value}
                    </div>
                  ))}
                </div>
                {variant.images.length > 0 && (
                  <div className="flex gap-1">
                    {variant.images.map((file, imgIdx) => (
                      <div key={imgIdx} className="w-10 h-10 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        Img {imgIdx + 1}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AddVariant
