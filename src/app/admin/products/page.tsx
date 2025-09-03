// app/admin/products/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductsClientPage from "./ProductsClientPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Products | Bali Pisang Sale',
  description: 'View and manage all products in the admin panel.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const params = searchParams ? await searchParams : {};
  const page = parseInt(params.page || "1", 10);
  const pageSize = parseInt(params.pageSize || "10", 10);

  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      skip,
      take,
    });
    const totalProductsCount = await prisma.product.count();

    return (
      <ProductsClientPage
        initialProducts={products}
        totalProductsCount={totalProductsCount}
        currentPage={page}
        pageSize={pageSize}
      />
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return (
      <p className="text-center text-red-500 p-8">
        Error loading products. Please try again later.
      </p>
    );
  }
}
