import { Suspense } from 'react';
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import PreOrderSuccessClient from './PreOrderSuccessClientPage';

export const metadata: Metadata = {
  title: 'Pre-Order Success | Bali Pisang Sale',
  description: 'Your pre-order has been received. Bali Pisang Sale will confirm your order and send payment details soon.',
};

export default async function PreOrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the order from the database
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <Suspense fallback={
      <div className="bg-stone-50 min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PreOrderSuccessClient order={order} />
    </Suspense>
  );
}