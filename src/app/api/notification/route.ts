import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

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
      await prisma.order.update({
        where: { id: order_id },
        data: { status: 'PAID' },
      });
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