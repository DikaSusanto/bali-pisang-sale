"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Order, OrderItem } from "@prisma/client";

// Define a type for the combined Order and OrderItem data
type OrderWithItems = Order & { items: OrderItem[] };

function SuccessContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const transactionStatus = searchParams.get("transaction_status");

    if (!orderId) {
      setError("Order ID is missing.");
      setIsLoading(false);
      return;
    }
    
    // Optional: Check if the transaction was successful
    if (transactionStatus !== 'settlement' && transactionStatus !== 'capture') {
        setError("Payment was not successful. Please contact support.");
        setIsLoading(false);
        return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Could not find your order.");
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
  }, [searchParams]);

  if (isLoading) {
    return <p className="text-center text-lg">Verifying your order...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 text-lg">{error}</p>;
  }

  if (!order) {
    return <p className="text-center text-lg">Order details could not be loaded.</p>;
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto">
      <div className="text-center">
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Thank you for your order!</h1>
        <p className="text-gray-600 mt-2">Your payment was successful and your order is being processed.</p>
        <p className="text-sm text-gray-500 mt-4">Order ID: <span className="font-mono">{order.id}</span></p>
      </div>

      <div className="border-t my-8"></div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4 mb-6">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.quantity * item.price)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
          <p>Total</p>
          <p>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(order.totalAmount)}</p>
        </div>
      </div>
      
      <div className="text-center mt-10">
        <Link href="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
            → Back to Homepage
        </Link>
      </div>
    </div>
  );
}


// We wrap the main component in Suspense because useSearchParams() requires it.
export default function SuccessPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <Suspense fallback={<p className="text-center text-lg">Loading...</p>}>
                <SuccessContent />
            </Suspense>
        </div>
    )
}