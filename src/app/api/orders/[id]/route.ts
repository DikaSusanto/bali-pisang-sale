import { NextResponse } from "next/server";
import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

// ✨ 1. Define the valid transitions on the backend as well
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.FULFILLED, OrderStatus.CANCELLED],
  FULFILLED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [],
  CANCELLED: [],
};

// ... GET handler remains the same ...
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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


// PATCH handler to update the order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status: newStatus }: { status: OrderStatus } = await request.json();
    const { id } = await params;

    // ✨ 2. Fetch the current order to check its status
    const currentOrder = await prisma.order.findUnique({
      where: { id: id },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✨ 3. Validate the transition
    const allowedTransitions = validTransitions[currentOrder.status];
    if (!allowedTransitions.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentOrder.status} to ${newStatus}` },
        { status: 400 } // Bad Request
      );
    }
    
    // ✨ 4. If valid, proceed with the update
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