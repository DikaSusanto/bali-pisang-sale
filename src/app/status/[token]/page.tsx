"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Order, OrderItem, OrderStatus } from "@prisma/client";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaBox, FaTruck } from 'react-icons/fa';
import LoadingSpinner from "@/components/LoadingSpinner";

// --- Type Definition ---
type OrderWithItems = Order & {
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
};

// --- Helper Components & Data ---
const formatCurrency = (amount: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const statusInfo: Record<OrderStatus, { text: string; color: string; icon: React.ReactNode }> = {
  PENDING: { text: "Awaiting Payment", color: "text-gray-600", icon: <FaSpinner className="animate-spin" /> },
  PAID: { text: "Payment Successful", color: "text-blue-600", icon: <FaCheckCircle /> },
  FULFILLED: { text: "Order Being Prepared", color: "text-yellow-600", icon: <FaBox /> },
  SHIPPED: { text: "Order Shipped", color: "text-green-600", icon: <FaTruck /> },
  CANCELLED: { text: "Order Cancelled", color: "text-red-600", icon: <FaTimesCircle /> },
};

// --- Main Page Component ---
export default function OrderStatusPage() {
  const { token } = useParams();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || typeof token !== 'string') {
      setError("Invalid token.");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/by-token/${token}`);
        if (!response.ok) {
          throw new Error("Order not found.");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [token]);

  if (isLoading) {
    return (
      <LoadingSpinner text="Loading order status..." />
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-stone-50 text-center px-4">
        <FaTimesCircle className="text-5xl text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Failed to Load Order</h1>
        <p className="text-gray-600 mt-2">{error}</p>
        <Link href="/" className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-800">
          Return to Homepage
        </Link>
      </div>
    );
  }

  if (!order) {
    return null; // Should be covered by error state, but as a fallback.
  }

  const currentStatus = statusInfo[order.status];

  return (
    <div className="bg-stone-50 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-3 text-2xl font-bold ${currentStatus.color}`}>
            {currentStatus.icon}
            <span>{currentStatus.text}</span>
          </div>
          <p className="text-gray-600 mt-2">Thank you for your order, {order.customerName.split(' ')[0]}.</p>
        </div>
        
        {/* Order Details */}
        <div className="border-t border-b py-4 space-y-2">
          <div className="flex justify-between"><span className="text-gray-600">Order ID:</span><span className="font-mono text-sm">{order.id}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Date:</span><span>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
        </div>

        {/* Items */}
        <div className="my-6">
          <h3 className="font-bold text-lg mb-4">Order Details</h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
                </div>
                <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Financials */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-700"><span>Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-700"><span>Service Fee:</span><span>{formatCurrency(order.serviceFee)}</span></div>
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Grand Total:</span><span>{formatCurrency(order.totalAmount)}</span></div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-primary hover:underline">
            &larr; Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}