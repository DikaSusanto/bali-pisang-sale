import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OrderStatusUI from './OrderStatusUI';
import NavbarStatic from '@/components/NavbarStatic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pay for Your Order | Bali Pisang Sale',
  description: 'Complete your payment for your Bali Pisang Sale order and view your order details and status.',
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

  return (
    <>
      <NavbarStatic />
      <OrderStatusUI order={order} />
    </>
  );
}