import Airtable from 'airtable';

if (!process.env.AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is not set');
}

if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_BASE_ID is not set');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  message: string;
  language: string;
  gdprConsent: boolean;
  newsletterConsent: boolean;
}

export interface NewsPromo {
  id: string;
  title: string;
  content: string;
  link?: string;
  startDate: string;
  endDate?: string;
  status: string;
  language: string;
  featuredImage?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  author: string;
  publishedDate: string;
  status: string;
}

/**
 * Submit contact form to Airtable
 */
export async function submitContactForm(data: ContactSubmission): Promise<boolean> {
  try {
    await base('Contact Submissions').create([
      {
        fields: {
          Name: data.name,
          Email: data.email,
          Phone: data.phone || '',
          Message: data.message,
          Language: data.language.toUpperCase(),
          GDPR_Consent: data.gdprConsent,
          Newsletter_Consent: data.newsletterConsent,
          Submitted_At: new Date().toISOString(),
          Status: 'New',
        },
      },
    ]);
    return true;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return false;
  }
}

/**
 * Fetch active news/promos for a specific language
 */
export async function getNewsPromos(language: string): Promise<NewsPromo[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const records = await base('News_Promos')
      .select({
        filterByFormula: `AND(
          {Status} = 'Active',
          {Language} = '${language.toUpperCase()}',
          {Start_Date} <= '${today}',
          OR({End_Date} = BLANK(), {End_Date} >= '${today}')
        )`,
        sort: [{ field: 'Start_Date', direction: 'desc' }],
      })
      .all();

    return records.map((record) => ({
      id: record.id,
      title: record.fields.Title as string,
      content: record.fields.Content as string,
      link: record.fields.Link as string | undefined,
      startDate: record.fields.Start_Date as string,
      endDate: record.fields.End_Date as string | undefined,
      status: record.fields.Status as string,
      language: record.fields.Language as string,
      featuredImage: record.fields.Featured_Image ? (record.fields.Featured_Image as any)[0]?.url : undefined,
    }));
  } catch (error) {
    console.error('Error fetching news/promos:', error);
    return [];
  }
}

/**
 * Fetch published blog posts for a specific language
 */
export async function getBlogPosts(language: string, limit?: number): Promise<BlogPost[]> {
  try {
    const selectOptions: any = {
      filterByFormula: `AND({Status} = 'Published')`,
      sort: [{ field: 'Published_Date', direction: 'desc' }],
    };

    if (limit) {
      selectOptions.maxRecords = limit;
    }

    const records = await base('Blog Posts')
      .select(selectOptions)
      .all();

    return records.map((record) => {
      const titleField = `Title_${language.toUpperCase()}` as keyof typeof record.fields;
      const excerptField = `Excerpt_${language.toUpperCase()}` as keyof typeof record.fields;
      const contentField = `Content_${language.toUpperCase()}` as keyof typeof record.fields;

      // Parse tags - handle both string (comma-separated) and array
      let tags: string[] | undefined;
      if (record.fields.Tags) {
        if (typeof record.fields.Tags === 'string') {
          tags = record.fields.Tags.split(',').map((tag: string) => tag.trim());
        } else if (Array.isArray(record.fields.Tags)) {
          tags = record.fields.Tags;
        }
      }

      return {
        id: record.id,
        slug: record.fields.Slug as string,
        title: (record.fields[titleField] as string) || (record.fields.Title_FR as string),
        excerpt: (record.fields[excerptField] as string) || (record.fields.Excerpt_FR as string),
        content: (record.fields[contentField] as string) || (record.fields.Content_FR as string),
        category: record.fields.Category as string | undefined,
        tags,
        featuredImage: record.fields.Featured_Image ? (record.fields.Featured_Image as any)[0]?.url : undefined,
        author: record.fields.Author as string,
        publishedDate: record.fields.Published_Date as string,
        status: record.fields.Status as string,
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string, language: string): Promise<BlogPost | null> {
  try {
    const records = await base('Blog Posts')
      .select({
        filterByFormula: `AND({Slug} = '${slug}', {Status} = 'Published')`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    const titleField = `Title_${language.toUpperCase()}` as keyof typeof record.fields;
    const excerptField = `Excerpt_${language.toUpperCase()}` as keyof typeof record.fields;
    const contentField = `Content_${language.toUpperCase()}` as keyof typeof record.fields;

    // Parse tags - handle both string (comma-separated) and array
    let tags: string[] | undefined;
    if (record.fields.Tags) {
      if (typeof record.fields.Tags === 'string') {
        tags = record.fields.Tags.split(',').map((tag: string) => tag.trim());
      } else if (Array.isArray(record.fields.Tags)) {
        tags = record.fields.Tags;
      }
    }

    return {
      id: record.id,
      slug: record.fields.Slug as string,
      title: (record.fields[titleField] as string) || (record.fields.Title_FR as string),
      excerpt: (record.fields[excerptField] as string) || (record.fields.Excerpt_FR as string),
      content: (record.fields[contentField] as string) || (record.fields.Content_FR as string),
      category: record.fields.Category as string | undefined,
      tags,
      featuredImage: record.fields.Featured_Image ? (record.fields.Featured_Image as any)[0]?.url : undefined,
      author: record.fields.Author as string,
      publishedDate: record.fields.Published_Date as string,
      status: record.fields.Status as string,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
