import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OrdersClientPage from "./OrdersClientPage";

// This is now an async Server Component
export default async function OrdersPage() {
  // 1. Check for a session on the server
  const session = await getServerSession(authOptions);

  // 2. If no session, redirect immediately
  if (!session) {
    redirect("/login");
  }

  // 3. If session is valid, fetch data directly on the server
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // 4. Render the client component and pass the data as a prop
  return <OrdersClientPage initialOrders={orders} />;
}