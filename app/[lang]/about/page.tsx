import { type Locale, getDictionary } from '@/lib/i18n';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';
import TherapyFAQ from '@/components/TherapyFAQ';

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
    <main className="relative min-h-screen pt-40 pb-20 bg-white overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-8">
        {/* Hero Section with Profile */}
        <section className="mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Text Content */}
            <div className="space-y-8">
              <InteractiveTitle className="text-5xl md:text-6xl font-normal mb-8 text-purple-900">
                {about.title}
              </InteractiveTitle>
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

        {/* FAQ Section */}
        <section className="max-w-6xl mx-auto">
          {(about as any).faq && (
            <TherapyFAQ
              title={(about as any).faq.title}
              tabs={(about as any).faq.tabs}
              content={{
                diplomas: (about as any).faq.diplomas,
                sessions: (about as any).faq.sessions
              }}
              lang={lang}
            />
          )}
        </section>
      </div>
    </main>
  );
}
