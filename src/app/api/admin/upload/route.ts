import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

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

  // To handle file uploads, we need to get the FormData
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    // Generate a unique file name to avoid overwrites
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    // Upload the file to the 'product-images' bucket
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Supabase upload error: ${uploadError.message}`);
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    if (!publicUrlData) {
        throw new Error("Could not get public URL for the uploaded file.");
    }

    // Return the public URL to the frontend
    return NextResponse.json({ url: publicUrlData.publicUrl });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}