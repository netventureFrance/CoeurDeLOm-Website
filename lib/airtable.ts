import Airtable from 'airtable';
import fs from 'fs';
import path from 'path';

if (!process.env.AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is not set');
}

if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_BASE_ID is not set');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

/**
 * Escape string for use in Airtable formula (prevents formula injection)
 */
function escapeFormulaString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// --- Local Data Cache (generated during Netlify build) ---
interface LocalBlogPost {
  id: string;
  slug: string;
  titleFR: string;
  titleDE: string;
  titleEN: string;
  contentFR: string;
  contentDE: string;
  contentEN: string;
  author: string;
  publishedDate: string;
  status: string;
  featuredImage: string | null;
  audioFile: string | null;
  spotifyUrl: string | null;
}

let localBlogPosts: LocalBlogPost[] | null = null;
let blogImageManifest: Record<string, string> = {};

// Try to load local blog data (generated during build)
try {
  const blogDataPath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
  if (fs.existsSync(blogDataPath)) {
    localBlogPosts = JSON.parse(fs.readFileSync(blogDataPath, 'utf-8'));
    console.log(`📚 Loaded ${localBlogPosts?.length || 0} blog posts from local cache`);
  }
} catch (err) {
  // Local data not available - will use Airtable API
}

// Load image manifest as fallback
try {
  const manifestPath = path.join(process.cwd(), 'public', 'images', 'blog', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    blogImageManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  }
} catch (err) {
  // Manifest not available
}

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
 * Convert local blog post format to API format for a specific language
 */
function localPostToApiFormat(post: LocalBlogPost, language: string): BlogPost {
  const langUpper = language.toUpperCase() as 'FR' | 'DE' | 'EN';
  const titleKey = `title${langUpper}` as keyof LocalBlogPost;
  const contentKey = `content${langUpper}` as keyof LocalBlogPost;

  return {
    id: post.id,
    slug: post.slug,
    title: (post[titleKey] as string) || post.titleFR,
    content: (post[contentKey] as string) || post.contentFR,
    featuredImage: post.featuredImage || undefined,
    audioFile: post.audioFile || undefined,
    spotifyUrl: post.spotifyUrl || undefined,
    author: post.author,
    publishedDate: post.publishedDate,
    status: post.status,
  };
}

/**
 * Fetch published blog posts for a specific language
 * Uses local cache when available (production), falls back to Airtable API (dev)
 */
export async function getBlogPosts(language: string, limit?: number): Promise<BlogPost[]> {
  // Use local cache if available (generated during Netlify build)
  if (localBlogPosts && localBlogPosts.length > 0) {
    let posts = localBlogPosts.map(post => localPostToApiFormat(post, language));
    if (limit) {
      posts = posts.slice(0, limit);
    }
    return posts;
  }

  // Fallback to Airtable API (dev mode or first build)
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
      const contentField = `Content_${language.toUpperCase()}` as keyof typeof record.fields;

      // Get image - prefer local path from manifest, fallback to remote URL
      const slug = record.fields.Slug as string;
      let featuredImage: string | undefined;

      if (blogImageManifest[slug]) {
        featuredImage = blogImageManifest[slug];
      } else {
        const imageUrl = record.fields.Image_URL as string | undefined;
        if (imageUrl && imageUrl.trim()) {
          featuredImage = imageUrl.trim();
        } else {
          const imageField = record.fields.Image as any[] | undefined;
          if (imageField && imageField.length > 0) {
            featuredImage = imageField[0].url;
          }
        }
      }

      // Get audio - prefer Audio_URL, fallback to attachment
      let audioFile: string | undefined;
      const audioUrl = record.fields.Audio_URL as string | undefined;
      if (audioUrl && audioUrl.trim()) {
        audioFile = audioUrl.trim();
      } else if (record.fields.Audio_File) {
        audioFile = (record.fields.Audio_File as any)[0]?.url;
      }

      // Auto-fill Published_Date if missing
      let publishedDate = record.fields.Published_Date as string;
      if (!publishedDate) {
        publishedDate = new Date().toISOString().split('T')[0];
        base('Blog Posts').update(record.id, {
          Published_Date: publishedDate,
        }).catch(err => console.error('Failed to update Published_Date:', err));
      }

      return {
        id: record.id,
        slug: record.fields.Slug as string,
        title: (record.fields[titleField] as string) || (record.fields.Title_FR as string),
        content: (record.fields[contentField] as string) || (record.fields.Content_FR as string),
        featuredImage,
        audioFile,
        spotifyUrl: record.fields.Spotify_URL as string | undefined,
        author: record.fields.Author as string,
        publishedDate,
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
 * Uses local cache when available, with auto-translation for missing content
 */
export async function getBlogPostBySlug(slug: string, language: string): Promise<BlogPost | null> {
  // Import translation function dynamically to avoid circular dependencies
  const { translateBlogFields } = await import('./translate');

  // Check local cache first
  if (localBlogPosts && localBlogPosts.length > 0) {
    const localPost = localBlogPosts.find(p => p.slug === slug);
    if (localPost) {
      const langUpper = language.toUpperCase() as 'FR' | 'DE' | 'EN';
      const titleKey = `title${langUpper}` as keyof LocalBlogPost;
      const contentKey = `content${langUpper}` as keyof LocalBlogPost;

      let title = localPost[titleKey] as string || '';
      let content = localPost[contentKey] as string || '';

      // Auto-translate if target language content is missing
      if ((language === 'de' || language === 'en') && (!title || !content) && localPost.titleFR && localPost.contentFR) {
        console.log(`🔄 Auto-translating blog post "${slug}" to ${language}...`);
        const translations = await translateBlogFields(localPost.titleFR, localPost.contentFR, language);
        title = translations.title;
        content = translations.content;

        // Save translations to Airtable (fire and forget)
        updateBlogPostTranslations(localPost.id, language as 'de' | 'en', translations).catch(err => {
          console.error('Failed to save translations to Airtable:', err);
        });
      }

      return {
        id: localPost.id,
        slug: localPost.slug,
        title: title || localPost.titleFR,
        content: content || localPost.contentFR,
        featuredImage: localPost.featuredImage || undefined,
        audioFile: localPost.audioFile || undefined,
        spotifyUrl: localPost.spotifyUrl || undefined,
        author: localPost.author,
        publishedDate: localPost.publishedDate,
        status: localPost.status,
      };
    }
    return null; // Post not found in local cache
  }

  // Fallback to Airtable API (dev mode)
  try {
    const records = await base('Blog Posts')
      .select({
        filterByFormula: `AND({Slug} = '${escapeFormulaString(slug)}', {Status} = 'Published')`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    const langUpper = language.toUpperCase();
    const titleField = `Title_${langUpper}` as keyof typeof record.fields;
    const contentField = `Content_${langUpper}` as keyof typeof record.fields;

    const titleFR = record.fields.Title_FR as string || '';
    const contentFR = record.fields.Content_FR as string || '';
    let title = record.fields[titleField] as string || '';
    let content = record.fields[contentField] as string || '';

    // Auto-translate if missing
    if ((language === 'de' || language === 'en') && (!title || !content) && titleFR && contentFR) {
      console.log(`🔄 Auto-translating blog post "${slug}" to ${language}...`);
      const translations = await translateBlogFields(titleFR, contentFR, language);
      title = translations.title;
      content = translations.content;
      updateBlogPostTranslations(record.id, language as 'de' | 'en', translations).catch(err => {
        console.error('Failed to save translations to Airtable:', err);
      });
    }

    // Get image
    const postSlug = record.fields.Slug as string;
    let featuredImage: string | undefined;
    if (blogImageManifest[postSlug]) {
      featuredImage = blogImageManifest[postSlug];
    } else {
      const imageUrl = record.fields.Image_URL as string | undefined;
      if (imageUrl && imageUrl.trim()) {
        featuredImage = imageUrl.trim();
      } else {
        const imageField = record.fields.Image as any[] | undefined;
        if (imageField && imageField.length > 0) {
          featuredImage = imageField[0].url;
        }
      }
    }

    // Get audio
    let audioFile: string | undefined;
    const audioUrl = record.fields.Audio_URL as string | undefined;
    if (audioUrl && audioUrl.trim()) {
      audioFile = audioUrl.trim();
    } else if (record.fields.Audio_File) {
      audioFile = (record.fields.Audio_File as any)[0]?.url;
    }

    return {
      id: record.id,
      slug: postSlug,
      title: title || titleFR,
      content: content || contentFR,
      featuredImage,
      audioFile,
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
          LOWER({Name}) = LOWER('${escapeFormulaString(name)}'),
          LOWER({Email}) = LOWER('${escapeFormulaString(email)}'),
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
  translations: { title: string; content: string }
): Promise<boolean> {
  try {
    const langUpper = language.toUpperCase();
    await base('Blog Posts').update(recordId, {
      [`Title_${langUpper}`]: translations.title,
      [`Content_${langUpper}`]: translations.content,
    });
    console.log(`✅ Saved ${language} translations to Airtable for record ${recordId}`);
    return true;
  } catch (error) {
    console.error('Error updating blog post translations:', error);
    return false;
  }
}
