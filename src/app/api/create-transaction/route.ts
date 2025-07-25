import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const { grandTotal, subtotal, serviceFee, items, customer } = await request.json();

    if (!grandTotal || !items || !customer || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const calculatedSubtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const calculatedServiceFee = calculatedSubtotal > 0 ? Math.ceil((calculatedSubtotal * 0.025) + 1000) : 0;
    const calculatedGrandTotal = calculatedSubtotal + calculatedServiceFee;

    if (grandTotal !== calculatedGrandTotal) {
        return NextResponse.json({ error: "Price mismatch. Please try again." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email || !emailRegex.test(customer.email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    const paymentToken = crypto.randomBytes(32).toString('hex');

    const newOrder = await prisma.order.create({
      data: {
        totalAmount: grandTotal, 
        subtotal: subtotal,
        serviceFee: serviceFee,
        status: "PENDING",
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        paymentToken: paymentToken,
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

    const item_details = items.map((item: any) => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name,
    }));

    if (serviceFee > 0) {
        item_details.push({
            id: "SERVICE_FEE",
            price: serviceFee,
            quantity: 1,
            name: "Service & Handling Fee"
        });
    }
    
    const parameter = {
      transaction_details: {
        order_id: newOrder.id,
        gross_amount: grandTotal,
      },
      item_details: item_details,
      customer_details: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?token=${paymentToken}`,
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