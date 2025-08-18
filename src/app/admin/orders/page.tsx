// app/admin/orders/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OrdersClientPage from "./OrdersClientPage";
import { OrderStatus } from "@prisma/client";

// Define the expected search parameters from the URL, including pagination
interface AdminOrdersPageProps {
  searchParams: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: string; // New: for current page
    pageSize?: string; // New: for items per page
  };
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const { status, startDate, endDate, page, pageSize } = params;
  const currentPage = parseInt(page || "1", 10);
  const itemsPerPage = parseInt(pageSize || "10", 10);

  const skip = (currentPage - 1) * itemsPerPage;
  const take = itemsPerPage;

  const whereClause: any = {};

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
    // Fetch orders with applied filters and pagination
    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: take,
    });

    // Get the total count of orders matching the filters (without pagination)
    const totalOrdersCount = await prisma.order.count({
      where: whereClause,
    });

    // Pass all necessary data to the client component
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
