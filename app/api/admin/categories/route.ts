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

// GET - Fetch all unique categories, authors, and tags from Blog Posts
export async function GET(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base = getAirtableBase();
    const records = await base('Blog Posts')
      .select({
        fields: ['Category', 'Author', 'Tags'],
      })
      .all();

    // Extract unique values
    const categories = new Set<string>();
    const authors = new Set<string>();
    const tags = new Set<string>();

    records.forEach((record) => {
      // Categories
      const category = record.fields.Category as string;
      if (category && category.trim()) {
        categories.add(category.trim());
      }

      // Authors
      const author = record.fields.Author as string;
      if (author && author.trim()) {
        authors.add(author.trim());
      }

      // Tags - can be comma-separated string or array
      const tagsField = record.fields.Tags;
      if (tagsField) {
        if (typeof tagsField === 'string') {
          tagsField.split(',').forEach((tag: string) => {
            if (tag.trim()) tags.add(tag.trim());
          });
        } else if (Array.isArray(tagsField)) {
          tagsField.forEach((tag: string) => {
            if (tag && tag.trim()) tags.add(tag.trim());
          });
        }
      }
    });

    // Convert to sorted arrays
    const sortFr = (a: string, b: string) => a.localeCompare(b, 'fr');

    return NextResponse.json({
      categories: Array.from(categories).sort(sortFr),
      authors: Array.from(authors).sort(sortFr),
      tags: Array.from(tags).sort(sortFr),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    );
  }
}
