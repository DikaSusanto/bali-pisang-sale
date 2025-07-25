import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await prisma.order.deleteMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: twentyFourHoursAgo, // 'lt' means "less than"
        },
      },
    });

    return NextResponse.json({ message: `Cleanup successful. Deleted ${result.count} abandoned orders.` });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}