import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// DELETE: Delete a product by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

// PUT: Update a product by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
   const session = await getServerSession(authOptions);
   if (!session) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
   
   try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, weight, image } = body;

    // Basic validation
    if (!name || !price || !weight || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseInt(price, 10),
        weight,
        image,
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}