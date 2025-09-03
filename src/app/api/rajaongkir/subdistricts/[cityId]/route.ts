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

export async function GET(request: Request, context: { params: Promise<{ cityId: string }> }) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });

  // Await params for Next.js App Router compatibility
  const { cityId } = await context.params;

  // Validate cityId
  const schema = z.object({ cityId: z.string().min(1) });
  const parseResult = schema.safeParse({ cityId });
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid cityId" }, { status: 400 });
  }

  try {
    const subdistricts: Array<{ id: string; name: string }> = await komerceGetFetch(`/destination/district/${cityId}`);
    const formattedSubdistricts = subdistricts.map((sd) => ({
      id: sd.id,
      name: sd.name,
    }));
    return NextResponse.json(formattedSubdistricts);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}