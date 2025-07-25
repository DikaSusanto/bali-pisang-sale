"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Order, OrderItem } from "@prisma/client";

type OrderWithItems = Order & { items: OrderItem[] };

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✨ 1. Read the secure token from the URL, not the order_id
    const token = searchParams.get("token");

    // We no longer need to check transaction_status here, as the token is our proof.
    // The final status update will be handled by the server-to-server webhook.

    if (!token) {
      // Redirect if the token is missing
      router.push(`/order/failed?code=MISSING_ID`); // Or a new 'MISSING_TOKEN' code
      return;
    }

    const fetchOrder = async () => {
      try {
        // ✨ 2. Call the new, secure API endpoint with the token
        const response = await fetch(`/api/orders/by-token/${token}`);
        
        if (!response.ok) {
          // This will happen if the token is invalid or already used
          throw new Error("ORDER_NOT_FOUND");
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (err: any) {
        // ✨ 3. Redirect on any error
        router.push(`/order/failed?code=${err.message || 'UNKNOWN_ERROR'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams, router]);

  if (isLoading || !order) {
    return <p className="text-center text-lg">Verifying your order...</p>;
  }

  // The rest of your success UI remains the same
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


// The wrapper component remains the same
export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<p className="text-center text-lg">Loading...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}