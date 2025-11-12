import { type Locale, getDictionary } from '@/lib/i18n';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: "Mes Soins - Reiki, Chromobio-Énergie, Méditation & Soins Vibratoires",
    description: "Découvrez mes approches thérapeutiques : Reiki, soins vibratoires, Chromobio-Énergie, méditation guidée et massage Amma. Thérapies douces et énergétiques pour votre bien-être holistique.",
    keywords: ["Reiki", "Chromobio-Énergie", "soins vibratoires", "méditation", "massage Amma", "thérapies énergétiques", "bien-être holistique", "soins naturels", "harmonisation énergétique"],
    openGraph: {
      title: "Mes Soins - Thérapies Énergétiques | Cœur de l'OM",
      description: "Reiki, soins vibratoires, Chromobio-Énergie, méditation guidée et massage Amma pour votre harmonisation énergétique et votre bien-être.",
      images: ['/Coeur-de-lOm-Alpha-Kopie.png'],
    },
  };
}

export default async function TherapiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const t = dict.therapies as any;

  const therapies = [
    {
      title: t.reiki.title,
      image: '/Reiki-Circle-1.png',
      gradient: 'from-purple-400 via-pink-400 to-purple-300',
      rotation: '-rotate-12',
      description: t.reiki.description,
      benefits: t.reiki.benefits
    },
    {
      title: t.vibratory.title,
      image: '/Carte-Soins-Vibratoires.png',
      gradient: 'from-purple-500 via-indigo-400 to-purple-400',
      rotation: '-rotate-6',
      description: t.vibratory.description,
      benefits: t.vibratory.benefits
    },
    {
      title: t.meditation.title,
      image: '/Carte-Meditation.png',
      gradient: 'from-blue-600 via-indigo-500 to-blue-500',
      rotation: 'rotate-0',
      description: t.meditation.description,
      benefits: t.meditation.benefits
    },
    {
      title: t.chromobio.title,
      image: '/Chromo-Bio-Neu.png',
      gradient: 'from-green-400 via-cyan-400 to-pink-400',
      rotation: 'rotate-6',
      description: t.chromobio.description,
      benefits: t.chromobio.benefits
    },
    {
      title: t.amma.title,
      image: '/Carte-Massage-Amma.png',
      gradient: 'from-orange-300 via-orange-200 to-orange-100',
      rotation: 'rotate-12',
      description: t.amma.description,
      benefits: t.amma.benefits
    },
  ];

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-cyan-50/20 pt-40 pb-20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <InteractiveTitle className="text-5xl md:text-6xl font-normal text-purple-900">
              {t.title}
            </InteractiveTitle>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto mb-20">
          {therapies.map((therapy) => (
            <div
              key={therapy.title}
              className={`${therapy.rotation} hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer group`}
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl bg-white/80 backdrop-blur-sm border border-gray-100/50">
                {/* Image - Now prominent */}
                {therapy.image && (
                  <div className="absolute inset-0 p-4 flex items-center justify-center">
                    <img
                      src={therapy.image}
                      alt={therapy.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Subtle gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${therapy.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Soft blur effects on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/0 to-cyan-200/0 group-hover:from-purple-200/30 group-hover:to-cyan-200/30 rounded-full blur-3xl transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tl from-pink-200/0 to-purple-200/0 group-hover:from-pink-200/30 group-hover:to-purple-200/30 rounded-full blur-3xl transition-all duration-500"></div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/90 to-transparent p-6 pt-12 backdrop-blur-sm">
                  <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600/80 via-pink-500/80 to-cyan-600/80">
                    {therapy.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Descriptions */}
        <div className="max-w-6xl mx-auto space-y-16">
          {therapies.map((therapy, index) => (
            <div
              key={therapy.title}
              className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 group ${
                index % 2 === 0 ? 'hover:translate-x-2' : 'hover:-translate-x-2'
              }`}
            >
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Image */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-200/20 via-pink-200/20 to-cyan-200/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/90 rounded-2xl p-6 shadow-sm group-hover:shadow-md transition-all duration-500">
                    <img
                      src={therapy.image}
                      alt={therapy.title}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 space-y-6">
                  <InteractiveTitle className="text-4xl font-normal text-purple-900">
                    {therapy.title}
                  </InteractiveTitle>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {therapy.description}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">{t.benefits}</h3>
                    <ul className="space-y-3">
                      {therapy.benefits?.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-200/50 to-cyan-200/50 flex items-center justify-center mt-0.5">
                            <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <a
                      href={`/${lang}/contact`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100/60 to-cyan-100/60 hover:from-purple-200/80 hover:to-cyan-200/80 text-purple-700 font-semibold rounded-full transition-all duration-300 hover:gap-3 hover:shadow-md"
                    >
                      {t.bookAppointment}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
