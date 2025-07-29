import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const order = await prisma.order.findUnique({
      where: { paymentToken: token },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found or token is invalid." }, { status: 404 });
    }
    
    return NextResponse.json(order);

  } catch (error) {
    console.error("Error fetching order by token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}