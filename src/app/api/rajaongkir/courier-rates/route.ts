import { NextResponse } from "next/server";

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
        if (!response.ok || data.meta?.code !== 200) {
            console.error("Komerce API error:", data);
            throw new Error(data.meta?.message || "API error");
        }
        return data.data || [];
    } catch (err) {
        console.error("Komerce API raw response:", text);
        throw new Error("Failed to parse Komerce API response");
    }
}

export async function POST(request: Request) {
    try {
        const { destination_area_id, weight } = await request.json();
        if (!destination_area_id || !weight) return NextResponse.json({ error: "Missing destination ID or weight." }, { status: 400 });
        const origin_subdistrict_id = "2229"; // Your store's subdistrict ID
        const finalWeight = Math.max(1000, Number(weight));
        const couriers = ["jne"]; // Only JNE for free plan

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
            console.log("Sending payload to Komerce:", payload);
            const courierResults = await komercePostFetch<any>('/calculate/district/domestic-cost', payload);
            console.log("Komerce API response for", courier, ":", JSON.stringify(courierResults, null, 2));

            // Prefer REG service
            const regService = courierResults.find(
                (service: any) => service.service === "REG" && typeof service.cost === "number" && service.cost > 0
            );
            if (regService) {
                regPrice = regService.cost;
            }

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

        // Prefer REG, fallback to cheapest, fallback to 15000
        let estimatedPrice = regPrice ?? cheapestPrice ?? 15000;

        return NextResponse.json({ estimatedPrice });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}