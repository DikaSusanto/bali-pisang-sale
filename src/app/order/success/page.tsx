import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OrderStatusUI from './OrderStatusUI';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pay for Your Order | Bali Pisang Sale',
  description: 'Complete your payment for your Bali Pisang Sale order and view your order details and status.',
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default async function OrderPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect(`/order/failed?code=MISSING_TOKEN`);
  }

  const order = await prisma.order.findUnique({
    where: { paymentToken: token },
    include: { items: true },
  });

  if (!order) {
    redirect(`/order/failed?code=ORDER_NOT_FOUND`);
  }

  const orderData = {
    ...order,
    items: order.items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.price,
    }))
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Order Details</h1>
          <p className="text-sm text-gray-500 mt-4">Order ID: <span className="font-mono">{order.id}</span></p>
        </div>

        <div className="border-t my-8"></div>

        {/* Client component handles payment/status logic */}
        <OrderStatusUI order={orderData} />

        <div className="border-t my-8"></div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Items in Order</h2>
          <div className="space-y-4 mb-6">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.quantity * item.price)}
                </p>
              </div>
            ))}
          </div>
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-700"><span>Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-700"><span>Service Fee:</span><span>{formatCurrency(order.serviceFee)}</span></div>
          <div className="flex justify-between text-gray-700"><span>Shipping Fee:</span><span>{formatCurrency(order.shippingCost || 0)}</span></div>
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Grand Total:</span><span>{formatCurrency(order.totalAmount)}</span></div>
        </div>

        <div className="text-center mt-10">
          <Link href="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
            → Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}