// app/api/orders/[id]/route.ts

import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import crypto from 'crypto';
import { sendMailWithLog } from "@/lib/mail";
import { ratelimit } from "@/lib/rateLimit";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.AWAITING_PAYMENT, OrderStatus.CANCELLED],
  AWAITING_PAYMENT: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.FULFILLED, OrderStatus.CANCELLED],
  FULFILLED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [],
  CANCELLED: [],
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit by IP address
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  try {
    // Await params for Next.js App Router compatibility
    const { id } = await context.params;
    const body = await request.json();

    // Finalize shipping cost
    if (body.finalShippingCost !== undefined) {
      const cost = Number(body.finalShippingCost);
      if (isNaN(cost) || cost < 5000) {
        return NextResponse.json({ error: "Shipping cost must be at least Rp 5.000." }, { status: 400 });
      }

      const order = await prisma.order.findUnique({ where: { id } });
      if (!order || order.status !== 'PENDING') {
        return NextResponse.json({ error: "Order not found or cannot be finalized." }, { status: 400 });
      }

      const grandTotal = order.subtotal + order.serviceFee + cost;
      const paymentToken = crypto.randomBytes(32).toString('hex');

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          shippingCost: cost,
          totalAmount: grandTotal,
          status: 'AWAITING_PAYMENT',
          paymentToken: paymentToken,
        },
        include: { items: true }
      });

      // Debounce: Prevent duplicate emails within 1 minute
      const lastSent = order.updatedAt;
      if (!lastSent || Date.now() - new Date(lastSent).getTime() > 60 * 1000) {
        try {
          await sendMailWithLog({
            to: updatedOrder.customerEmail,
            subject: `Your Bali Pisang Sale Order is Ready for Payment - #${updatedOrder.id.slice(-8)}`,
            html: `<h1>Your Order is Ready!</h1><p>We have confirmed your pre-order. The final cost including shipping is ${formatCurrency(grandTotal)}.</p><p>Please use the link below to complete your payment within 24 hours:</p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/order/success?token=${paymentToken}" style="display:inline-block;padding:12px 24px;background-color:#A37A3D;color:white;text-decoration:none;border-radius:8px;">Pay Now (${formatCurrency(grandTotal)})</a>`,
            orderId: updatedOrder.id,
          });
        } catch (emailError) {
          console.error("SMTP email failed:", emailError);
        }
      }

      return NextResponse.json(updatedOrder);
    }

    // Status update
    if (body.status) {
      const { status: newStatus } = body;
      if (!Object.values(OrderStatus).includes(newStatus)) {
        return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
      }

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