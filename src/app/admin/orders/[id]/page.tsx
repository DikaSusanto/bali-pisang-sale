import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OrderDetailClientPage from "./OrderDetailClientPage"; // Import the new client component
import { notFound } from 'next/navigation';

// Server Components in dynamic routes receive params as a prop
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Check for a session on the server
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // 2. Await params before using
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  // 3. If no order is found for that ID, show a 404 page
  if (!order) {
    notFound();
  }

  // 4. Render the client component and pass the fetched data as a prop
  return <OrderDetailClientPage initialOrder={order} />;
}