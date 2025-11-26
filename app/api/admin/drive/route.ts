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

    // Fetch all files from the folder
    // The folder must be shared as "Anyone with the link" for API key access
    const query = encodeURIComponent(`'${FOLDER_ID}' in parents and trashed=false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}&fields=files(id,name,mimeType,thumbnailLink,createdTime)&orderBy=createdTime desc&pageSize=50`;

    console.log('Google Drive API URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));

    const response = await fetch(url);
    const data = await response.json();

    console.log('Google Drive API response status:', response.status);
    console.log('Google Drive API response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Google Drive API error:', data);
      return NextResponse.json(
        { error: 'Failed to fetch images from Google Drive', details: data.error?.message },
        { status: response.status }
      );
    }

    // Filter for image files and transform the response
    const imageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/bmp'];
    const images = (data.files || [])
      .filter((file: any) => imageTypes.includes(file.mimeType) || file.mimeType?.startsWith('image/'))
      .map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        thumbnail: `https://drive.google.com/thumbnail?id=${file.id}&sz=w200`,
        url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1200`,
        createdTime: file.createdTime,
      }));

    console.log('Returning images:', images.length);

    return NextResponse.json({ images, folderId: FOLDER_ID });
  } catch (error: any) {
    console.error('Error fetching Drive images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images', details: error?.message },
      { status: 500 }
    );
  }
}
