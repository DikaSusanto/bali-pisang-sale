// app/api/rajaongkir/provinces/route.ts

import { NextResponse } from "next/server";

const KOMERCE_BASE_URL = "https://api.collaborator.komerce.id";
const KOMERCE_API_KEY = process.env.KOMERCE_API_KEY;

// Helper function for GET requests to the Komerce API
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

export async function GET() {
  try {
    const provinces = await komerceGetFetch('/destination/province');

    // Map the data to a consistent format for the frontend
    const formattedProvinces = provinces.map((prov: any) => ({
      id: prov.id,
      name: prov.name,
    }));

    return NextResponse.json(formattedProvinces);
  } catch (error: any) {
    console.error("Provinces API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}