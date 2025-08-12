import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Resend } from "resend";
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function for email formatting
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

// Updated transitions to include the new status
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.AWAITING_PAYMENT, OrderStatus.CANCELLED],
  AWAITING_PAYMENT: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.FULFILLED, OrderStatus.CANCELLED],
  FULFILLED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [],
  CANCELLED: [],
};

// GET handler
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: id },
      include: { items: true },
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}

// PATCH handler
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    // A) Finalizing a pre-order with shipping cost
    if (body.finalShippingCost) {
      const { finalShippingCost } = body;

      const order = await prisma.order.findUnique({ where: { id } });
      if (!order || order.status !== 'PENDING') {
        throw new Error("Order not found or cannot be finalized.");
      }

      const grandTotal = order.subtotal + order.serviceFee + finalShippingCost;
      const paymentToken = crypto.randomBytes(32).toString('hex');

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          shippingCost: finalShippingCost,
          totalAmount: grandTotal,
          status: 'AWAITING_PAYMENT',
          paymentToken: paymentToken,
        },
        include: { items: true }
      });

      // Send payment link email to the customer
      await resend.emails.send({
        from: 'Bali Pisang Sale <onboarding@resend.dev>',
        to: [updatedOrder.customerEmail],
        subject: `Your Bali Pisang Sale Order is Ready for Payment - #${updatedOrder.id.slice(-6)}`,
        html: `<h1>Your Order is Ready!</h1><p>We have confirmed your pre-order. The final cost including shipping is ${formatCurrency(grandTotal)}.</p><p>Please use the link below to complete your payment within 24 hours:</p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/order/success?token=${paymentToken}" style="display:inline-block;padding:12px 24px;background-color:#A37A3D;color:white;text-decoration:none;border-radius:8px;">Pay Now (${formatCurrency(grandTotal)})</a>`
      });

      return NextResponse.json(updatedOrder);

      // B) Simple status update (e.g., FULFILLED -> SHIPPED)
    } else if (body.status) {
      const { status: newStatus } = body;
      const currentOrder = await prisma.order.findUnique({ where: { id } });

      if (!currentOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const allowedTransitions = validTransitions[currentOrder.status];
      if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
        return NextResponse.json({ error: `Invalid status transition from ${currentOrder.status} to ${newStatus}` }, { status: 400 });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: newStatus },
        include: { items: true },
      });

      return NextResponse.json(updatedOrder);
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  } catch (error) {
    console.error("API PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}