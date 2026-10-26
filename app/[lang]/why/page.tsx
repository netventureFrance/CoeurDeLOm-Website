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
      image: '/PourquoiExpertiseHolistique.png',
    },
    {
      key: 'ancestral',
      image: '/PourquoiTechniquesAncestrales.png',
    },
    {
      key: 'personalized',
      image: '/PourquoiAccompagnement.png',
    },
    {
      key: 'environment',
      image: '/PourquoiCadre%20Guerison.png',
    },
  ];

  return (
    <main className="relative min-h-screen pt-40 pb-20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <InteractiveTitle className="text-5xl md:text-6xl font-normal text-purple-900">
              {why.title as string}
            </InteractiveTitle>
          </div>
          <div className="h-1 w-24 bg-gradient-rainbow mx-auto mb-10"></div>

          {/* Description Text */}
          <div className="max-w-4xl mx-auto text-left">
            {(why.description as string).split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Features Grid - Single Row */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300 border border-purple-100/50 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-3">
                  <img
                    src={feature.image}
                    alt={why[feature.key].title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-sm font-bold text-primary mb-2">
                  {why[feature.key].title}
                </h2>
                <p className="text-gray-600 text-xs leading-relaxed">
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
