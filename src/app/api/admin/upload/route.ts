import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import { ratelimit } from "@/lib/rateLimit";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit by IP address
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  // To handle file uploads, we need to get the FormData
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // --- Validation ---
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WEBP are allowed." }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json({ error: "File is too large. Max size is 2MB." }, { status: 400 });
  }

  try {
    // Generate a unique file name to avoid overwrites
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    // Upload the file to the 'product-images' bucket
    await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    if (!publicUrlData) {
        throw new Error("Could not get public URL for the uploaded file.");
    }

    // Return the public URL to the frontend
    return NextResponse.json({ url: publicUrlData.publicUrl });

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to upload file';
    console.error("Upload Error:", error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}