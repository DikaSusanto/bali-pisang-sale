"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Order, OrderItem, OrderStatus } from "@prisma/client";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

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
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info" | null>(null);

  // Ensure Snap script is loaded
  useEffect(() => {
    if (!window.snap) {
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
      if (!window.snap) {
        setMessage(t('success.paymentSystemLoading') || "Payment system is still loading. Please wait a moment and try again.");
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
        setMessage(t('success.failedCreateTransaction') || "Failed to create transaction. Please try again.");
        setMessageType("error");
        setIsProcessing(false);
        return;
      }

      const { token } = await response.json();
      window.snap?.pay(token, {
        onSuccess: function () {
          setMessage(t('success.paymentSuccessReload') || "Payment successful! Reloading status...");
          setMessageType("success");
          setTimeout(() => window.location.reload(), 1500);
        },
        onPending: function () {
          setMessage(t('success.paymentPending') || "Payment pending. Please complete your payment.");
          setMessageType("info");
        },
        onError: function () {
          setMessage(t('success.paymentFailed') || "Payment failed. Please try again.");
          setMessageType("error");
        },
        onClose: function () {
          setMessage(t('success.paymentClosed') || 'You closed the payment popup without finishing the payment.');
          setMessageType("info");
        }
      });
    } catch (error) {
      setMessage(t('success.paymentError') || "An error occurred. Please try again.");
      setMessageType("error");
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mt-4">{t('success.orderDetails')}</h1>
          <p className="text-sm text-gray-500 mt-4">
            {t('success.orderId')}: <span className="font-mono">{order.id}</span>
          </p>
        </div>

        <div className="border-t my-8"></div>

        {/* Payment/status logic */}
        <div className="mb-8 text-center">
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
              <h2 className="text-2xl font-bold text-yellow-800">{t('success.paymentRequired')}</h2>
              <p className="text-gray-600 mt-2">
                {t('success.paymentRequiredDesc')}{" "}
                <span className="font-bold">{formatCurrency(order.totalAmount)}</span>.
              </p>
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="mt-6 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? <LoadingSpinner small /> : `${t('success.payNow')} (${formatCurrency(order.totalAmount)})`}
              </button>
            </>
          ) : order.status === OrderStatus.PAID ? (
            <>
              <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">{t('success.paymentConfirmed')}</h2>
              <p className="text-gray-600 mt-2">{t('success.paymentConfirmedDesc')}</p>
            </>
          ) : order.status === OrderStatus.CANCELLED ? (
            <>
              <h2 className="text-2xl font-bold text-red-800">{t('success.orderCancelled')}</h2>
              <p className="text-gray-600 mt-2">{t('success.orderCancelledDesc')}</p>
            </>
          ) : (
            <>
              <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">{t('success.paymentConfirmed')}</h2>
              <p className="text-gray-600 mt-2">{t('success.paymentConfirmedDesc')}</p>
            </>
          )}
        </div>

        <div className="border-t my-8"></div>

        {/* Order details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('success.itemsInOrder')}</h2>
          <div className="space-y-4 mb-6">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {t('success.quantity')}: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.quantity * item.price)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>{t('success.subtotal')}:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>{t('success.serviceFee')}:</span>
              <span>{formatCurrency(order.serviceFee)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>{t('success.shippingFee')}:</span>
              <span>{formatCurrency(order.shippingCost || 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
              <span>{t('success.grandTotal')}:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
              {t('success.backToHomepage')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}