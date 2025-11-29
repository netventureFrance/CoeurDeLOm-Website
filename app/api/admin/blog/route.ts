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

// GET - List all blog posts
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base = getAirtableBase();
    const records = await base('Blog Posts')
      .select({
        sort: [{ field: 'Published_Date', direction: 'desc' }],
      })
      .all();

    const posts = records.map((record) => {
      // Handle Multi-Select fields (return first value as string for editor)
      const categoryField = record.fields.Category;
      const category = Array.isArray(categoryField) ? categoryField[0] : categoryField;

      const tagsField = record.fields.Tags;
      const tags = Array.isArray(tagsField) ? tagsField[0] : tagsField;

      return {
        id: record.id,
        slug: record.fields.Slug,
        titleFR: record.fields.Title_FR,
        titleDE: record.fields.Title_DE,
        titleEN: record.fields.Title_EN,
        contentFR: record.fields.Content_FR,
        contentDE: record.fields.Content_DE,
        contentEN: record.fields.Content_EN,
        category: category || '',
        tags: tags || '',
        author: record.fields.Author || '',
        publishedDate: record.fields.Published_Date,
        status: record.fields.Status || 'Draft',
        image: record.fields.Image ? (record.fields.Image as any)[0]?.url : null,
        imageUrl: record.fields.Image_URL || null, // Permanent ImgBB URL
        audioFile: record.fields.Audio_File ? (record.fields.Audio_File as any)[0]?.url : null,
        audioUrl: record.fields.Audio_URL || null, // Permanent audio URL
        spotifyUrl: record.fields.Spotify_URL,
      };
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Received data.status:', JSON.stringify(data.status));
    const base = getAirtableBase();

    // Generate slug from French title if not provided
    let slug = data.slug;
    if (!slug && data.titleFR) {
      slug = data.titleFR
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Trim hyphens
    }

    // Clean status value - remove any extra quotes
    let status = data.status || 'Draft';
    if (typeof status === 'string') {
      // Remove all leading/trailing quotes and whitespace repeatedly
      while (/^["'\s]|["'\s]$/.test(status)) {
        status = status.replace(/^["'\s]+|["'\s]+$/g, '');
      }
    }
    console.log('Cleaned status:', JSON.stringify(status));

    const fields: any = {
      Slug: slug,
      Title_FR: data.titleFR || '',
      Title_DE: data.titleDE || '',
      Title_EN: data.titleEN || '',
      Content_FR: data.contentFR || '',
      Content_DE: data.contentDE || '',
      Content_EN: data.contentEN || '',
      Published_Date: data.publishedDate || new Date().toISOString().split('T')[0],
      Status: status,
    };

    // Category is Multiple Select - send as array
    if (data.category) {
      fields.Category = Array.isArray(data.category) ? data.category : [data.category];
    }

    // Tags is Multiple Select - send as array
    if (data.tags) {
      fields.Tags = Array.isArray(data.tags) ? data.tags : [data.tags];
    }

    // Author is Single Select - only set if provided
    if (data.author) {
      fields.Author = data.author;
    }

    // Add image if provided (as URL for Airtable to download)
    // Also save to Image_URL text field for permanent ImgBB URL storage
    if (data.imageUrl) {
      fields.Image = [{ url: data.imageUrl }];
      fields.Image_URL = data.imageUrl; // Permanent URL in text field
    }

    // Add audio file if provided
    // Also save to Audio_URL text field for permanent URL storage
    if (data.audioUrl) {
      fields.Audio_File = [{ url: data.audioUrl }];
      fields.Audio_URL = data.audioUrl; // Permanent URL in text field
    }

    // Add Spotify URL if provided
    if (data.spotifyUrl) {
      fields.Spotify_URL = data.spotifyUrl;
    }

    const record = await base('Blog Posts').create([{ fields }]);

    return NextResponse.json({
      success: true,
      id: record[0].id,
      slug: slug,
    });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      {
        error: 'Failed to create blog post',
        details: error?.message || error?.toString(),
        airtableError: error?.error || null
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing blog post
export async function PUT(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const base = getAirtableBase();

    const fields: any = {};

    // Only update fields that are provided
    if (updateData.slug !== undefined) fields.Slug = updateData.slug;
    if (updateData.titleFR !== undefined) fields.Title_FR = updateData.titleFR;
    if (updateData.titleDE !== undefined) fields.Title_DE = updateData.titleDE;
    if (updateData.titleEN !== undefined) fields.Title_EN = updateData.titleEN;
    if (updateData.contentFR !== undefined) fields.Content_FR = updateData.contentFR;
    if (updateData.contentDE !== undefined) fields.Content_DE = updateData.contentDE;
    if (updateData.contentEN !== undefined) fields.Content_EN = updateData.contentEN;
    if (updateData.publishedDate !== undefined) fields.Published_Date = updateData.publishedDate;
    if (updateData.status !== undefined) {
      let status = updateData.status;
      // Clean status value - remove any extra quotes
      if (typeof status === 'string') {
        while (/^["'\s]|["'\s]$/.test(status)) {
          status = status.replace(/^["'\s]+|["'\s]+$/g, '');
        }
      }
      fields.Status = status;
    }
    if (updateData.spotifyUrl !== undefined) fields.Spotify_URL = updateData.spotifyUrl;

    // Category is Multiple Select - send as array
    if (updateData.category !== undefined) {
      if (updateData.category) {
        fields.Category = Array.isArray(updateData.category) ? updateData.category : [updateData.category];
      } else {
        fields.Category = [];
      }
    }

    // Tags is Multiple Select - send as array
    if (updateData.tags !== undefined) {
      if (updateData.tags) {
        fields.Tags = Array.isArray(updateData.tags) ? updateData.tags : [updateData.tags];
      } else {
        fields.Tags = [];
      }
    }

    // Author is Single Select - only update if provided and not empty
    if (updateData.author !== undefined && updateData.author) {
      fields.Author = updateData.author;
    }

    // Handle image update
    // Also update Image_URL text field for permanent ImgBB URL storage
    if (updateData.imageUrl !== undefined) {
      fields.Image = updateData.imageUrl ? [{ url: updateData.imageUrl }] : [];
      fields.Image_URL = updateData.imageUrl || ''; // Permanent URL in text field
    }

    // Handle audio update
    // Also update Audio_URL text field for permanent URL storage
    if (updateData.audioUrl !== undefined) {
      fields.Audio_File = updateData.audioUrl ? [{ url: updateData.audioUrl }] : [];
      fields.Audio_URL = updateData.audioUrl || ''; // Permanent URL in text field
    }

    console.log('Updating blog post with fields:', JSON.stringify(fields, null, 2));
    await base('Blog Posts').update(id, fields);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    console.error('Error details:', error?.message || error?.error || 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to update blog post', details: error?.message || error?.error },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const base = getAirtableBase();
    await base('Blog Posts').destroy(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
