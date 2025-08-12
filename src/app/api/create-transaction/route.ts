// src/app/api/create-transaction/route.ts

import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import prisma from "@/lib/prisma";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.status !== 'AWAITING_PAYMENT') {
      return NextResponse.json({ error: "Order not found or not awaiting payment" }, { status: 400 });
    }

    const item_details = order.items.map(item => ({
      id: item.productId,
      price: item.price,
      quantity: item.quantity,
      name: item.name,
    }));

    if (order.serviceFee > 0) {
      item_details.push({
        id: "SERVICE_FEE",
        price: order.serviceFee,
        quantity: 1,
        name: "Service & Handling Fee"
      });
    }

    // You can also add shipping cost here if you want to display it separately
    if (order.shippingCost && order.shippingCost > 0) {
      item_details.push({
        id: "SHIPPING_COST",
        price: order.shippingCost ?? 0, // ensures it's a number, not null
        quantity: 1,
        name: `Shipping (${order.shippingProvider || "Courier"})`
      });
    }

    const customerDetails = {
      first_name: order.customerName.split(' ')[0],
      last_name: order.customerName.split(' ').slice(1).join(' '),
      email: order.customerEmail,
      phone: order.customerPhone,
      address: order.customerAddress,
    };

    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: order.totalAmount,
      },
      item_details: item_details,
      customer_details: customerDetails,
      callbacks: {
        // This is the most important part: after a successful payment,
        // Midtrans will redirect the user back to this same status page,
        // which will then show the 'PAID' status.
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?token=${order.paymentToken}`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?token=${order.paymentToken}`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?token=${order.paymentToken}`,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });

  } catch (error: any) {
    console.error("API Error:", error);
    if (error.ApiResponse && error.ApiResponse.error_messages) {
      console.error("Midtrans Error:", error.ApiResponse.error_messages);
      return NextResponse.json(
        { error: error.ApiResponse.error_messages.join(', ') },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}