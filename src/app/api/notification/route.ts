//app/api/notification/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        // First, send the email using the 'order' object which has all the data
        if (order.paymentToken) {
           try {
              await resend.emails.send({
                from: 'Bali Pisang Sale <onboarding@resend.dev>',
                to: [order.customerEmail],
                subject: `Order Confirmed - #${order.id.slice(-6)}`,
                html: `
                  <h1>Thank You, ${order.customerName.split(' ')[0]}!</h1>
                  <p>We have received your payment and your order is being prepared.</p>
                  <p>You can view your order status at any time using the link below:</p>
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/status/${order.paymentToken}" style="display:inline-block;padding:12px 24px;background-color:#A37A3D;color:white;text-decoration:none;border-radius:8px;">
                    Track My Order
                  </a>
                  <p>Thank you for shopping with us!</p>
                `
              });
           } catch (emailError) {
              console.error("Resend email failed:", emailError);
              // Decide if you still want to proceed even if email fails
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