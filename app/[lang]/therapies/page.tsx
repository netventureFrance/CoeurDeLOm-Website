import { type Locale, getDictionary } from '@/lib/i18n';

export default async function TherapiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const therapies = [
    {
      title: 'REIKI',
      image: '/Reiki-Circle-1.png',
      gradient: 'from-purple-400 via-pink-400 to-purple-300',
      rotation: '-rotate-12',
      description: 'Le Reiki est une thérapie énergétique japonaise qui utilise l\'énergie vitale universelle pour favoriser la guérison physique, émotionnelle, mentale et spirituelle. Lors d\'une séance, le praticien place ses mains sur ou au-dessus du corps du receveur pour canaliser cette énergie, éliminer les blocages et rétablir l\'harmonie.',
      benefits: [
        'Réduction du stress et des tensions',
        'Soulagement de la douleur',
        'Amélioration du sommeil',
        'Soutien émotionnel',
        'Pratique non invasive accessible à tous'
      ]
    },
    {
      title: 'SOINS VIBRATOIRES',
      image: '/Carte-Soins-Vibratoires.png',
      gradient: 'from-purple-500 via-indigo-400 to-purple-400',
      rotation: '-rotate-6',
      description: 'Les soins vibratoires offrent une approche holistique en utilisant les vibrations sonores, lumineuses et énergétiques pour équilibrer corps, esprit et âme. Basées sur les fréquences universelles, ces techniques incluant le son des bols chantants, les mantras et la chromobioénergie réduisent le stress, améliorent le sommeil, soulagent la douleur et augmentent l\'énergie.',
      benefits: [
        'Réduction du stress',
        'Amélioration du sommeil',
        'Soulagement de la douleur',
        'Augmentation de l\'énergie',
        'Séance personnalisée selon vos besoins'
      ]
    },
    {
      title: 'MÉDITATION',
      image: '/Carte-Meditation.png',
      gradient: 'from-blue-600 via-indigo-500 to-blue-500',
      rotation: 'rotate-0',
      description: 'La méditation utilise diverses techniques telles que la pleine conscience, la méditation guidée et transcendantale, ainsi que les mantras comme le son OM, pour favoriser la relaxation, la conscience de soi et la guérison émotionnelle. Elle réduit le stress, l\'anxiété et la dépression, améliore la concentration et la clarté mentale, et promeut la paix intérieure.',
      benefits: [
        'Réduction du stress, anxiété et dépression',
        'Amélioration de la concentration',
        'Clarté mentale',
        'Promotion de la paix intérieure',
        'Approche naturelle adaptée à tous'
      ]
    },
    {
      title: 'CHROMOBIOÉNERGIE',
      image: '/Chromo-Bio-Neu.png',
      gradient: 'from-green-400 via-cyan-400 to-pink-400',
      rotation: 'rotate-6',
      description: 'La ChromoBioÉnergie utilise la couleur comme une musique mystérieuse pour réharmoniser notre corps et esprit. Chaque personne naît avec un capital unique de couleurs, et cette méthode, adaptée aux besoins individuels, traite divers déséquilibres. Grâce aux tests chromoémotionnels développés par Evelyne Monsallier, les dissonances de votre mélodie intérieure sont détectées et corrigées.',
      benefits: [
        'Réharmonisation corps et esprit',
        'Traitement des déséquilibres individuels',
        'Tests chromoémotionnels personnalisés',
        'Méthode particulièrement efficace',
        'Maintien d\'une bonne santé'
      ]
    },
    {
      title: 'MASSAGE AMMA',
      image: '/Carte-Massage-Amma.png',
      gradient: 'from-orange-300 via-orange-200 to-orange-100',
      rotation: 'rotate-12',
      description: 'Massage assis énergétique d\'origine japonaise qui travaille sur les méridiens d\'énergie pour libérer les tensions et favoriser la circulation énergétique.',
      benefits: [
        'Libération des tensions musculaires',
        'Amélioration de la circulation énergétique',
        'Réduction du stress',
        'Revitalisation rapide',
        'Pratique accessible en entreprise'
      ]
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-cyan mb-8">MES SOINS</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Découvrez les différentes approches thérapeutiques que je propose pour votre bien-être et votre harmonisation énergétique.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto mb-20">
          {therapies.map((therapy) => (
            <div
              key={therapy.title}
              className={`${therapy.rotation} hover:scale-105 transition-all duration-300 cursor-pointer group`}
            >
              <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${therapy.gradient} opacity-90`}></div>

                {/* Optional: Background Image */}
                {therapy.image && (
                  <div
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
                    style={{ backgroundImage: `url(${therapy.image})` }}
                  ></div>
                )}

                {/* Ethereal Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg">{therapy.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Descriptions */}
        <div className="max-w-5xl mx-auto space-y-16">
          {therapies.map((therapy) => (
            <div key={therapy.title} className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-4 text-cyan">{therapy.title}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {therapy.description}
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Bienfaits</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {therapy.benefits?.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href={`/${lang}/contact`}
                  className="inline-flex items-center gap-2 text-cyan font-semibold hover:gap-3 transition-all"
                >
                  Prendre rendez-vous
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
