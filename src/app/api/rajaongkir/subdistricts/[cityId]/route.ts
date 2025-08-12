import { NextResponse } from "next/server";

const KOMERCE_BASE_URL = "https://api.collaborator.komerce.id";
const KOMERCE_API_KEY = process.env.KOMERCE_API_KEY;

// Reusing the same GET helper function
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

export async function GET(request: Request, { params }: { params: { cityId: string } }) {
  const { cityId } = await params;
  try {
    const subdistricts = await komerceGetFetch(`/destination/district/${cityId}`);
    const formattedSubdistricts = subdistricts.map((sd: any) => ({
      id: sd.id,
      name: sd.name,
    }));
    return NextResponse.json(formattedSubdistricts);
  } catch (error: any) {
    console.error("Subdistricts API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}