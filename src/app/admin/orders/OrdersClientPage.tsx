//app/admin/orders/OrdersClientPage.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmationModal from "@/components/ConfirmationModal";
import { format } from "date-fns";
import { FaTrash, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface OrdersApiResponse {
  orders: Order[];
  totalOrdersCount: number;
  currentPage: number;
  pageSize: number;
}

interface OrdersClientPageProps {
  initialOrders: Order[];
  totalOrdersCount: number;
  currentPage: number;
  pageSize: number;
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-gray-200 text-gray-800",
  AWAITING_PAYMENT: "bg-blue-200 text-blue-800",
  PAID: "bg-green-200 text-green-800",
  FULFILLED: "bg-purple-200 text-purple-800",
  SHIPPED: "bg-teal-200 text-teal-800",
  CANCELLED: "bg-red-200 text-red-800",
};

export default function OrdersClientPage({
  initialOrders,
  totalOrdersCount: initialTotalOrdersCount,
  currentPage: initialCurrentPage,
  pageSize: initialPageSize,
}: OrdersClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(initialTotalOrdersCount);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialPageSize);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>(searchParams.get("status") || "ALL");
  const [filterStartDate, setFilterStartDate] = useState<string>(searchParams.get("startDate") || "");
  const [filterEndDate, setFilterEndDate] = useState<string>(searchParams.get("endDate") || "");

  const [isDeleteModalOpen, setIsDeleteModal] = useState(false);
  const [ordersToDelete, setOrdersToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageMessage, setPageMessage] = useState<{ text: string, type: 'info' | 'error' | 'success' } | null>(null);

  const totalPages = useMemo(() => Math.ceil(totalOrdersCount / itemsPerPage), [totalOrdersCount, itemsPerPage]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  useEffect(() => {
    setOrders(initialOrders);
    setTotalOrdersCount(initialTotalOrdersCount);
    setCurrentPage(initialCurrentPage);
    setItemsPerPage(initialPageSize);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, [initialOrders, initialTotalOrdersCount, initialCurrentPage, initialPageSize]);

  const fetchOrders = useCallback(async () => {
    setIsRefreshing(true);
    setPageMessage(null);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filterStatus && filterStatus !== "ALL") params.append("status", filterStatus);
      if (filterStartDate) params.append("startDate", filterStartDate);
      if (filterEndDate) params.append("endDate", filterEndDate);
      params.append("page", currentPage.toString());
      params.append("pageSize", itemsPerPage.toString());

      const url = `/api/orders${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401) {
          await signOut({ redirect: false });
          router.push('/login');
        }
        throw new Error("Failed to fetch orders.");
      }
      const data: OrdersApiResponse = await response.json();

      setOrders(data.orders);
      setTotalOrdersCount(data.totalOrdersCount);
      setCurrentPage(data.currentPage);
      setItemsPerPage(data.pageSize);
      setLastUpdated(new Date());

      setSelectedOrderIds(prev =>
        prev.filter(id => data.orders.some(order => order.id === id))
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(errorMsg);
      setError(errorMsg);
      setPageMessage({ text: `Failed to load orders: ${errorMsg}`, type: 'error' });
    } finally {
      setIsRefreshing(false);
    }
  }, [filterStatus, filterStartDate, filterEndDate, currentPage, itemsPerPage, router]);

  useEffect(() => {
    if (!isLoading) {
      fetchOrders();
    }
  }, [currentPage, itemsPerPage, fetchOrders, isLoading]);

  useEffect(() => {
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

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

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  const handleSelectAllOrders = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(orders.map(order => order.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const triggerDelete = (ids: string | string[]) => {
    const idsToDelete = Array.isArray(ids) ? ids : [ids];
    setOrdersToDelete(idsToDelete);
    setIsDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (ordersToDelete.length === 0) return;
    setIsDeleting(true);
    setIsDeleteModal(false);
    setPageMessage(null);

    try {
      const params = new URLSearchParams();
      ordersToDelete.forEach(id => params.append("id", id));
      const res = await fetch(`/api/orders?${params.toString()}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete order(s)");
      }

      fetchOrders();
      setPageMessage({ text: `Successfully deleted ${ordersToDelete.length} order(s)!`, type: 'success' });
    } catch (err: unknown) {
      console.error("Delete order error:", err);
      setPageMessage({ text: `Error deleting order(s): ${err instanceof Error ? err.message : String(err)}`, type: 'error' });
    } finally {
      setIsDeleting(false);
      setOrdersToDelete([]);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModal(false);
    setOrdersToDelete([]);
  };

  if (error) return <p className="text-center text-red-500 p-8">Error: {error}</p>;
  if (isLoading) return <LoadingSpinner text="Loading orders..." />;

  const isAllSelected = orders.length > 0 && selectedOrderIds.length === orders.length;

  const pageNumbers: number[] = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 xl:px-8 py-6">
      {pageMessage && (
        <div className={`relative px-4 py-3 rounded-lg shadow-md mb-4 text-center ${pageMessage.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            pageMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
              'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
          <p>{pageMessage.text}</p>
          <button
            onClick={() => setPageMessage(null)}
            className="absolute top-1 right-2 text-current text-lg opacity-75 hover:opacity-100"
          >&times;</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <div className="text-sm text-gray-500 text-right mt-2 md:mt-0">
          {isRefreshing ? (
            <span>Refreshing...</span>
          ) : (
            lastUpdated && (
              <span>
                Last updated: {format(lastUpdated, 'HH:mm:ss')} WITA
              </span>
            )
          )}
        </div>
      </div>

<div className="bg-white rounded-xl shadow-md p-6 mb-4">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
    <div>
      <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        id="statusFilter"
        className="w-full border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-primary focus:border-primary"
        value={filterStatus}
        onChange={e => setFilterStatus(e.target.value)}
      >
        <option value="ALL">All</option>
        {Object.keys(OrderStatus).map((status) => (
          <option key={status} value={status}>
            {status.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="startDateFilter" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
      <input
        type="date"
        id="startDateFilter"
        className="w-full border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-primary focus:border-primary"
        value={filterStartDate}
        onChange={e => setFilterStartDate(e.target.value)}
        max={filterEndDate || undefined}
      />
    </div>

    <div>
      <label htmlFor="endDateFilter" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
      <input
        type="date"
        id="endDateFilter"
        className="w-full border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-primary focus:border-primary"
        value={filterEndDate}
        onChange={e => setFilterEndDate(e.target.value)}
        min={filterStartDate || undefined}
      />
    </div>

    <button
      onClick={() => triggerDelete(selectedOrderIds)}
      className="w-full md:w-auto px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-700 transition-opacity mt-4 md:mt-0 flex items-center justify-center space-x-1 disabled:opacity-50"
      disabled={selectedOrderIds.length === 0 || isDeleting}
      title="Delete selected orders"
      type="button"
    >
      <FaTrash className="text-base" /> <span>Delete</span>
    </button>
  </div>
</div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="border-b bg-stone-50">
            <tr>
              <th className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllOrders}
                  aria-label="Select all orders"
                  className="form-checkbox h-4 w-4 text-primary rounded"
                />
              </th>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No orders found.</td>
              </tr>
            ) : (
              orders.map((order: Order) => (
                <tr key={order.id} className="border-b hover:bg-stone-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(order.id)}
                      onChange={() => handleToggleSelectOrder(order.id)}
                      aria-label={`Select order ${order.id}`}
                      className="form-checkbox h-4 w-4 text-primary rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">{order.id.slice(-8)}...</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">
                    {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm')} WITA
                  </td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[order.status]}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center"
                      title="View Details"
                    >
                      <FaEye className="text-base" />
                    </Link>
                    <button
                      onClick={() => triggerDelete(order.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors flex items-center justify-center disabled:opacity-50"
                      title="Delete order"
                      disabled={isDeleting}
                    >
                      <FaTrash className="text-base" />
                    </button>
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
              disabled={currentPage === 1 || isRefreshing}
              className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              title="Previous Page"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50`}
                disabled={isRefreshing}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isRefreshing}
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
        title={ordersToDelete.length > 1 ? "Confirm Batch Deletion" : "Confirm Deletion"}
      >
        {ordersToDelete.length === 1 ? (
          <p>
            Are you sure you want to delete this order?
          </p>
        ) : (
          <p>
            Are you sure you want to delete <strong className="font-mono">{ordersToDelete.length} orders</strong>?
          </p>
        )}
        <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
      </ConfirmationModal>
    </div>
  );
}