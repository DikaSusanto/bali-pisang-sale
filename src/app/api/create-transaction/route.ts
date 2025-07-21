// /app/api/create-transaction/route.ts

import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { PrismaClient } from '@prisma/client';

// 1. Instantiate Prisma and Midtrans clients
const prisma = new PrismaClient();
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const { total, items, customer } = await request.json();

    if (!total || !items || !customer || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Create the Order and its associated OrderItems in a single transaction
    const newOrder = await prisma.order.create({
      data: {
        totalAmount: total,
        status: "PENDING",
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        // Use a nested write to create related OrderItems
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

    // 3. Map the cart items to Midtrans' 'item_details' format
    // This part remains the same
    const item_details = items.map((item: any) => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name,
    }));

    // 4. Construct the final parameter for Midtrans
    // This part remains the same
    const parameter = {
      transaction_details: {
        order_id: newOrder.id, // Use the ID from your database
        gross_amount: total,
      },
      item_details: item_details,
      customer_details: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      },
    };

    const token = await snap.createTransactionToken(parameter);

    return NextResponse.json({ token });

  } catch (error) {
    console.error("API Error:", error);
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}