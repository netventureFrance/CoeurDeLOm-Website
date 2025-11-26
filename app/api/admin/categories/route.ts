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

const BLOG_OPTIONS_TABLE = 'tblGWAGY3hYMRBC4y';

// GET - Fetch all options from Blog_Options table + existing values from Blog Posts
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      console.log('Categories API: Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base = getAirtableBase();

    // Fetch from Blog_Options table
    const categories = new Set<string>();
    const authors = new Set<string>();
    const tags = new Set<string>();

    try {
      const optionsRecords = await base(BLOG_OPTIONS_TABLE)
        .select({
          fields: ['Type', 'Value'],
        })
        .all();

      console.log('Blog_Options records found:', optionsRecords.length);
      optionsRecords.forEach((record) => {
        const type = record.fields.Type as string;
        const value = record.fields.Value as string;
        console.log('Option:', type, value);
        if (value && value.trim()) {
          if (type === 'Category') categories.add(value.trim());
          else if (type === 'Author') authors.add(value.trim());
          else if (type === 'Tag') tags.add(value.trim());
        }
      });
    } catch (err: any) {
      console.log('Blog_Options table error:', err?.message || err);
    }

    // Also fetch existing values from Blog Posts (for backwards compatibility)
    try {
      const blogRecords = await base('Blog Posts')
        .select({
          fields: ['Category', 'Author', 'Tags'],
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

// POST - Add a new option to Blog_Options table
export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, value } = await request.json();

    if (!type || !value) {
      return NextResponse.json(
        { error: 'Type and value are required' },
        { status: 400 }
      );
    }

    if (!['Category', 'Author', 'Tag'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be Category, Author, or Tag' },
        { status: 400 }
      );
    }

    const base = getAirtableBase();

    // Check if already exists
    const existing = await base(BLOG_OPTIONS_TABLE)
      .select({
        filterByFormula: `AND({Type} = '${type}', {Value} = '${value.replace(/'/g, "\\'")}')`,
        maxRecords: 1,
      })
      .all();

    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: 'Option already exists' });
    }

    // Create new option
    await base(BLOG_OPTIONS_TABLE).create([
      {
        fields: {
          Type: type,
          Value: value.trim(),
        },
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding option:', error);
    return NextResponse.json(
      { error: 'Failed to add option' },
      { status: 500 }
    );
  }
}
