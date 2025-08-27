// app/admin/products/ProductsClientPage.tsx

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Product } from "@prisma/client";
import { FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ConfirmationModal from "@/components/ConfirmationModal";
import ProductFormModal from "@/components/ProductFormModal";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductsApiResponse {
  products: Product[];
  totalProductsCount: number;
  currentPage: number;
  pageSize: number;
}

interface ProductsClientPageProps {
  initialProducts: Product[];
  totalProductsCount: number;
  currentPage: number;
  pageSize: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

export default function ProductsClientPage({
  initialProducts,
  totalProductsCount: initialTotalProductsCount,
  currentPage: initialCurrentPage,
  pageSize: initialPageSize,
}: ProductsClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(initialTotalProductsCount);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialPageSize);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [generalError, setGeneralError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.ceil(totalProductsCount / itemsPerPage), [totalProductsCount, itemsPerPage]);
  const pageNumbers: number[] = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("pageSize", itemsPerPage.toString());
      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch products.");
      }
      const data: ProductsApiResponse = await res.json();
      setProducts(data.products);
      setTotalProductsCount(data.totalProductsCount);
      setCurrentPage(data.currentPage);
      setItemsPerPage(data.pageSize);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage, fetchProducts]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newSize.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleAddProduct = async (productData: any) => {
    setGeneralError(null);
    const payload = { ...productData, price: Number(productData.price) };
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const errorData = await response.json();
      if (!response.ok) {
        setGeneralError(errorData.error || "Failed to add product.");
        return;
      }
      setGeneralError("Product added successfully.");
      fetchProducts();
      setIsAddModalOpen(false);
    } catch (error: any) {
      setGeneralError(error.message || "Failed to add product.");
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    setGeneralError(null);
    if (!productToEdit) return;
    const payload = { ...productData, price: Number(productData.price) };
    try {
      const response = await fetch(`/api/admin/products/${productToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const errorData = await response.json();
      if (!response.ok) {
        setGeneralError(errorData.error || "Failed to update product.");
        return;
      }
      setGeneralError("Product updated successfully.");
      fetchProducts();
      setProductToEdit(null);
    } catch (error: any) {
      setGeneralError(error.message || "Failed to update product.");
    }
  };

  const confirmDelete = async () => {
    setGeneralError(null);
    if (!productToDelete) return;
    try {
      const response = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
      });
      const errorData = await response.json();
      if (!response.ok) {
        setGeneralError(errorData.error || "Failed to delete product.");
        setProductToDelete(null);
        return;
      }
      setGeneralError("Product deleted successfully."); // Show success
      fetchProducts();
      setProductToDelete(null);
    } catch (error: any) {
      setGeneralError(error.message || "Failed to delete product.");
      setProductToDelete(null);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 xl:px-8 py-6">
        {generalError && (
          <div
            className={`mb-4 p-4 border rounded ${generalError.toLowerCase().includes("success")
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
              }`}
          >
            {generalError}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto px-3 py-2 bg-primary text-white text-sm font-semibold rounded-md shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 mt-2 md:mt-0"
          >
            <FaPlus className="text-base" />
            <span>Add Product</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="border-b bg-stone-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-stone-50">
                    <td className="px-6 py-4">
                      <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                    </td>
                    <td className="px-6 py-4 font-semibold">{product.name}</td>
                    <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setProductToEdit(product)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center">
                          <FaEdit className="text-base" />
                        </button>
                        <button onClick={() => setProductToDelete(product)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors flex items-center justify-center">
                          <FaTrash className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-md space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">Items per page:</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border-gray-300 rounded-md shadow-sm text-sm px-2 py-1 focus:ring-primary focus:border-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                title="Previous Page"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              {pageNumbers.map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } disabled:opacity-50`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                title="Next Page"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>

            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
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
