//app/api/orders/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { OrderStatus } from "@prisma/client";
import { ratelimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  // Get pagination parameters from query string, default to page 1, 10 items per page
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const skip = (page - 1) * pageSize; // Calculate how many records to skip
  const take = pageSize; // Calculate how many records to take

  const where: any = {}; // Use 'any' for the conditional 'where' clause

  if (status && status !== "ALL") {
    // Ensure the status from query string matches a valid OrderStatus enum member
    if (Object.values(OrderStatus).includes(status as OrderStatus)) {
      where.status = status as OrderStatus;
    } else {
      console.warn(`Invalid status filter provided: ${status}`);
    }
  }
  if (startDate) {
    where.createdAt = { ...(where.createdAt || {}), gte: new Date(startDate) };
  }
  if (endDate) {
    // Add 1 day to include the end date fully by making the filter less than the next day's start
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    where.createdAt = { ...(where.createdAt || {}), lt: end };
  }

  try {
    // Fetch a paginated subset of orders
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    });

    // Get the total count of orders matching the filters (without pagination)
    const totalOrdersCount = await prisma.order.count({
      where,
    });

    return NextResponse.json({
      orders,
      totalOrdersCount,
      currentPage: page,
      pageSize: pageSize,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll("id");

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: "No order IDs provided" }, { status: 400 });
    }

    const result = await prisma.order.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    console.error("Error deleting orders:", error);
    return NextResponse.json({ error: "Failed to delete orders" }, { status: 500 });
  }
}
