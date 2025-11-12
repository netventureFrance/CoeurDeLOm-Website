import { type Locale, getDictionary } from '@/lib/i18n';
import { Metadata } from 'next';
import FAQAccordion from '@/components/FAQAccordion';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: "FAQ - Questions Fréquentes",
    description: "Trouvez les réponses aux questions les plus courantes sur nos soins : Reiki, Chromobio-Énergie, méditation, soins vibratoires et massage Amma.",
    keywords: ["FAQ", "questions fréquentes", "Reiki", "Chromobio-Énergie", "méditation", "soins vibratoires", "naturopathie"],
    openGraph: {
      title: "FAQ - Questions Fréquentes | Cœur de l'OM",
      description: "Réponses aux questions sur nos soins énergétiques et pratiques de bien-être.",
      images: ['/Coeur-de-lOm-Alpha-Kopie.png'],
    },
  };
}

export default async function FAQPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const faq = dict.faq as any;

  return (
    <main className="relative min-h-screen pt-40 pb-20 bg-gradient-to-br from-white via-purple-50/20 to-cyan-50/20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <InteractiveTitle className="text-5xl md:text-6xl font-normal text-purple-900">
              {faq.title}
            </InteractiveTitle>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            {faq.subtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <FAQAccordion questions={faq.questions} lang={lang} />

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-cyan-50/50 rounded-3xl p-10 backdrop-blur-sm border border-gray-100/50">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {lang === 'fr' ? "Vous avez d'autres questions ?" : lang === 'de' ? 'Haben Sie weitere Fragen?' : 'Have more questions?'}
            </h2>
            <p className="text-gray-700 mb-6 text-lg">
              {lang === 'fr' ? "N'hésitez pas à me contacter pour toute question supplémentaire." : lang === 'de' ? 'Zögern Sie nicht, mich für weitere Fragen zu kontaktieren.' : "Don't hesitate to contact me for any additional questions."}
            </p>
            <a
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-100/60 to-cyan-100/60 hover:from-purple-200/80 hover:to-cyan-200/80 text-purple-700 font-semibold rounded-full transition-all duration-300 hover:gap-3 hover:shadow-md"
            >
              {lang === 'fr' ? 'Me contacter' : lang === 'de' ? 'Kontaktieren' : 'Contact me'}
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
