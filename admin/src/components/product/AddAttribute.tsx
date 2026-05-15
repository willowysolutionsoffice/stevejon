'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X, Plus, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConfigurableProduct, VariantData } from '@/context/ConfigurableProductContext'
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

interface CurrentAttributeVariant {
  attributes: {
    attributeId: string;
    valueId: string;
    attributeName: string;
    value: string;
  }[];
}

// NOTE: This component is designed to manage a single, mandatory variant.
// It will add one variant to the context immediately upon attribute selection.
function AddAttribute() {
  const { variants, setVariants } = useConfigurableProduct();
  
  // The state will track the attributes for the *only* variant allowed.
  const [currentVariantAttributes, setCurrentVariantAttributes] = useState<CurrentAttributeVariant>({
    attributes: variants.length > 0 ? variants[0].attributes : [],
  });

  const [availableAttributes, setAvailableAttributes] = useState<AttributeOption[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<string, AttributeValue[]>>({});
  
  // Initialize selected IDs from the context if a variant already exists
  const initialSelectedIds = variants.length > 0 
    ? variants[0].attributes.map(attr => attr.attributeId) 
    : [];
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>(initialSelectedIds);
  const [newAttributeId, setNewAttributeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingValues, setLoadingValues] = useState<Record<string, boolean>>({});

  // 1. Fetch attributes list on mount
  useEffect(() => {
    const fetchAttributes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/attributes`);
        const data = await response.json();
        if (response.ok) {
          setAvailableAttributes(data);
        }
      } catch (error) {
        console.error('Failed to fetch attributes:', error);
      }
      setLoading(false);
    };
    fetchAttributes();
  }, []);
  
  // 2. Load attribute values for initial attributes
  useEffect(() => {
    const loadInitialValues = async () => {
        // Load all attribute values for attributes already selected in the context
        await Promise.all(initialSelectedIds.map(loadAttributeValues));
    };
    if (initialSelectedIds.length > 0 && availableAttributes.length > 0) {
        loadInitialValues();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableAttributes.length]); // Wait for availableAttributes to be loaded

  // 3. Helper to fetch attribute values when an attribute is selected
  const loadAttributeValues = async (attributeId: string) => {
    if (attributeValues[attributeId]) return; // Already loaded

    setLoadingValues(prev => ({ ...prev, [attributeId]: true }));
    try {
      const response = await fetch(`${API_URL}/attributes`);
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

  // 4. Add a new attribute to the variant
  const addAttribute = async () => {
    if (newAttributeId && !selectedAttributeIds.includes(newAttributeId)) {
      setSelectedAttributeIds(prev => [...prev, newAttributeId]);
      await loadAttributeValues(newAttributeId);
      setNewAttributeId('');
      
      // Since a new attribute is added, we must update the context variant
      // to include this attribute (with a placeholder value until selected)
      handleAddOrUpdateVariant([]);
    }
  };

  // 5. Remove an attribute from the variant
  const removeAttribute = (attributeId: string) => {
    setSelectedAttributeIds(prev => prev.filter(id => id !== attributeId));
    
    // Update the local state
    const newAttributes = currentVariantAttributes.attributes.filter(attr => attr.attributeId !== attributeId);
    setCurrentVariantAttributes({ attributes: newAttributes });
    
    // Update the context immediately
    handleAddOrUpdateVariant(newAttributes);
  };
  
  // 6. Update the selected value for an attribute
  const updateAttributeValue = (attributeId: string, valueId: string) => {
    const attribute = availableAttributes.find(a => a.id === attributeId);
    const valueObj = attributeValues[attributeId]?.find(v => v.id === valueId);
    
    if (!attribute || !valueObj) return;

    const newAttributes = [...currentVariantAttributes.attributes];
    const existingIndex = newAttributes.findIndex(a => a.attributeId === attributeId);
    
    const newAttr = {
      attributeId,
      valueId,
      attributeName: attribute.name,
      value: valueObj.value
    };

    if (existingIndex >= 0) {
      // Update existing
      newAttributes[existingIndex] = newAttr;
    } else {
      // Add new
      newAttributes.push(newAttr);
    }
    
    setCurrentVariantAttributes({ attributes: newAttributes });

    // Update the context immediately
    handleAddOrUpdateVariant(newAttributes);
  };

  // 7. Core logic to create or update the single variant in the context
  const handleAddOrUpdateVariant = (updatedAttributes: CurrentAttributeVariant['attributes']) => {
    // This variant will rely entirely on the base product for price, qty, and images.
    const finalAttributes = updatedAttributes.length > 0 ? updatedAttributes : currentVariantAttributes.attributes;
    
    const singleVariant: VariantData = {
      // Use a fixed ID for the single default variant, or the existing one
      id: variants.length > 0 ? variants[0].id : 'single-default-variant', 
      qty: undefined,
      price: undefined,
      offerPrice: undefined,
      images: [], // No images managed here
      attributes: finalAttributes,
    };
    
    // Replace all variants with this single variant
    setVariants([singleVariant]);
    toast.success('Default variant attributes updated!');
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
            <CardTitle>Default Product Attributes</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Select the attributes that define the single product variant. Price, quantity, and images will be inherited from the base product.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Attributes Form */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
          
          {/* Dynamic Attributes with Select Boxes */}
          <div className="grid grid-cols-4 gap-3">
            {selectedAttributeIds.map((attributeId) => {
              const selectedValue = currentVariantAttributes.attributes.find(
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

          {/* Add Attribute Control */}
          <div className="flex gap-2">
            <Select 
              value={newAttributeId} 
              onValueChange={setNewAttributeId}
              disabled={selectedAttributeIds.length >= 4} // Limit attributes to prevent layout issues
            >
              <SelectTrigger className="h-9 w-[200px]">
                <SelectValue placeholder="Select attribute to add" />
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
          
          <div className='pt-2'>
              <Button onClick={() => handleAddOrUpdateVariant(currentVariantAttributes.attributes)} className="h-7 px-3 text-xs cursor-pointer">
                  Save Default Variant Attributes
              </Button>
          </div>

        </div>
        
        {/* Display Current Variant Attributes */}
        {currentVariantAttributes.attributes.length > 0 && (
            <div className="p-3 border rounded-lg bg-background space-y-2">
                <span className="text-sm font-medium">Current Default Variant</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {currentVariantAttributes.attributes.map((attr) => (
                        <div key={attr.attributeId}>
                            <span className="text-muted-foreground">{attr.attributeName}:</span> 
                            <span className='font-medium ml-1'>{attr.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AddAttribute;
