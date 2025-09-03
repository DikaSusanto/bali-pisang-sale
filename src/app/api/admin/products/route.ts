import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ratelimit } from "@/lib/rateLimit";
import { z } from "zod";

// Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  price: z.preprocess((val) => Number(val), z.number().int().positive()),
  weight: z.string().min(1).max(20).trim(),
  image: z.string().min(1), 
});

// GET: Fetch all products
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
      skip,
      take,
    });
    const totalProductsCount = await prisma.product.count();

    return NextResponse.json({
      products,
      totalProductsCount,
      currentPage: page,
      pageSize,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(request: Request) {
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
    const body = await request.json();
    // Validate input using Zod
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
    }
    const { name, price, weight, image } = parsed.data;

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        weight,
        image
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}