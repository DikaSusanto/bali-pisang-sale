// app/admin/orders/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OrdersClientPage from "./OrdersClientPage";
import { OrderStatus } from "@prisma/client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Orders | Bali Pisang Sale',
  description: 'View and manage all orders in the admin panel.',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const params = searchParams ? await searchParams : {};
  const { status, startDate, endDate, page, pageSize } = params || {};
  const currentPage = parseInt(page || "1", 10);
  const itemsPerPage = parseInt(pageSize || "10", 10);

  const skip = (currentPage - 1) * itemsPerPage;
  const take = itemsPerPage;

  const whereClause: Record<string, unknown> = {};

  if (status && status !== "ALL") {
    if (Object.values(OrderStatus).includes(status as OrderStatus)) {
      whereClause.status = status as OrderStatus;
    } else {
      console.warn(`Invalid status filter provided: ${status}`);
    }
  }

  if (startDate) {
    whereClause.createdAt = { ...(whereClause.createdAt || {}), gte: new Date(startDate) };
  }
  if (endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    whereClause.createdAt = { ...(whereClause.createdAt || {}), lte: endOfDay };
  }

  try {
    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: take,
    });

    const totalOrdersCount = await prisma.order.count({
      where: whereClause,
    });

    return (
      <OrdersClientPage
        initialOrders={orders}
        totalOrdersCount={totalOrdersCount}
        currentPage={currentPage}
        pageSize={itemsPerPage}
      />
    );
  } catch (error) {
    console.error("Error in AdminOrdersPage server component:", error);
    return <p className="text-center text-red-500 p-8">Failed to load orders.</p>;
  }
}