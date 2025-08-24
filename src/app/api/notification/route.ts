// api/notification/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from 'crypto';
import { sendMailWithLog } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const notificationJson = await request.json();

    const signatureKey = crypto.createHash('sha512')
      .update(`${notificationJson.order_id}${notificationJson.status_code}${notificationJson.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
      .digest('hex');

    if (notificationJson.signature_key !== signatureKey) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const { order_id, transaction_status } = notificationJson;

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      const order = await prisma.order.findUnique({
        where: { id: order_id },
      });

      if (order && order.status === 'AWAITING_PAYMENT') {
        // Debounce: Prevent duplicate emails within 1 minute
        const lastSent = order.updatedAt;
        if (!lastSent || Date.now() - new Date(lastSent).getTime() > 60 * 1000) {
          if (order.paymentToken) {
            try {
              await sendMailWithLog({
                to: order.customerEmail,
                subject: `Order Confirmed - #${order.id.slice(-8)}`,
                html: `
    <h1>Thank You, ${order.customerName.split(' ')[0]}!</h1>
    <p>We have received your payment and your order is being prepared.</p>
    <p>You can view your order status at any time using the link below:</p>
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/status/${order.paymentToken}" style="display:inline-block;padding:12px 24px;background-color:#A37A3D;color:white;text-decoration:none;border-radius:8px;">
      Track My Order
    </a>
    <p>Thank you for shopping with us!</p>
  `,
                orderId: order.id,
              });
            } catch (emailError) {
              console.error("SMTP email failed:", emailError);
            }
          }
        }

        // After attempting to send the email, update the order status in the database
        await prisma.order.update({
          where: { id: order_id },
          data: { status: 'PAID' },
        });
      }
    } else if (transaction_status === 'expire' || transaction_status === 'deny' || transaction_status === 'cancel') {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: 'CANCELLED' },
      });
    }

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}