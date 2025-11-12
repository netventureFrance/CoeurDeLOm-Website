import { type Locale, getDictionary } from '@/lib/i18n';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: 'Pourquoi Cœur de l\'OM - Expertise Holistique & Soins Énergétiques',
    description: 'Découvrez pourquoi choisir Cœur de l\'OM : expertise holistique, techniques ancestrales, accompagnement personnalisé et environnement propice à la guérison.',
    keywords: ['naturopathie', 'heilpraktikerin', 'soins énergétiques', 'médecine traditionnelle chinoise', 'reiki', 'chromobioénergie', 'bien-être holistique', 'thérapies alternatives'],
    openGraph: {
      title: 'Pourquoi Cœur de l\'OM - Expertise Holistique',
      description: 'Expertise holistique, techniques ancestrales, accompagnement personnalisé dans un cadre propice à la guérison.',
      images: ['/Coeur-de-lOm-Alpha-Kopie.png'],
    },
  };
}

export default async function WhyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const why = dict.why as any;

  const features = [
    {
      key: 'holistic',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      key: 'ancestral',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      key: 'personalized',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      key: 'environment',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
  ];

  return (
    <main className="relative min-h-screen pt-40 pb-20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <InteractiveTitle className="text-5xl md:text-6xl font-normal text-purple-900">
              {why.title as string}
            </InteractiveTitle>
          </div>
          <div className="h-1 w-24 bg-gradient-rainbow mx-auto"></div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-purple-100/50 hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full flex items-center justify-center mb-6">
                  <div className="text-purple-600">
                    {feature.icon}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {why[feature.key].title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {why[feature.key].description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white rounded-3xl p-12 max-w-4xl mx-auto shadow-lg border border-purple-100/50">
            <h3 className="text-3xl font-bold text-primary mb-6">
              {lang === 'fr' && 'Prêt à commencer votre voyage vers le bien-être ?'}
              {lang === 'de' && 'Bereit, Ihre Reise zum Wohlbefinden zu beginnen?'}
              {lang === 'en' && 'Ready to start your wellness journey?'}
            </h3>
            <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
              {lang === 'fr' && 'Découvrez comment nos soins peuvent vous accompagner vers un état de présence, d\'harmonie et de vitalité intérieure.'}
              {lang === 'de' && 'Entdecken Sie, wie unsere Behandlungen Sie zu einem Zustand der Präsenz, Harmonie und inneren Vitalität begleiten können.'}
              {lang === 'en' && 'Discover how our therapies can guide you towards a state of presence, harmony and inner vitality.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`/${lang}/contact`}
                className="inline-block bg-primary text-white font-semibold py-4 px-8 rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
              >
                {lang === 'fr' && 'Prendre rendez-vous'}
                {lang === 'de' && 'Termin buchen'}
                {lang === 'en' && 'Book appointment'}
              </a>
              <a
                href={`/${lang}/therapies`}
                className="inline-block bg-white text-primary font-semibold py-4 px-8 rounded-full hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl border-2 border-primary"
              >
                {lang === 'fr' && 'Découvrir nos soins'}
                {lang === 'de' && 'Unsere Behandlungen entdecken'}
                {lang === 'en' && 'Discover our therapies'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
