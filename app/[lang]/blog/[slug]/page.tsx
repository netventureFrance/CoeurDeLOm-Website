import { notFound } from 'next/navigation';
import { type Locale, getDictionary } from '@/lib/i18n';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/airtable';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';

// Revalidate every 60 seconds - blog updates from Airtable will appear within 1 minute
export const revalidate = 60;

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

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
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

  return (
    <main className="relative min-h-screen pt-40 pb-20 overflow-hidden">
      <AnimatedBackground />
      <article className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-96 w-full overflow-hidden rounded-3xl mb-8">
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
        </div>
      </article>
    </main>
  );
}
