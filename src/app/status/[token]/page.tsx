import { Suspense } from 'react';
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import StatusClient from './StatusClientPage';
import NavbarStatic from '@/components/NavbarStatic';

export const metadata: Metadata = {
  title: 'Order Status | Bali Pisang Sale',
  description: 'View the current status and details of your Bali Pisang Sale order, including payment, shipping, and fulfillment updates.',
};

export default async function OrderStatusPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // Fetch the order from the database
  const order = await prisma.order.findUnique({
    where: { paymentToken: token },
    include: { items: true },
  });

  // If the order is not found, render the 404 page
  if (!order) {
    notFound();
  }

  return (
    <>
      <NavbarStatic />
      <Suspense fallback={
        <div className="bg-stone-50 min-h-screen py-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <StatusClient order={order} />
      </Suspense>
    </>
  );
}