// src/app/api/create-pre-order/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subtotal, serviceFee, items, customer, shippingProvider, shippingCost } = body;

    if (!items || !customer || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdOrder = await prisma.order.create({
      data: {
        totalAmount: 0,
        subtotal: subtotal,
        serviceFee: serviceFee,
        status: "PENDING",
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        shippingProvider: shippingProvider,
        shippingCost: shippingCost,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ id: createdOrder.id, message: "Pre-order created successfully" });

  } catch (error) {
    console.error("Pre-order error:", error);
    return NextResponse.json({ error: "Failed to create pre-order" }, { status: 500 });
  }
}