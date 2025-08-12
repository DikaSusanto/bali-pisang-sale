import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaBox, FaTruck } from 'react-icons/fa';

// --- Helper Components & Data ---
const formatCurrency = (amount: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const statusInfo: Record<OrderStatus, { text: string; color: string; icon: React.ReactNode }> = {
  PENDING: { text: "Awaiting Payment", color: "text-gray-600", icon: <FaSpinner className="animate-spin" /> },
  AWAITING_PAYMENT: { text: "Awaiting Payment", color: "text-yellow-600", icon: <FaSpinner className="animate-spin" /> },
  PAID: { text: "Payment Successful", color: "text-blue-600", icon: <FaCheckCircle /> },
  FULFILLED: { text: "Order Being Prepared", color: "text-yellow-600", icon: <FaBox /> },
  SHIPPED: { text: "Order Shipped", color: "text-green-600", icon: <FaTruck /> },
  CANCELLED: { text: "Order Cancelled", color: "text-red-600", icon: <FaTimesCircle /> },
};


// This is now an async Server Component that receives params
export default async function OrderStatusPage({ params }: { params: { token: string } }) {
  const { token } = await params;

  // 1. Fetch the order directly from the database on the server
  const order = await prisma.order.findUnique({
    where: { paymentToken: token },
    include: { items: true },
  });

  // 2. If the order is not found, render the 404 page
  if (!order) {
    notFound();
  }

  const currentStatus = statusInfo[order.status];

  // 3. If the order is found, render the UI directly
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

        <div className="border-t border-b py-4 space-y-2">
          <div className="flex justify-between"><span className="text-gray-600">Order ID:</span><span className="font-mono text-sm">{order.id}</span></div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>
              {/* Corrected date formatting to prevent hydration errors */}
              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Makassar'
              })}
            </span>
          </div>
        </div>

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

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-700"><span>Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-700"><span>Service Fee:</span><span>{formatCurrency(order.serviceFee)}</span></div>
          <div className="flex justify-between text-gray-700"><span>Shipping Fee:</span><span>{formatCurrency(order.shippingCost || 0)}</span></div>
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