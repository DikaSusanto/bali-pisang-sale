import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMailWithLog } from "@/lib/mail";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const failedEmails = await prisma.emailLog.findMany({
    where: {
      status: 'FAILED',
      retryCount: { lt: 3 },
    },
    orderBy: { createdAt: 'asc' },
    take: 10,
  });

  let retried = 0;
  for (const email of failedEmails) {
    try {
      await sendMailWithLog({
        to: email.to,
        subject: email.subject,
        html: email.body,
        orderId: email.orderId || undefined,
      });
      retried++;
    } catch {
      // Already logged in sendMailWithLog
    }
  }

  return NextResponse.json({ retried });
}