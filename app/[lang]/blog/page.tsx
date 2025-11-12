import Link from 'next/link';
import { type Locale, getDictionary, type Dictionary } from '@/lib/i18n';
import { getBlogPosts, getCategories } from '@/lib/blog';

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const blog = dict.blog as Dictionary;
  const posts = await getBlogPosts(lang as Locale);
  const categories = await getCategories(lang as Locale);

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-bold mb-8 text-primary">
            {blog.title as string}
          </h1>
          <div className="h-1 w-24 bg-gradient-rainbow mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-primary">{blog.categories as string}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${lang}/blog`}
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Tous les articles
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/${lang}/blog/category/${category.slug}`}
                      className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">{blog.noArticles as string}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
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
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-500">
                          {new Date(post.publishedDate).toLocaleDateString(lang)}
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <span className="text-sm bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full">
                            {post.tags[0]}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold mb-3 text-primary group-hover:text-cyan transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
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
      </div>
    </main>
  );
}
