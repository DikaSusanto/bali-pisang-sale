// app/admin/orders/[id]/OrderDetailClientPage.tsx

"use client";

import { useState } from "react";
import { Order, OrderItem, OrderStatus } from "@prisma/client";
import Link from "next/link";
import ConfirmationModal from "@/components/ConfirmationModal";
import LoadingSpinner from "@/components/LoadingSpinner";

type OrderWithItems = Order & {
  items: OrderItem[];
};

interface OrderDetailClientPageProps {
  initialOrder: OrderWithItems;
}

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.AWAITING_PAYMENT, OrderStatus.CANCELLED],
  AWAITING_PAYMENT: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.FULFILLED, OrderStatus.CANCELLED],
  FULFILLED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [],
  CANCELLED: [],
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function OrderDetailClientPage({ initialOrder }: OrderDetailClientPageProps) {
  const [order, setOrder] = useState<OrderWithItems>(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatusToConfirm, setNewStatusToConfirm] = useState<OrderStatus | null>(null);
  const [finalShippingCost, setFinalShippingCost] = useState("");

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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Failed to update status:", error);
      alert(`Error: ${message}`);
    } finally {
      setIsUpdating(false);
      setNewStatusToConfirm(null);
    }
  };

  const cancelStatusUpdate = () => {
    setIsModalOpen(false);
    setNewStatusToConfirm(null);
  };

  const handleFinalizeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalShippingCost || isNaN(parseInt(finalShippingCost))) {
      alert("Please enter a valid final shipping cost.");
      return;
    }
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalShippingCost: parseInt(finalShippingCost) }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to finalize order.");
      }
      const updatedOrderData = await response.json();
      setOrder(updatedOrderData);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const availableStatuses = [order.status, ...(validTransitions[order.status] || [])];
  const uniqueAvailableStatuses = Array.from(new Set(availableStatuses));

  const isFinalStatusTransition = newStatusToConfirm === "SHIPPED" || newStatusToConfirm === "CANCELLED";
  const finalStatusWarning = isFinalStatusTransition ? (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 mb-3 rounded">
      <strong>Warning:</strong> This is a final status and cannot be changed later.
    </div>
  ) : null;

  return (
    <>
      <div className="container mx-auto px-4 lg:px-24">
        <Link href="/admin/orders" className="text-primary hover:underline mb-6 block">&larr; Back to All Orders</Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Customer Details</h2>
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
              <p><strong>Phone:</strong> {order.customerPhone}</p>
              <p><strong>Address:</strong> {order.customerAddress}</p>
            </div>

            {order.status === 'PENDING' && (
              <div className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Finalize Pre-Order</h2>
                <div className="space-y-2 text-sm mb-4 border-b pb-4">
                  <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Service Fee:</span><span>{formatCurrency(order.serviceFee)}</span></div>
                  <div className="flex justify-between"><span>Shipping (est.):</span><span className="italic">{formatCurrency(order.shippingCost || 0)}</span></div>
                </div>
                <form onSubmit={handleFinalizeOrder}>
                  <label htmlFor="finalShippingCost" className="block font-medium mb-2">Enter Final Shipping Cost (Rp)</label>
                  <input
                    type="number"
                    id="finalShippingCost"
                    value={finalShippingCost}
                    onChange={(e) => setFinalShippingCost(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="e.g., 25000"
                    required
                  />
                  <button type="submit" disabled={isUpdating} className="w-full mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                    {isUpdating ? 'Sending Invoice...' : 'Confirm & Send Payment Link'}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Order ID:</strong> <span className="text-sm font-mono">{order.id}</span></p>
                <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div>
                <div className="flex justify-between"><span>Service Fee:</span><span>{formatCurrency(order.serviceFee)}</span></div>
                <div className="flex justify-between"><span>Shipping ({order.status === 'PENDING' ? 'est.' : 'final'}):</span><span>{formatCurrency(order.shippingCost || 0)}</span></div>
                <div className="flex justify-between font-bold pt-2 border-t mt-2"><span>Grand Total:</span><span className={order.status === 'PENDING' ? 'italic text-gray-500' : ''}>{formatCurrency(order.totalAmount)}</span></div>
              </div>

              {order.status !== 'PENDING' && (
                <div className="mt-6">
                  <label htmlFor="status" className="block font-medium mb-2">Update Status:</label>
                  {isUpdating ? (
                    <div className="flex items-center justify-center gap-2 p-2 border rounded-lg bg-gray-50">
                      <LoadingSpinner small />
                      <span className="text-gray-600">Updating status...</span>
                    </div>
                  ) : (
                    <select
                      id="status"
                      value={order.status}
                      onChange={handleStatusChange}
                      disabled={isUpdating || !validTransitions[order.status] || validTransitions[order.status].length === 0}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {uniqueAvailableStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  )}
                  {(!validTransitions[order.status] || validTransitions[order.status].length === 0) && !isUpdating && (
                    <p className="text-xs text-gray-500 mt-1">This order cannot be updated further.</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Items in Order</h2>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.quantity * item.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={cancelStatusUpdate}
        onConfirm={confirmStatusUpdate}
        isConfirming={isUpdating}
        title="Confirm Status Change"
      >
        {finalStatusWarning}
        <p>Are you sure you want to change the status from <strong>{order.status}</strong> to <strong>{newStatusToConfirm}</strong>?</p>
      </ConfirmationModal>
    </>
  );
}