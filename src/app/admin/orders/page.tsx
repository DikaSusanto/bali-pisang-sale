"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@prisma/client";

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-gray-200 text-gray-800",
  PAID: "bg-blue-200 text-blue-800",
  FULFILLED: "bg-yellow-200 text-yellow-800",
  SHIPPED: "bg-green-200 text-green-800",
  CANCELLED: "bg-red-200 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) return <p className="text-center">Loading orders...</p>;

  return (
    <div className="container mx-auto px-4 lg:px-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Orders</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="border-b bg-stone-50">
            <tr>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-stone-50">
                <td className="px-6 py-4 text-sm font-mono">{order.id.slice(-8)}...</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(order.totalAmount)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline font-semibold">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}