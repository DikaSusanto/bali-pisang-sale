"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Order, OrderItem, OrderStatus } from "@prisma/client";
import Link from "next/link";
import ConfirmationModal from "@/components/ConfirmationModal";

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.FULFILLED, OrderStatus.CANCELLED],
  FULFILLED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [],
  CANCELLED: [],
};

type OrderWithItems = Order & { 
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatusToConfirm, setNewStatusToConfirm] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) throw new Error("Order not found");
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setNewStatusToConfirm(newStatus);
    setIsModalOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!order || !newStatusToConfirm) return;
    setIsUpdating(true);
    setIsModalOpen(false);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatusToConfirm }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
      setNewStatusToConfirm(null);
    }
  };

  const cancelStatusUpdate = () => {
    setIsModalOpen(false);
    setNewStatusToConfirm(null);
  };

  if (isLoading) return <p className="text-center">Loading order details...</p>;
  if (!order) return <p className="text-center">Order not found.</p>;

  const availableStatuses = [order.status, ...(validTransitions[order.status] || [])];
  const uniqueAvailableStatuses = Array.from(new Set(availableStatuses));

  return (
    <>
      <div className="container mx-auto px-4 lg:px-24">
        <Link href="/admin/orders" className="text-primary hover:underline mb-6 block">&larr; Back to All Orders</Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Customer Details</h2>
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
              <p><strong>Phone:</strong> {order.customerPhone}</p>
            </div>
            
            {/* Order Summary Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Order ID:</strong> <span className="text-sm font-mono">{order.id}</span></p>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>{formatCurrency(order.serviceFee)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t mt-2">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="status" className="block font-medium mb-2">Update Status:</label>
                <select
                  id="status"
                  value={order.status}
                  onChange={handleStatusChange}
                  disabled={isUpdating || validTransitions[order.status].length === 0}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {uniqueAvailableStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {validTransitions[order.status].length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">This order cannot be updated further.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column (Items) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Items in Order</h2>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={cancelStatusUpdate}
        onConfirm={confirmStatusUpdate}
        isConfirming={isUpdating}
        title="Confirm Status Change"
      >
        <p>
          Are you sure you want to change the order status from{' '}
          <strong className="font-semibold text-gray-800">{order.status}</strong> to{' '}
          <strong className="font-semibold text-gray-800">{newStatusToConfirm}</strong>?
        </p>
      </ConfirmationModal>
    </>
  );
}