"use client";

import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit } from "lucide-react";
import BasicDetails from "./BasicDetails";

const SimpleProduct = () => {
  const [images, setImages] = useState<string[]>([
    "/api/placeholder/150/200",
    "/api/placeholder/150/200",
  ]);

  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F5A623", "#8E44AD"];
  const [formData, setFormData] = useState({
    selectedColor: "",
    selectedSize: "",
    selectedFabric: "",
  });

  // Add a new image
  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages([...images, url]);
    }
  };

  // Delete an image
  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  // Replace an image
  const handleReplaceImage = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newImages = [...images];
      newImages[index] = url;
      setImages(newImages);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left Column - Basic Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <BasicDetails />
      </div>

      {/* Right Column - Images & Categories */}
      <div className="space-y-6">
        {/* Images Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="border border-gray-300 rounded-lg p-2 hover:shadow relative w-full h-32 flex flex-col items-center justify-center"
              >
                <Image
                  src={img}
                  alt={`Product ${idx + 1}`}
                  fill
                  className="object-cover rounded"
                />

                <div className="flex gap-2 mt-2">
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteImage(idx)}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Replace Button */}
                  <label className="p-1 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
                    <Edit className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleReplaceImage(idx, e)}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Image */}
          <label className="w-full border-2 border-dashed border-green-500 rounded-lg py-8 flex flex-col items-center justify-center hover:bg-green-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-500 font-medium">Add Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddImage}
            />
          </label>
        </div>

        {/* Categories Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Categories
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Select your product</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Home & Garden</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Tag
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Select your product</option>
              <option>New</option>
              <option>Featured</option>
              <option>Sale</option>
            </select>
          </div>

          {/* Color Picker */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select your color
            </label>
            <div className="flex gap-2">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setFormData({ ...formData, selectedColor: color })
                  }
                  className={`w-10 h-10 rounded border-2 ${
                    formData.selectedColor === color
                      ? "border-gray-800"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Product Size */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Size
            </label>
            <select
              value={formData.selectedSize}
              onChange={(e) =>
                setFormData({ ...formData, selectedSize: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          {/* Product Fabric */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Fabric
            </label>
            <select
              value={formData.selectedFabric}
              onChange={(e) =>
                setFormData({ ...formData, selectedFabric: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select fabric</option>
              <option value="Cotton">Cotton</option>
              <option value="Linen">Linen</option>
              <option value="Polyester">Polyester</option>
              <option value="Silk">Silk</option>
              <option value="Denim">Denim</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProduct;
