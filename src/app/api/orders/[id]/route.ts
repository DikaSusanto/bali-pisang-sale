import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.FULFILLED, OrderStatus.CANCELLED],
  FULFILLED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [],
  CANCELLED: [],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✨ Check for a valid admin session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: id },
      include: {
        items: true,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✨ Check for a valid admin session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status: newStatus }: { status: OrderStatus } = await request.json();
    const { id } = await params;

    const currentOrder = await prisma.order.findUnique({
      where: { id: id },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const allowedTransitions = validTransitions[currentOrder.status];
    if (!allowedTransitions.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentOrder.status} to ${newStatus}` },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { status: newStatus },
      include: {
        items: true,
      },
    });
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("API PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}