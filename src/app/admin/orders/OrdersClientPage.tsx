"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

interface OrdersClientPageProps {
  initialOrders: Order[];
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-gray-200 text-gray-800",
  PAID: "bg-blue-200 text-blue-800",
  FULFILLED: "bg-yellow-200 text-yellow-800",
  SHIPPED: "bg-green-200 text-green-800",
  CANCELLED: "bg-red-200 text-red-800",
};

export default function OrdersClientPage({ initialOrders }: OrdersClientPageProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadInitialOrders = async () => {
      setIsLoading(true);
      try {
        setOrders(initialOrders);
        setLastUpdated(new Date());
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialOrders();
  }, []);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) {
        if (response.status === 401) {
          await signOut({ redirect: false });
          router.push('/login');
        }
        throw new Error("Failed to fetch orders.");
      }
      const data = await response.json();
      setOrders(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (error) return <p className="text-center text-red-500 p-8">Error: {error}</p>;
  if (isLoading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <div className="container mx-auto px-4 lg:px-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
        <div className="text-sm text-gray-500 text-right">
          {isRefreshing ? (
            <span>Refreshing...</span>
          ) : (
            lastUpdated && (
              <span>
                Last updated: {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WITA
              </span>
            )
          )}
        </div>
      </div>
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
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'Asia/Makassar',
                    })}
                  </td>
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