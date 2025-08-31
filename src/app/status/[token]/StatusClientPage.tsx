"use client";

import Link from "next/link";
import { Order, OrderItem, OrderStatus } from "@prisma/client";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaBox, FaTruck } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

type OrderWithItems = Order & {
  items: OrderItem[];
};

interface StatusClientProps {
  order: OrderWithItems;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat("id-ID", { 
  style: "currency", 
  currency: "IDR", 
  minimumFractionDigits: 0 
}).format(amount);

export default function StatusClient({ order }: StatusClientProps) {
  const { t, language } = useLanguage();

  const getStatusInfo = (status: OrderStatus) => {
    const statusMap = {
      PENDING: { 
        text: t('status.pending'), 
        color: "text-gray-600", 
        icon: <FaSpinner className="animate-spin" /> 
      },
      AWAITING_PAYMENT: { 
        text: t('status.awaitingPayment'), 
        color: "text-yellow-600", 
        icon: <FaSpinner className="animate-spin" /> 
      },
      PAID: { 
        text: t('status.paid'), 
        color: "text-blue-600", 
        icon: <FaCheckCircle /> 
      },
      FULFILLED: { 
        text: t('status.fulfilled'), 
        color: "text-yellow-600", 
        icon: <FaBox /> 
      },
      SHIPPED: { 
        text: t('status.shipped'), 
        color: "text-green-600", 
        icon: <FaTruck /> 
      },
      CANCELLED: { 
        text: t('status.cancelled'), 
        color: "text-red-600", 
        icon: <FaTimesCircle /> 
      },
    };
    return statusMap[status];
  };

  const currentStatus = getStatusInfo(order.status);

  return (
    <div className="bg-stone-50 min-h-screen py-12 px-4 pt-24"> {/* Added pt-24 for navbar space */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-3 text-2xl font-bold ${currentStatus.color}`}>
            {currentStatus.icon}
            <span>{currentStatus.text}</span>
          </div>
          <p className="text-gray-600 mt-2">
            {t('status.thankYou')}, {order.customerName.split(' ')[0]}.
          </p>
        </div>

        <div className="border-t border-b py-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('status.orderId')}:</span>
            <span className="font-mono text-sm">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('status.date')}:</span>
            <span>
              {new Date(order.createdAt).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                day: 'numeric', 
                month: 'long', 
                year: 'numeric', 
                timeZone: 'Asia/Makassar'
              })}
            </span>
          </div>
        </div>

        <div className="my-6">
          <h3 className="font-bold text-lg mb-4">{t('status.orderDetails')}</h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>{t('status.subtotal')}:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>{t('status.serviceFee')}:</span>
            <span>{formatCurrency(order.serviceFee)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>{t('status.shippingFee')}:</span>
            <span>{formatCurrency(order.shippingCost || 0)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>{t('status.grandTotal')}:</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-primary hover:underline">
            {t('status.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}