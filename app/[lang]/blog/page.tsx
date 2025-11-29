import Link from 'next/link';
import { type Locale, getDictionary, type Dictionary } from '@/lib/i18n';
import { getBlogPosts } from '@/lib/airtable';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';

// Force dynamic rendering to always fetch fresh data from Airtable
export const dynamic = 'force-dynamic';

// Decode HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
}

// Strip HTML tags and get first ~150 characters for preview
// Skips headings (h1-h6) and strong/bold text at the start to show actual content
function getContentPreview(content: string, maxLength: number = 200): string {
  // Remove all heading tags (h1-h6) anywhere in the content
  let cleaned = content.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, '');
  // Also remove strong/bold tags that might be used as subtitles at the start
  cleaned = cleaned.replace(/^(\s*<p>\s*<strong>[\s\S]*?<\/strong>\s*<\/p>\s*)+/gi, '');
  // Remove all remaining HTML tags
  let textOnly = cleaned.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  // Decode HTML entities
  textOnly = decodeHtmlEntities(textOnly);
  // Truncate and add ellipsis if needed
  if (textOnly.length <= maxLength) return textOnly;
  return textOnly.substring(0, maxLength).trim() + '...';
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: "Blog - Bien-être, Spiritualité & Naturopathie",
    description: "Articles et conseils sur la naturopathie, les soins énergétiques, la méditation et le bien-être holistique. Découvrez les secrets d'une vie équilibrée et harmonieuse.",
    keywords: ["blog naturopathie", "articles bien-être", "spiritualité", "conseils santé naturelle", "méditation", "développement personnel", "énergétique", "vie holistique"],
    openGraph: {
      title: "Blog - Bien-être & Naturopathie | Cœur de l'OM",
      description: "Articles et conseils sur la naturopathie, les soins énergétiques, la méditation et le bien-être holistique.",
      images: ['/Coeur-de-lOm-Alpha-Kopie.png'],
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const blog = dict.blog as Dictionary;
  const posts = await getBlogPosts(lang);

  return (
    <main className="relative min-h-screen pt-40 pb-20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <InteractiveTitle className="text-5xl md:text-6xl font-normal text-purple-900">
              {blog.title as string}
            </InteractiveTitle>
          </div>
          <div className="h-1 w-24 bg-gradient-rainbow mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
            {blog.subtitle as string}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{blog.noArticles as string}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  {post.featuredImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-sm text-gray-500 mb-3 block">
                      {new Date(post.publishedDate).toLocaleDateString(lang)}
                    </span>
                    <h2
                      className="text-2xl font-normal mb-3 text-purple-900 group-hover:text-cyan transition-colors"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{getContentPreview(post.content, 200)}</p>
                    <Link
                      href={`/${lang}/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                      {blog.readMore as string}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
