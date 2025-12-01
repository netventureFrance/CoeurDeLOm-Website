import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Airtable from 'airtable';

// Airtable table ID for Carousel_Images
const CAROUSEL_TABLE = 'tblLtxTVqDjiUfQIc';

// Initialize Airtable
function getAirtableBase() {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    throw new Error('Airtable credentials not configured');
  }
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
}

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

// GET - List all carousel images
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base = getAirtableBase();
    const records = await base(CAROUSEL_TABLE)
      .select({
        sort: [{ field: 'Order', direction: 'asc' }],
      })
      .all();

    const images = records.map((record) => {
      // Get image URL - prefer Image_URL, fallback to attachment
      let imageUrl = record.fields.Image_URL || '';
      if (!imageUrl && record.fields.Image && Array.isArray(record.fields.Image)) {
        const attachment = record.fields.Image[0] as any;
        imageUrl = attachment?.url || '';
      }

      return {
        id: record.id,
        imageUrl: imageUrl,
        order: record.fields.Order || 0,
        altText: record.fields.Alt_Text || '',
        status: record.fields.Status || 'Inactive',
      };
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carousel images' },
      { status: 500 }
    );
  }
}

// POST - Create new carousel image
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const base = getAirtableBase();

    // Clean status value
    let status = data.status || 'Inactive';
    if (typeof status === 'string') {
      status = status.replace(/^["'\s]+|["'\s]+$/g, '');
    }

    const fields: any = {
      Order: data.order || 0,
      Alt_Text: data.altText || '',
      Status: status,
    };

    // Handle image URL
    if (data.imageUrl && data.imageUrl.trim() !== '') {
      fields.Image_URL = data.imageUrl;
    }

    const record = await base(CAROUSEL_TABLE).create([{ fields }]);

    return NextResponse.json({
      success: true,
      id: record[0].id,
    });
  } catch (error: any) {
    console.error('Error creating carousel image:', error);
    return NextResponse.json(
      {
        error: 'Failed to create carousel image',
        details: error?.message || error?.toString(),
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing carousel image
export async function PUT(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    const base = getAirtableBase();

    const fields: any = {};

    if (updateData.imageUrl !== undefined) {
      if (updateData.imageUrl.trim() !== '') {
        fields.Image_URL = updateData.imageUrl;
      } else {
        fields.Image_URL = null;
      }
    }
    if (updateData.order !== undefined) fields.Order = updateData.order;
    if (updateData.altText !== undefined) fields.Alt_Text = updateData.altText;

    if (updateData.status !== undefined) {
      let status = updateData.status;
      if (typeof status === 'string') {
        status = status.replace(/^["'\s]+|["'\s]+$/g, '');
      }
      fields.Status = status;
    }

    await base(CAROUSEL_TABLE).update(id, fields);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating carousel image:', error);
    return NextResponse.json(
      { error: 'Failed to update carousel image', details: error?.message || error?.error },
      { status: 500 }
    );
  }
}

// DELETE - Delete carousel image
export async function DELETE(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    const base = getAirtableBase();
    await base(CAROUSEL_TABLE).destroy(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting carousel image:', error);
    return NextResponse.json(
      { error: 'Failed to delete carousel image' },
      { status: 500 }
    );
  }
}
