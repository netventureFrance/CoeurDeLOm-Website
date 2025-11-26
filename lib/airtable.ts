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

export interface ChromoBioTestSubmission {
  name: string;
  email: string;
  phone?: string;
  language: string;
  gdprConsent: boolean;
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
  audioFile?: string;      // MP3 file URL from Airtable attachment
  spotifyUrl?: string;     // Spotify episode/playlist URL for embedding
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
        featuredImage: record.fields.Images ? (record.fields.Images as any)[0]?.url : undefined,
        audioFile: record.fields.Audio_File ? (record.fields.Audio_File as any)[0]?.url : undefined,
        spotifyUrl: record.fields.Spotify_URL as string | undefined,
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
 * Auto-translates from French if target language content is missing
 */
export async function getBlogPostBySlug(slug: string, language: string): Promise<BlogPost | null> {
  // Import translation function dynamically to avoid circular dependencies
  const { translateBlogFields } = await import('./translate');

  try {
    const records = await base('Blog Posts')
      .select({
        filterByFormula: `AND({Slug} = '${slug}', {Status} = 'Published')`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    const langUpper = language.toUpperCase();
    const titleField = `Title_${langUpper}` as keyof typeof record.fields;
    const excerptField = `Excerpt_${langUpper}` as keyof typeof record.fields;
    const contentField = `Content_${langUpper}` as keyof typeof record.fields;

    // Get French content (source for translations)
    const titleFR = record.fields.Title_FR as string || '';
    const excerptFR = record.fields.Excerpt_FR as string || '';
    const contentFR = record.fields.Content_FR as string || '';

    // Get target language content
    let title = record.fields[titleField] as string || '';
    let excerpt = record.fields[excerptField] as string || '';
    let content = record.fields[contentField] as string || '';

    // Auto-translate if target language content is missing (and language is DE or EN)
    if ((language === 'de' || language === 'en') && (!title || !content) && titleFR && contentFR) {
      console.log(`🔄 Auto-translating blog post "${slug}" to ${language}...`);

      const translations = await translateBlogFields(titleFR, excerptFR, contentFR, language);

      // Update local variables with translations
      title = translations.title;
      excerpt = translations.excerpt;
      content = translations.content;

      // Save translations to Airtable (fire and forget - don't wait)
      updateBlogPostTranslations(record.id, language, translations).catch(err => {
        console.error('Failed to save translations to Airtable:', err);
      });
    }

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
      title: title || titleFR,
      excerpt: excerpt || excerptFR,
      content: content || contentFR,
      category: record.fields.Category as string | undefined,
      tags,
      featuredImage: record.fields.Images ? (record.fields.Images as any)[0]?.url : undefined,
      audioFile: record.fields.Audio_File ? (record.fields.Audio_File as any)[0]?.url : undefined,
      spotifyUrl: record.fields.Spotify_URL as string | undefined,
      author: record.fields.Author as string,
      publishedDate: record.fields.Published_Date as string,
      status: record.fields.Status as string,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Check if user can take ChromoBio test (not taken in last 4 weeks)
 * Returns { canTake: boolean, lastTestDate?: string, daysRemaining?: number }
 */
export async function checkChromoBioTestEligibility(
  name: string,
  email: string
): Promise<{ canTake: boolean; lastTestDate?: string; daysRemaining?: number }> {
  try {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const fourWeeksAgoStr = fourWeeksAgo.toISOString();

    // Search for records with matching name AND email in the last 4 weeks
    const records = await base('ChromoBio_Tests')
      .select({
        filterByFormula: `AND(
          LOWER({Name}) = LOWER('${name.replace(/'/g, "\\'")}'),
          LOWER({Email}) = LOWER('${email.replace(/'/g, "\\'")}'),
          {Submitted_At} >= '${fourWeeksAgoStr}'
        )`,
        sort: [{ field: 'Submitted_At', direction: 'desc' }],
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      return { canTake: true };
    }

    const lastTestDate = records[0].fields.Submitted_At as string;
    const lastTest = new Date(lastTestDate);
    const nextAllowedDate = new Date(lastTest);
    nextAllowedDate.setDate(nextAllowedDate.getDate() + 28);
    const daysRemaining = Math.ceil((nextAllowedDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return {
      canTake: false,
      lastTestDate,
      daysRemaining: Math.max(0, daysRemaining),
    };
  } catch (error) {
    console.error('Error checking ChromoBio test eligibility:', error);
    // In case of error, allow the test to proceed
    return { canTake: true };
  }
}

/**
 * Submit ChromoBio test registration to Airtable
 */
export async function submitChromoBioTestRegistration(data: ChromoBioTestSubmission): Promise<boolean> {
  try {
    await base('ChromoBio_Tests').create([
      {
        fields: {
          Name: data.name,
          Email: data.email,
          Phone: data.phone || '',
          Language: data.language.toUpperCase(),
          GDPR_Consent: data.gdprConsent,
          Submitted_At: new Date().toISOString(),
        },
      },
    ]);
    return true;
  } catch (error) {
    console.error('Error submitting ChromoBio test registration:', error);
    return false;
  }
}

/**
 * Update blog post translations in Airtable
 */
export async function updateBlogPostTranslations(
  recordId: string,
  language: 'de' | 'en',
  translations: { title: string; excerpt: string; content: string }
): Promise<boolean> {
  try {
    const langUpper = language.toUpperCase();
    await base('Blog Posts').update(recordId, {
      [`Title_${langUpper}`]: translations.title,
      [`Excerpt_${langUpper}`]: translations.excerpt,
      [`Content_${langUpper}`]: translations.content,
    });
    console.log(`✅ Saved ${language} translations to Airtable for record ${recordId}`);
    return true;
  } catch (error) {
    console.error('Error updating blog post translations:', error);
    return false;
  }
}
