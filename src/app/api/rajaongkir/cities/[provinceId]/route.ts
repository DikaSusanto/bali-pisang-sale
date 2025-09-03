// app/api/rajaongkir/cities/[provinceId]/route.ts

import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/rateLimit";
import { z } from "zod";

const KOMERCE_BASE_URL = "https://api.collaborator.komerce.id";
const KOMERCE_API_KEY = process.env.KOMERCE_API_KEY;

async function komerceGetFetch(endpoint: string) {
  if (!KOMERCE_API_KEY) throw new Error("Missing API key.");
  const fullUrl = `${KOMERCE_BASE_URL}/tariff/api/v1${endpoint}`;
  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: { 'key': KOMERCE_API_KEY },
  });
  const data = await response.json();
  if (!response.ok || data.meta?.code !== 200) throw new Error(data.meta?.message || 'Unknown error');
  return data.data;
}

export async function GET(request: Request, context: { params: Promise<{ provinceId: string }> }) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });

  // Await params for Next.js App Router compatibility
  const { provinceId } = await context.params;

  // Validate provinceId
  const schema = z.object({ provinceId: z.string().min(1) });
  const parseResult = schema.safeParse({ provinceId });
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid provinceId" }, { status: 400 });
  }

  try {
    const cities: Array<{ id: string; name: string }> = await komerceGetFetch(`/destination/city/${provinceId}`);
    const formattedCities = cities.map((city) => ({
      id: city.id,
      name: city.name,
    }));
    return NextResponse.json(formattedCities);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}