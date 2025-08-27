import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/rateLimit";
import { z } from "zod";

const KOMERCE_BASE_URL = "https://api.collaborator.komerce.id";
const KOMERCE_API_KEY = process.env.KOMERCE_API_KEY;

async function komercePostFetch<T>(endpoint: string, payload: any): Promise<T[]> {
  if (!KOMERCE_API_KEY) throw new Error("Missing Komerce API key.");
  const fullUrl = `${KOMERCE_BASE_URL}/tariff/api/v1${endpoint}`;
  const formBody = new URLSearchParams(payload).toString();
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: { 'key': KOMERCE_API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody
  });
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    if (!response.ok || data.meta?.code !== 200) throw new Error(data.meta?.message || "API error");
    return data.data || [];
  } catch (err) {
    throw new Error("Failed to parse Komerce API response");
  }
}

const courierRatesSchema = z.object({
  destination_area_id: z.string().min(1),
  weight: z.number().int().positive(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });

  const body = await request.json();
  const parsed = courierRatesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
  }

  try {
    const { destination_area_id, weight } = parsed.data;
    const origin_subdistrict_id = "2229"; // Your store's subdistrict ID
    const finalWeight = Math.max(1000, Number(weight));
    const couriers = ["jne"];

    let regPrice: number | null = null;
    let cheapestPrice: number | null = null;

    for (const courier of couriers) {
      const payload = {
        origin: origin_subdistrict_id,
        destination: destination_area_id,
        weight: finalWeight,
        courier: courier,
        price: 'lowest'
      };
      const courierResults = await komercePostFetch<any>('/calculate/district/domestic-cost', payload);

      // Prefer REG service
      const regService = courierResults.find(
        (service: any) => service.service === "REG" && typeof service.cost === "number" && service.cost > 0
      );
      if (regService) regPrice = regService.cost;

      // Find the cheapest service
      const costs = courierResults
        .filter((service: any) => typeof service.cost === "number" && service.cost > 0)
        .map((service: any) => service.cost);

      if (costs.length > 0) {
        const minCost = Math.min(...costs);
        if (cheapestPrice === null || minCost < cheapestPrice) {
          cheapestPrice = minCost;
        }
      }
    }

    let estimatedPrice = regPrice ?? cheapestPrice ?? 15000;
    return NextResponse.json({ estimatedPrice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}