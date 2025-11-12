import { notFound } from 'next/navigation';
import { type Locale, getDictionary } from '@/lib/i18n';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/airtable';
import { Metadata } from 'next';

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
  const params = [];

  for (const lang of languages) {
    const posts = await getBlogPosts(lang);
    for (const post of posts) {
      params.push({
        lang,
        slug: post.slug,
      });
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
    <main className="min-h-screen pt-40 pb-20">
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

            <h1 className="font-bold mb-4 text-primary">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-700 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Author Bio */}
          {post.author && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-purple-600"
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
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">
                    {post.author}
                  </h3>
                  <p className="text-gray-600">
                    {lang === 'fr' && 'Heilpraktikerin spécialisée en naturopathie et soins énergétiques'}
                    {lang === 'de' && 'Heilpraktikerin spezialisiert auf Naturheilkunde und Energieheilung'}
                    {lang === 'en' && 'Heilpraktikerin specialized in naturopathy and energy healing'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
