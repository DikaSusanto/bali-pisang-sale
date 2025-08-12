"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";
import ProductFormModal from "@/components/ProductFormModal";
import Image from "next/image";

interface ProductsClientPageProps {
  initialProducts: Product[];
}

const formatCurrency = (amount: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

export default function ProductsClientPage({ initialProducts }: ProductsClientPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // --- Handlers for Create, Update, and Delete ---
  const handleAddProduct = async (productData: any) => {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add product.");
    }
    const createdProduct = await response.json();
    setProducts(prev => [...prev, createdProduct].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!productToEdit) return;
    const response = await fetch(`/api/admin/products/${productToEdit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Failed to update product.");
    }
    const updatedProduct = await response.json();
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const confirmDelete = async () => {
    if (!productToDelete) return;
    const response = await fetch(`/api/admin/products/${productToDelete.id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
    } else {
      alert("Failed to delete product.");
    }
    setProductToDelete(null);
  };

  return (
    <>
      <div className="container mx-auto px-4 lg:px-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <FaPlus />
            Add Product
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="border-b bg-stone-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                  </td>
                  <td className="px-6 py-4 font-semibold">{product.name}</td>
                  <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                      {/* This button now opens the edit modal */}
                      <button onClick={() => setProductToEdit(product)} className="text-blue-600 hover:text-blue-800">
                        <FaEdit size={18} />
                      </button>
                      <button onClick={() => setProductToDelete(product)} className="text-red-600 hover:text-red-800">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* --- Modals --- */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />
      
      <ProductFormModal
        isOpen={!!productToEdit}
        onClose={() => setProductToEdit(null)}
        onSubmit={handleUpdateProduct}
        productToEdit={productToEdit}
      />

      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete <strong className="font-semibold">{productToDelete?.name}</strong>?</p>
      </ConfirmationModal>
    </>
  );
}