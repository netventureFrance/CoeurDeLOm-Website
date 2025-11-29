import { notFound } from 'next/navigation';
import Link from 'next/link';
import { type Locale, getDictionary } from '@/lib/i18n';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/airtable';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';

// Force dynamic rendering to always fetch fresh data from Airtable
export const dynamic = 'force-dynamic';

// Strip HTML tags and get first ~160 characters for preview/description
// Skips headings (h1-h6) and strong/bold text at the start to show actual content
function getContentPreview(content: string, maxLength: number = 160): string {
  // Remove all heading tags (h1-h6) anywhere in the content
  let cleaned = content.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, '');
  // Also remove strong/bold tags that might be used as subtitles at the start
  cleaned = cleaned.replace(/^(\s*<p>\s*<strong>[\s\S]*?<\/strong>\s*<\/p>\s*)+/gi, '');
  // Remove all remaining HTML tags
  const textOnly = cleaned.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (textOnly.length <= maxLength) return textOnly;
  return textOnly.substring(0, maxLength).trim() + '...';
}

// Allow new blog posts to be rendered on-demand (not just at build time)
export const dynamicParams = true;

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getBlogPostBySlug(slug, lang);

  if (!post) {
    return {
      title: 'Article non trouvé',
    };
  }

  const description = getContentPreview(post.content);
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.featuredImage ? [post.featuredImage] : ['/Coeur-de-lOm-Alpha-Kopie.png'],
    },
  };
}

export async function generateStaticParams() {
  const languages = ['fr', 'de', 'en'];
  const params: { lang: string; slug: string }[] = [];

  for (const lang of languages) {
    const posts = await getBlogPosts(lang);
    for (const post of posts) {
      // Only add posts that have a valid slug
      if (post.slug && typeof post.slug === 'string') {
        params.push({
          lang,
          slug: post.slug,
        });
      }
    }
  }

  return params;
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as Locale);
  const post = await getBlogPostBySlug(slug, lang);

  if (!post) {
    notFound();
  }

  // Fetch all posts to find previous/next
  const allPosts = await getBlogPosts(lang);
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <main className="relative min-h-screen pt-40 pb-20 overflow-hidden">
      <AnimatedBackground />
      <article className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full max-w-md mx-auto aspect-square overflow-hidden rounded-full mb-8 shadow-xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Audio Player - Spotify or MP3 */}
          {(post.spotifyUrl || post.audioFile) && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-primary">
                    {lang === 'fr' ? 'Écouter le podcast' : lang === 'de' ? 'Podcast anhören' : 'Listen to podcast'}
                  </span>
                </div>

                {post.spotifyUrl ? (
                  // Spotify Embed
                  <iframe
                    src={post.spotifyUrl.replace('spotify.com/', 'spotify.com/embed/').replace('/episode/', '/episode/').replace('/show/', '/show/')}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl"
                  />
                ) : post.audioFile ? (
                  // HTML5 Audio Player for MP3
                  <audio
                    controls
                    className="w-full"
                    preload="metadata"
                  >
                    <source src={post.audioFile} type="audio/mpeg" />
                    {lang === 'fr' ? 'Votre navigateur ne supporte pas l\'audio.' :
                     lang === 'de' ? 'Ihr Browser unterstützt kein Audio.' :
                     'Your browser does not support audio.'}
                  </audio>
                ) : null}
              </div>
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString(lang, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {post.category && (
                <>
                  <span>•</span>
                  <span className="text-primary font-medium">{post.category}</span>
                </>
              )}
              {post.author && (
                <>
                  <span>•</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>

            <InteractiveTitle className="text-4xl md:text-5xl font-normal mb-4 text-purple-900">
              {post.title}
            </InteractiveTitle>
          </header>

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed
              prose-p:mb-4 prose-p:leading-relaxed
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-primary prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:font-semibold prose-h3:text-primary prose-h3:mt-6 prose-h3:mb-3
              prose-ul:my-4 prose-li:my-1
              prose-a:text-primary prose-a:underline hover:prose-a:text-purple-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          {post.author && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary">
                  {post.author}
                </h3>
              </div>
            </div>
          )}

          {/* Navigation to other posts */}
          {(prevPost || nextPost) && (
            <nav className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-stretch gap-4">
                {/* Previous Post */}
                {prevPost ? (
                  <Link
                    href={`/${lang}/blog/${prevPost.slug}`}
                    className="flex-1 group p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all"
                  >
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      {lang === 'fr' ? 'Article précédent' : lang === 'de' ? 'Vorheriger Artikel' : 'Previous post'}
                    </span>
                    <h4 className="mt-1 font-semibold text-primary group-hover:text-purple-700 transition-colors line-clamp-2">
                      {prevPost.title}
                    </h4>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}

                {/* Next Post */}
                {nextPost ? (
                  <Link
                    href={`/${lang}/blog/${nextPost.slug}`}
                    className="flex-1 group p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all text-right"
                  >
                    <span className="text-sm text-gray-500 flex items-center justify-end gap-1">
                      {lang === 'fr' ? 'Article suivant' : lang === 'de' ? 'Nächster Artikel' : 'Next post'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <h4 className="mt-1 font-semibold text-primary group-hover:text-purple-700 transition-colors line-clamp-2">
                      {nextPost.title}
                    </h4>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </div>

              {/* Back to blog list */}
              <div className="mt-6 text-center">
                <Link
                  href={`/${lang}/blog`}
                  className="inline-flex items-center gap-2 text-primary hover:text-purple-700 font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  {lang === 'fr' ? 'Tous les articles' : lang === 'de' ? 'Alle Artikel' : 'All posts'}
                </Link>
              </div>
            </nav>
          )}
        </div>
      </article>
    </main>
  );
}
