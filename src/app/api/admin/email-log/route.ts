import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { EmailStatus } from "@prisma/client";
import { ratelimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const to = searchParams.get("to");
  const orderId = searchParams.get("orderId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: any = {};

  if (status && Object.values(EmailStatus).includes(status as EmailStatus)) {
    where.status = status as EmailStatus;
  }
  if (to) {
    where.to = { contains: to, mode: "insensitive" };
  }
  if (orderId) {
    where.orderId = { contains: orderId, mode: "insensitive" };
  }

  try {
    const logs = await prisma.emailLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: { order: true },
    });

    const totalLogsCount = await prisma.emailLog.count({ where });

    return NextResponse.json({
      logs,
      totalLogsCount,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching email logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit by IP address
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  const body = await req.json();
  const { id, status } = body;
  if (!id || !status || !Object.values(EmailStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const updatedLog = await prisma.emailLog.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updatedLog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit by IP address
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const ids = searchParams.getAll("id");
  if (!ids || ids.length === 0) {
    return NextResponse.json({ error: "No log IDs provided" }, { status: 400 });
  }
  try {
    const result = await prisma.emailLog.deleteMany({
      where: { id: { in: ids } },
    });
    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete logs" }, { status: 500 });
  }
}