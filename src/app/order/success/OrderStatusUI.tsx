"use client";

import { useState, useEffect } from 'react';
import { Order, OrderItem, OrderStatus } from "@prisma/client";
import LoadingSpinner from '@/components/LoadingSpinner';

type OrderWithItems = Order & {
  items: OrderItem[];
};

interface OrderStatusUIProps {
  order: OrderWithItems;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function OrderStatusUI({ order }: OrderStatusUIProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info" | null>(null);

  // Ensure Snap script is loaded
  useEffect(() => {
    if (!(window as any).snap) {
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const handlePayNow = async () => {
    setIsProcessing(true);
    setMessage(null);
    setMessageType(null);
    try {
      // Wait for snap to be available
      if (!(window as any).snap) {
        setMessage("Payment system is still loading. Please wait a moment and try again.");
        setMessageType("info");
        setIsProcessing(false);
        return;
      }
      const response = await fetch("/api/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      if (!response.ok) {
        setMessage("Failed to create transaction. Please try again.");
        setMessageType("error");
        setIsProcessing(false);
        return;
      }

      const { token } = await response.json();
      (window as any).snap.pay(token, {
        onSuccess: function (result: any) {
          setMessage("Payment successful! Reloading status...");
          setMessageType("success");
          // Reload after a short delay to fetch latest status
          setTimeout(() => window.location.reload(), 1500);
        },
        onPending: function (result: any) {
          setMessage("Payment pending. Please complete your payment.");
          setMessageType("info");
        },
        onError: function (result: any) {
          setMessage("Payment failed. Please try again.");
          setMessageType("error");
        },
        onClose: function () {
          setMessage('You closed the payment popup without finishing the payment.');
          setMessageType("info");
        }
      });
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-8 text-center">
      {/* Graceful message display */}
      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded ${messageType === "success"
            ? "bg-green-100 text-green-800"
            : messageType === "error"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {message}
        </div>
      )}

      {order.status === OrderStatus.AWAITING_PAYMENT ? (
        <>
          <h2 className="text-2xl font-bold text-yellow-800">Payment Required</h2>
          <p className="text-gray-600 mt-2">
            Your order is ready. The final total is{" "}
            <span className="font-bold">{formatCurrency(order.totalAmount)}</span>.
          </p>
          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="mt-6 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? <LoadingSpinner small /> : `Pay Now (${formatCurrency(order.totalAmount)})`}
          </button>
        </>
      ) : order.status === OrderStatus.PAID ? (
        <>
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Confirmed!</h2>
          <p className="text-gray-600 mt-2">We have received your payment. Your order is now being processed.</p>
        </>
      ) : order.status === OrderStatus.CANCELLED ? (
        <>
          <h2 className="text-2xl font-bold text-red-800">Order Cancelled</h2>
          <p className="text-gray-600 mt-2">This order has been cancelled and cannot be paid.</p>
        </>
      ) : (
        <>
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Confirmed!</h2>
          <p className="text-gray-600 mt-2">We have received your payment. Your order is now being processed.</p>
        </>
      )}
    </div>
  );
}