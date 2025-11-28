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

// GET - Fetch all options from existing Blog Posts
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      console.log('Categories API: Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base = getAirtableBase();

    const categories = new Set<string>();
    const authors = new Set<string>();
    const tags = new Set<string>();
    const statuses = new Set<string>();

    // Fetch existing values from Blog Posts
    try {
      const blogRecords = await base('Blog Posts')
        .select({
          fields: ['Category', 'Author', 'Tags', 'Status'],
        })
        .all();

      console.log('Blog Posts records found:', blogRecords.length);
      blogRecords.forEach((record) => {
        // Category is Multiple Select - returns array
        const categoryField = record.fields.Category;
        if (categoryField) {
          if (Array.isArray(categoryField)) {
            categoryField.forEach((cat: string) => {
              if (cat && cat.trim()) categories.add(cat.trim());
            });
          } else if (typeof categoryField === 'string' && categoryField.trim()) {
            categories.add(categoryField.trim());
          }
        }

        // Author is Single Select - returns string
        const author = record.fields.Author as string;
        if (author && author.trim()) {
          authors.add(author.trim());
        }

        // Tags is Multiple Select - returns array
        const tagsField = record.fields.Tags;
        if (tagsField) {
          if (Array.isArray(tagsField)) {
            tagsField.forEach((tag: string) => {
              if (tag && tag.trim()) tags.add(tag.trim());
            });
          } else if (typeof tagsField === 'string') {
            tagsField.split(',').forEach((tag: string) => {
              if (tag.trim()) tags.add(tag.trim());
            });
          }
        }

        // Status is Single Select - returns string
        const status = record.fields.Status as string;
        if (status && status.trim()) {
          statuses.add(status.trim());
        }
      });
    } catch (err: any) {
      console.log('Error fetching from Blog Posts:', err?.message || err);
    }

    // Convert to sorted arrays
    const sortFr = (a: string, b: string) => a.localeCompare(b, 'fr');

    const result = {
      categories: Array.from(categories).sort(sortFr),
      authors: Array.from(authors).sort(sortFr),
      tags: Array.from(tags).sort(sortFr),
      statuses: Array.from(statuses).sort(sortFr),
    };

    console.log('Returning options:', result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching options:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch options', details: error?.message },
      { status: 500 }
    );
  }
}

// POST - Accept new options (will be saved with the blog post)
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Options are saved with the blog post, no separate storage needed
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in options POST:', error);
    return NextResponse.json(
      { error: 'Failed to process option' },
      { status: 500 }
    );
  }
}
