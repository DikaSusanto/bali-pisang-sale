"use client";

import Link from "next/link";
import { useLanguage } from '@/contexts/LanguageContext';
import { Order, OrderItem } from '@prisma/client';

type OrderWithItems = Order & {
  items: OrderItem[];
};

interface PreOrderSuccessClientProps {
  order: OrderWithItems;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

export default function PreOrderSuccessClient({ order }: PreOrderSuccessClientProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-stone-50 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <svg className="w-14 h-14 mx-auto text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h1 className="text-3xl font-bold text-gray-800">{t('preorderSuccess.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('preorderSuccess.thankYou')}<br />
            <span className="font-semibold">{t('preorderSuccess.preOrderSystem')}</span> {t('preorderSuccess.adminConfirm')}
          </p>
        </div>

        <div className="border-t border-b py-4 space-y-2 mb-6">
          <h3 className="font-bold text-lg mb-4">{t('preorderSuccess.customerInfo')}</h3>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('preorderSuccess.name')}</span>
            <span>{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('preorderSuccess.email')}</span>
            <span>{order.customerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('preorderSuccess.phone')}</span>
            <span>{order.customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('preorderSuccess.address')}</span>
            <span className="text-right">{order.customerAddress}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4">{t('preorderSuccess.orderDetails')}</h3>
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
          <div className="flex justify-between text-gray-700">
            <span>{t('success.subtotal')}</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>{t('success.serviceFee')}</span>
            <span>{formatCurrency(order.serviceFee)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>{t('success.shippingEst')}</span>
            <span>{formatCurrency(order.shippingCost || 0)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>{t('success.grandTotalEst')}</span>
            <span>{formatCurrency(order.subtotal + order.serviceFee + (order.shippingCost || 0))}</span>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/" className="text-primary hover:underline font-semibold">
            {t('preorderSuccess.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}