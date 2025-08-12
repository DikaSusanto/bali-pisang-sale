// src/app/order/page.tsx

import prisma from "@/lib/prisma";
import OrderClientPage from "./OrderClientPage";

// This Server Component fetches the product list from the database
export default async function OrderPage() {
  const products = await prisma.product.findMany();

  // It then passes the products to the Client Component
  return <OrderClientPage products={products} />;
}