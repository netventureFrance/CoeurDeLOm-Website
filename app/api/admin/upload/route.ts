import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Check authentication via JWT token
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return false;

  try {
    const [header, payload, signature] = token.split('.');
    const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
    if (!secret) return false;

    // Verify signature
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return false;

    // Check expiry
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

// Upload to Imgur (free image hosting)
async function uploadToImgur(buffer: Buffer, filename: string): Promise<string> {
  const base64 = buffer.toString('base64');

  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      'Authorization': 'Client-ID 546c25a59c58ad7', // Public client ID for anonymous uploads
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64,
      type: 'base64',
      name: filename,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Imgur upload error:', error);
    throw new Error('Failed to upload to Imgur');
  }

  const data = await response.json();
  return data.data.link;
}

// POST - Upload file
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Imgur and get public URL
    const imageUrl = await uploadToImgur(buffer, file.name);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: file.name,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error?.message },
      { status: 500 }
    );
  }
}
