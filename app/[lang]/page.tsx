import { getDictionary, type Locale } from "@/lib/i18n";
import HeroSection from "@/components/HeroSection";
import NewsPromo from "@/components/NewsPromo";
import { getNewsPromos } from "@/lib/airtable";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const home = dict.home as any;

  // Fetch news/promos from Airtable
  const newsPromos = await getNewsPromos(lang);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Interactive Effects */}
      <HeroSection subtitle={home.subtitle} />

      {/* News & Promos Section */}
      <NewsPromo initialNews={newsPromos} />

      {/* Services Preview with Soft Cards */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-purple-300/70 via-pink-300/70 to-cyan-300/70 bg-clip-text text-transparent">
            {home.practicesTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-50/50 to-blue-50/50 rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-cyan-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-200/40 to-blue-200/40 rounded-full mb-6 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-cyan-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-600/80">{home.meditation.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {home.meditation.description}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-purple-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full mb-6 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-purple-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600/80">{home.spirituality.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {home.spirituality.description}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50/50 to-teal-50/50 rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-green-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-200/40 to-teal-200/40 rounded-full mb-6 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-green-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-600/80">{home.therapies.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {home.therapies.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
