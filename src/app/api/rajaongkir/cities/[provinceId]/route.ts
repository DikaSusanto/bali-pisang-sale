// app/api/rajaongkir/cities/[provinceId]/route.ts

import { NextResponse } from "next/server";

const KOMERCE_BASE_URL = "https://api.collaborator.komerce.id";
const KOMERCE_API_KEY = process.env.KOMERCE_API_KEY;

// Reusing the same GET helper function from the provinces route
async function komerceGetFetch(endpoint: string) {
  if (!KOMERCE_API_KEY) {
    throw new Error("Server configuration error: Missing API key.");
  }

  const fullUrl = `${KOMERCE_BASE_URL}/tariff/api/v1${endpoint}`;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'key': KOMERCE_API_KEY,
    },
  });

  const data = await response.json();

  if (!response.ok || data.meta?.code !== 200) {
    throw new Error(`Komerce API Error: ${data.meta?.message || 'Unknown error'}`);
  }

  return data.data;
}

export async function GET(request: Request, { params }: { params: { provinceId: string } }) {
  const { provinceId } = await params;
  try {
    const cities = await komerceGetFetch(`/destination/city/${provinceId}`);
    const formattedCities = cities.map((city: any) => ({
      id: city.id,
      name: city.name,
    }));
    return NextResponse.json(formattedCities);
  } catch (error: any) {
    console.error("Cities API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}