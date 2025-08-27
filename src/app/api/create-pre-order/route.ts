// src/app/api/create-pre-order/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ratelimit } from "@/lib/rateLimit";
import { z } from "zod";

const customerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string().min(1),
});

const itemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const preOrderSchema = z.object({
  subtotal: z.number().int().positive(),
  serviceFee: z.number().int().nonnegative(),
  items: z.array(itemSchema).min(1),
  customer: customerSchema,
  shippingProvider: z.string().min(1),
  shippingCost: z.number().int().nonnegative(),
});

export async function POST(request: Request) {
  // Rate limit by IP address
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    console.log("Received payload:", body);

    const parsed = preOrderSchema.safeParse(body);
    if (!parsed.success) {
      console.log("Zod validation errors:", parsed.error.issues);
      return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
    }

    const { subtotal, serviceFee, items, customer, shippingProvider, shippingCost } = parsed.data;

    const createdOrder = await prisma.order.create({
      data: {
        totalAmount: 0,
        subtotal,
        serviceFee,
        status: "PENDING",
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        shippingProvider,
        shippingCost,
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