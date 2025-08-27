// app/api/rajaongkir/provinces/route.ts

import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/rateLimit";

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

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });

  try {
    const provinces = await komerceGetFetch('/destination/province');
    const formattedProvinces = provinces.map((prov: any) => ({
      id: prov.id,
      name: prov.name,
    }));
    return NextResponse.json(formattedProvinces);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}