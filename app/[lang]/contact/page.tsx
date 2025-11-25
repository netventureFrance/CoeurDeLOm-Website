import { type Locale, getDictionary } from '@/lib/i18n';
import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: "Contact & Rendez-vous - Réservez votre consultation",
    description: "Prenez rendez-vous pour une consultation en naturopathie, soins vibratoires ou méditation. Cabinet Cœur de l'OM en France. Réservation en ligne disponible.",
    keywords: ["prendre rendez-vous", "réservation", "consultation naturopathie", "contact", "cabinet France", "rendez-vous en ligne", "Valérie Heydlauf"],
    openGraph: {
      title: "Contact & Rendez-vous | Cœur de l'OM",
      description: "Réservez votre consultation en naturopathie, soins vibratoires ou méditation. Cabinet en France.",
      images: ['/Coeur-de-lOm-Alpha-Kopie.png'],
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="relative min-h-screen pt-40 pb-20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <InteractiveTitle className="text-4xl md:text-5xl font-normal text-purple-900">
                {(dict.contact as any).title}
              </InteractiveTitle>
            </div>
            <div className="h-1 w-24 bg-gradient-rainbow mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column: Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <ContactForm lang={lang as Locale} dict={dict} />
            </div>

            {/* Right Column: Cal.com */}
            <div>
              {/* Cal.com Embed */}
              <div style={{ width: '100%', height: 'auto' }}>
                <iframe
                  src="https://cal.com/coeurdelom"
                  width="100%"
                  height="800"
                  frameBorder="0"
                  style={{ border: 0 }}
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
