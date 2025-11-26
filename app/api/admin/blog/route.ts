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

// Check authentication
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  return !!token;
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

    const posts = records.map((record) => ({
      id: record.id,
      slug: record.fields.Slug,
      titleFR: record.fields.Title_FR,
      titleDE: record.fields.Title_DE,
      titleEN: record.fields.Title_EN,
      excerptFR: record.fields.Excerpt_FR,
      excerptDE: record.fields.Excerpt_DE,
      excerptEN: record.fields.Excerpt_EN,
      contentFR: record.fields.Content_FR,
      contentDE: record.fields.Content_DE,
      contentEN: record.fields.Content_EN,
      category: record.fields.Category,
      tags: record.fields.Tags,
      author: record.fields.Author,
      publishedDate: record.fields.Published_Date,
      status: record.fields.Status,
      image: record.fields.Image ? (record.fields.Image as any)[0]?.url : null,
      audioFile: record.fields.Audio_File ? (record.fields.Audio_File as any)[0]?.url : null,
      spotifyUrl: record.fields.Spotify_URL,
    }));

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

    const fields: any = {
      Slug: slug,
      Title_FR: data.titleFR || '',
      Title_DE: data.titleDE || '',
      Title_EN: data.titleEN || '',
      Excerpt_FR: data.excerptFR || '',
      Excerpt_DE: data.excerptDE || '',
      Excerpt_EN: data.excerptEN || '',
      Content_FR: data.contentFR || '',
      Content_DE: data.contentDE || '',
      Content_EN: data.contentEN || '',
      Category: data.category || '',
      Tags: data.tags || '',
      Author: data.author || 'Valerie Heymann',
      Published_Date: data.publishedDate || new Date().toISOString().split('T')[0],
      Status: data.status || 'Draft',
    };

    // Add image if provided (as URL for Airtable to download)
    if (data.imageUrl) {
      fields.Image = [{ url: data.imageUrl }];
    }

    // Add audio file if provided
    if (data.audioUrl) {
      fields.Audio_File = [{ url: data.audioUrl }];
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
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
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
    if (updateData.excerptFR !== undefined) fields.Excerpt_FR = updateData.excerptFR;
    if (updateData.excerptDE !== undefined) fields.Excerpt_DE = updateData.excerptDE;
    if (updateData.excerptEN !== undefined) fields.Excerpt_EN = updateData.excerptEN;
    if (updateData.contentFR !== undefined) fields.Content_FR = updateData.contentFR;
    if (updateData.contentDE !== undefined) fields.Content_DE = updateData.contentDE;
    if (updateData.contentEN !== undefined) fields.Content_EN = updateData.contentEN;
    if (updateData.category !== undefined) fields.Category = updateData.category;
    if (updateData.tags !== undefined) fields.Tags = updateData.tags;
    if (updateData.author !== undefined) fields.Author = updateData.author;
    if (updateData.publishedDate !== undefined) fields.Published_Date = updateData.publishedDate;
    if (updateData.status !== undefined) fields.Status = updateData.status;
    if (updateData.spotifyUrl !== undefined) fields.Spotify_URL = updateData.spotifyUrl;

    // Handle image update
    if (updateData.imageUrl !== undefined) {
      fields.Image = updateData.imageUrl ? [{ url: updateData.imageUrl }] : [];
    }

    // Handle audio update
    if (updateData.audioUrl !== undefined) {
      fields.Audio_File = updateData.audioUrl ? [{ url: updateData.audioUrl }] : [];
    }

    await base('Blog Posts').update(id, fields);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
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
