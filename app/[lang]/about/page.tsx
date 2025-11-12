import { type Locale, getDictionary } from '@/lib/i18n';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: "Qui suis-je ? - Valérie Heydlauf, Heilpraktikerin",
    description: "Découvrez le parcours de Valérie Heydlauf, Heilpraktikerin diplômée en Allemagne depuis 2004, spécialisée en Chromobio-Énergie et soins vibratoires. Plus de 20 ans d'expérience en naturopathie holistique.",
    keywords: ["Valérie Heydlauf", "Heilpraktikerin", "naturopathe", "diplôme Allemagne", "Chromobio-Énergie", "formation", "parcours", "expérience"],
    openGraph: {
      title: "Qui suis-je ? - Valérie Heydlauf | Cœur de l'OM",
      description: "Heilpraktikerin diplômée en Allemagne depuis 2004, spécialisée en Chromobio-Énergie et soins vibratoires depuis plus de 20 ans.",
      images: ['/Val-1.png'],
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const about = dict.about as any;

  return (
    <main className="min-h-screen pt-40 pb-20 bg-white">
      <div className="container mx-auto px-8">
        {/* Hero Section with Profile */}
        <section className="mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Text Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-purple-900">{about.title}</h1>
              <div className="space-y-6 text-lg leading-relaxed bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100/50">
                <p className="text-gray-600">
                  {about.paragraph1}
                </p>
                <p className="text-gray-600">
                  {about.paragraph2}
                </p>
                <p className="text-gray-600">
                  {about.paragraph3}
                </p>
              </div>
              <a href="#diplomes" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-200/60 to-blue-200/60 backdrop-blur-sm text-cyan-700 rounded-full text-lg font-medium hover:shadow-md transition-all hover:scale-105 border border-cyan-200/50">
                {about.diplomasButton}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            {/* Profile Image with Soft Gradient Glow */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/30 via-purple-200/30 to-pink-200/30 rounded-full transform scale-110 blur-2xl animate-blob"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-pink-200/20 via-yellow-200/20 to-cyan-200/20 rounded-full transform scale-110 blur-2xl animate-blob animation-delay-2000"></div>
                <img
                  src="/Val-1.png"
                  alt="Valérie Heydlauf, Heilpraktikerin diplômée - Cœur de l'OM"
                  className="relative z-10 rounded-full w-96 h-96 object-cover border-4 border-white/80 shadow-lg backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Diplomas Section */}
        <section id="diplomes" className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 text-purple-900">{about.diplomasTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-cyan-100/50 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-200/50 to-blue-200/50 rounded-full mb-6 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-cyan-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-cyan-600/80">{about.naturopathy.title}</h3>
              <p className="text-gray-600 text-lg whitespace-pre-line">{about.naturopathy.description}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-purple-100/50 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full mb-6 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-purple-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-purple-600/80">{about.chromobio.title}</h3>
              <p className="text-gray-600 text-lg">{about.chromobio.description}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50/80 to-teal-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-green-100/50 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-200/50 to-teal-200/50 rounded-full mb-6 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-green-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-600/80">{about.meditation.title}</h3>
              <p className="text-gray-600 text-lg">{about.meditation.description}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
