"use client";

import { useState, useEffect, useRef } from "react";
import { Product } from "@prisma/client";
import Image from "next/image";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, 'id' | 'price'> & { price: string }) => Promise<void>;
  productToEdit?: Product | null;
}

const initialFormState = { name: "", price: "", weight: "", image: "/img/placeholder.png" };

export default function ProductFormModal({ isOpen, onClose, onSubmit, productToEdit }: ProductFormModalProps) {
  const [product, setProduct] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit && isOpen) {
      setProduct({
        name: productToEdit.name,
        price: productToEdit.price.toString(),
        weight: productToEdit.weight,
        image: productToEdit.image,
      });
    } else {
      setProduct(initialFormState);
    }
  }, [productToEdit, isOpen]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!product.name.trim()) errors.name = "Product name is required.";
    if (!product.price.trim() || isNaN(Number(product.price)) || Number(product.price) <= 0) errors.price = "Valid price is required.";
    if (!product.weight.trim()) errors.weight = "Weight is required.";
    if (!product.image.trim() || product.image === "/img/placeholder.png") {
      errors.image = "Product image is required.";
    }
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Upload failed.");
      }

      const result = await response.json();
      setProduct(prev => ({ ...prev, image: result.url }));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Image upload failed.";
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit(product);
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name">Product Name</label>
            <input type="text" name="name" value={product.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg mt-2" />
            {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
          </div>
          <div>
            <label htmlFor="price">Price (in Rupiah)</label>
            <input type="number" name="price" value={product.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg mt-2" />
            {fieldErrors.price && <p className="text-red-500 text-sm mt-1">{fieldErrors.price}</p>}
          </div>
          <div>
            <label htmlFor="weight">Weight (e.g., 250 gr)</label>
            <input type="text" name="weight" value={product.weight} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg mt-2" />
            {fieldErrors.weight && <p className="text-red-500 text-sm mt-1">{fieldErrors.weight}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Product Image</label>
            <div className="flex items-center gap-4">

              {/* --- FIX 2: Conditionally show the image preview --- */}
              {/* Only show the preview if the image is not the default placeholder */}
              {product.image !== '/img/placeholder.png' && (
                <Image src={product.image} alt={product.name || "Product Image"} width={60} height={60} className="rounded-lg object-cover" />
              )}

              <input type="file" ref={inputFileRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => inputFileRef.current?.click()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:bg-gray-400"
              >
                {isUploading ? 'Uploading...' : (productToEdit ? 'Change Image' : 'Upload Image')}
              </button>
              {fieldErrors.image && <p className="text-red-500 text-sm mt-1">{fieldErrors.image}</p>}
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || isUploading} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90 disabled:bg-gray-400">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}