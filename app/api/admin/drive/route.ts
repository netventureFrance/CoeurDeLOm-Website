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

    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return false;

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

// Blog images folder ID
const FOLDER_ID = '1chCwZfbMs25dgzAcvYNj4brrWW3xEWLm';

// GET - List images from Google Drive folder
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Drive API key not configured' },
        { status: 500 }
      );
    }

    // Fetch files from the folder
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,mimeType,thumbnailLink,webContentLink,createdTime)&orderBy=createdTime+desc&pageSize=50`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      console.error('Google Drive API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch images from Google Drive', details: error.error?.message },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the response to include direct image URLs
    const images = (data.files || []).map((file: any) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      thumbnail: `https://drive.google.com/thumbnail?id=${file.id}&sz=w200`,
      url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`,
      createdTime: file.createdTime,
    }));

    return NextResponse.json({ images, folderId: FOLDER_ID });
  } catch (error: any) {
    console.error('Error fetching Drive images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images', details: error?.message },
      { status: 500 }
    );
  }
}
