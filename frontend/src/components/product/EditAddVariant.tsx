'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { X, Upload, Trash2, Plus, Loader2, Edit2 } from 'lucide-react'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEditProduct } from '@/context/EcitProductContext'
import { getAttributesList, getAttributeValues } from '@/server/actions/attribute-actions' 
import { toast } from 'sonner'

interface AttributeOption {
  id: string;
  name: string;
}

interface AttributeValue {
  id: string;
  value: string;
}

interface CurrentVariant {
  id?: string;
  qty: string;
  price: string;
  discount: string;
  images: (File | string)[];
  attributes: {
    attributeId: string;
    valueId: string;
    attributeName: string;
    value: string;
  }[];
  isEditing?: boolean;
}

function EditAddVariant() {
  const { variants, addVariant, updateVariant, removeVariant, isFileImage } = useEditProduct();
  
  const [currentVariant, setCurrentVariant] = useState<CurrentVariant>({
    qty: '',
    price: '',
    discount: '',
    images: [],
    attributes: [],
    isEditing: false,
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
      const result = await getAttributesList();
      if (result.success && result.data) {
        setAvailableAttributes(result.data);
      } else {
        console.error('Failed to fetch attributes:', result.error);
      }
      setLoading(false);
    };
    fetchAttributes();
  }, []);

  // Fetch attribute values when an attribute is selected
  const loadAttributeValues = async (attributeId: string) => {
    if (attributeValues[attributeId]) return; // Already loaded

    setLoadingValues(prev => ({ ...prev, [attributeId]: true }));
    const result = await getAttributeValues(attributeId);
    if (result.success && result.data) {
      setAttributeValues(prev => ({ ...prev, [attributeId]: result.data }));
    } else {
      console.error('Failed to fetch attribute values:', result.error);
    }
    setLoadingValues(prev => ({ ...prev, [attributeId]: false }));
  };

  // Get preview URL for image (File or string)
  const getImagePreview = (image: File | string) => {
    if (isFileImage(image)) {
      return URL.createObjectURL(image as File);
    }
    return image as string;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && currentVariant.images.length < 3) {
      const newFiles = Array.from(files).slice(0, 3 - currentVariant.images.length);
      
      setCurrentVariant(v => ({
        ...v,
        images: [...v.images, ...newFiles]
      }));
    }
  };

  const removeImage = (index: number) => {
    setCurrentVariant(v => ({
      ...v,
      images: v.images.filter((_, i) => i !== index)
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

  const handleAddOrUpdateVariant = () => {
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

    if (currentVariant.isEditing && currentVariant.id) {
      // Update existing variant
      updateVariant(currentVariant.id, {
        qty: currentVariant.qty ? Number(currentVariant.qty) : undefined,
        price: currentVariant.price ? Number(currentVariant.price) : undefined,
        offerPrice: currentVariant.discount ? Number(currentVariant.discount) : undefined,
        images: currentVariant.images,
        attributes: currentVariant.attributes,
      });
      toast.success('Variant updated successfully');
    } else {
      // Add new variant
      const newVariant = {
        id: Date.now().toString(),
        qty: currentVariant.qty ? Number(currentVariant.qty) : undefined,
        price: currentVariant.price ? Number(currentVariant.price) : undefined,
        offerPrice: currentVariant.discount ? Number(currentVariant.discount) : undefined,
        images: currentVariant.images,
        attributes: currentVariant.attributes,
      };
      addVariant(newVariant);
      toast.success('Variant added successfully');
    }

    // Reset form
    resetForm();
  };

  const handleEditVariant = async (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;

    // Load attribute values for all attributes in this variant
    for (const attr of variant.attributes) {
      await loadAttributeValues(attr.attributeId);
    }

    setCurrentVariant({
      id: variant.id,
      qty: variant.qty?.toString() || '',
      price: variant.price?.toString() || '',
      discount: variant.offerPrice?.toString() || '',
      images: variant.images,
      attributes: variant.attributes,
      isEditing: true,
    });

    setSelectedAttributeIds(variant.attributes.map(a => a.attributeId));
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setCurrentVariant({
      qty: '',
      price: '',
      discount: '',
      images: [],
      attributes: [],
      isEditing: false,
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
              {currentVariant.isEditing 
                ? 'Editing existing variant - make changes and click Update' 
                : 'Added attributes will overwrite base attributes'}
            </p>
          </div>
          {currentVariant.isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="h-8"
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Current Variant Form */}
        <div className={`space-y-3 p-4 border rounded-lg ${currentVariant.isEditing ? 'bg-blue-50 border-blue-300' : 'bg-muted/30'}`}>
          {currentVariant.isEditing && (
            <div className="flex items-center gap-2 mb-2">
              <Edit2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Editing Variant</span>
            </div>
          )}
          
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
              {currentVariant.images.map((image, index) => (
                <div key={index} className="relative w-16 h-16 rounded border">
                  <Image 
                    src={getImagePreview(image)} 
                    alt={`Variant ${index + 1}`} 
                    width={64} 
                    height={64} 
                    className="w-full h-full object-cover rounded" 
                  />
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

          <Button 
            onClick={handleAddOrUpdateVariant} 
            className="h-7 px-3 text-xs cursor-pointer"
          >
            {currentVariant.isEditing ? 'Update Variant' : 'Add Variant'}
          </Button>
        </div>

        {/* Added Variants List */}
        {variants.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Added Variants ({variants.length})</h3>
            {variants.map((variant, idx) => (
              <div key={variant.id} className="p-3 border rounded-lg bg-background space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Variant #{idx + 1}</span>
                    {!variant.isNew && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        Existing
                      </span>
                    )}
                    {variant.isNew && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                        New
                      </span>
                    )}
                    {variant.isModified && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                        Modified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditVariant(variant.id)}
                      className="h-7 w-7 p-0 hover:bg-blue-100"
                    >
                      <Edit2 className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(variant.id)}
                      className="h-7 w-7 p-0 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
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
                    {variant.images.map((image, imgIdx) => (
                      <div key={imgIdx} className="relative w-10 h-10 rounded border bg-muted">
                        <Image 
                          src={getImagePreview(image)} 
                          alt={`Img ${imgIdx + 1}`}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover rounded"
                        />
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

export default EditAddVariant
