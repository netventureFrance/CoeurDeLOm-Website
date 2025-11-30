import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Airtable from 'airtable';

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

// GET - List all events
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base = getAirtableBase();
    const records = await base('News_Promos')
      .select({
        sort: [{ field: 'Start_Date', direction: 'desc' }],
      })
      .all();

    const events = records.map((record) => ({
      id: record.id,
      title: record.fields.Title || '',
      content: record.fields.Content || '',
      link: record.fields.Link || '',
      startDate: record.fields.Start_Date || '',
      endDate: record.fields.End_Date || '',
      status: record.fields.Status || 'Offline',
      language: record.fields.Language || 'FR',
      featuredImage: record.fields.Featured_Image ? (record.fields.Featured_Image as any)[0]?.url : null,
      imageUrl: record.fields.Image_URL || null,
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const base = getAirtableBase();

    // Clean status value
    let status = data.status || 'Offline';
    if (typeof status === 'string') {
      while (/^["'\s]|["'\s]$/.test(status)) {
        status = status.replace(/^["'\s]+|["'\s]+$/g, '');
      }
    }

    const fields: any = {
      Title: data.title || '',
      Content: data.content || '',
      Link: data.link || '',
      Start_Date: data.startDate || new Date().toISOString().split('T')[0],
      Status: status,
      Language: data.language || 'FR',
    };

    // End date is optional
    if (data.endDate) {
      fields.End_Date = data.endDate;
    }

    // Add image if provided
    if (data.imageUrl) {
      fields.Featured_Image = [{ url: data.imageUrl }];
      fields.Image_URL = data.imageUrl;
    }

    const record = await base('News_Promos').create([{ fields }]);

    return NextResponse.json({
      success: true,
      id: record[0].id,
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      {
        error: 'Failed to create event',
        details: error?.message || error?.toString(),
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing event
export async function PUT(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const base = getAirtableBase();

    const fields: any = {};

    if (updateData.title !== undefined) fields.Title = updateData.title;
    if (updateData.content !== undefined) fields.Content = updateData.content;
    if (updateData.link !== undefined) fields.Link = updateData.link;
    if (updateData.startDate !== undefined) fields.Start_Date = updateData.startDate;
    if (updateData.endDate !== undefined) fields.End_Date = updateData.endDate || null;
    if (updateData.language !== undefined) fields.Language = updateData.language;

    if (updateData.status !== undefined) {
      let status = updateData.status;
      if (typeof status === 'string') {
        while (/^["'\s]|["'\s]$/.test(status)) {
          status = status.replace(/^["'\s]+|["'\s]+$/g, '');
        }
      }
      fields.Status = status;
    }

    // Handle image update
    if (updateData.imageUrl !== undefined) {
      fields.Featured_Image = updateData.imageUrl ? [{ url: updateData.imageUrl }] : [];
      fields.Image_URL = updateData.imageUrl || '';
    }

    await base('News_Promos').update(id, fields);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: error?.message || error?.error },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const base = getAirtableBase();
    await base('News_Promos').destroy(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
