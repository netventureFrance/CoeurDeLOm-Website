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

export async function POST(request: NextRequest) {
  try {
    // Check auth
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get ImgBB API key
    const imgbbKey = process.env.IMGBB_API_KEY;
    if (!imgbbKey) {
      return NextResponse.json(
        { error: 'IMGBB_API_KEY not configured in environment variables' },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier invalide. Seuls JPEG, PNG, GIF et WebP sont acceptés.' },
        { status: 400 }
      );
    }

    // Validate file size (max 32MB for ImgBB)
    const maxSize = 32 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximale: 32MB.' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Upload to ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('key', imgbbKey);
    imgbbFormData.append('image', base64);

    // Optional: set a name for the image
    const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    imgbbFormData.append('name', fileName);

    console.log('Uploading to ImgBB...');

    const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbFormData,
    });

    const imgbbData = await imgbbResponse.json();

    console.log('ImgBB response status:', imgbbResponse.status);
    console.log('ImgBB response:', JSON.stringify(imgbbData, null, 2));

    if (!imgbbResponse.ok || !imgbbData.success) {
      console.error('ImgBB error:', imgbbData);
      return NextResponse.json(
        {
          error: 'Erreur lors du téléchargement vers ImgBB',
          details: imgbbData.error?.message || imgbbData.error || 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Return the image URL
    return NextResponse.json({
      success: true,
      url: imgbbData.data.url,
      displayUrl: imgbbData.data.display_url,
      thumbnail: imgbbData.data.thumb?.url,
      deleteUrl: imgbbData.data.delete_url,
      size: imgbbData.data.size,
      width: imgbbData.data.width,
      height: imgbbData.data.height,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement', details: error?.message },
      { status: 500 }
    );
  }
}
