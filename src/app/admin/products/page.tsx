import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductsClientPage from "./ProductsClientPage";

// This Server Component fetches the initial product list
export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  });

  return <ProductsClientPage initialProducts={products} />;
}