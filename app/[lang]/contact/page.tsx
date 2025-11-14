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
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <ContactForm lang={lang as Locale} dict={dict} />
            </div>

            {/* Contact Info & Cal.com */}
            <div className="space-y-8">
              {/* Cal.com Embed */}
              <iframe
                src="https://cal.com/coeurdelom?embed=true"
                width="100%"
                height="1000"
                frameBorder="0"
                style={{ border: 0, minHeight: '1000px' }}
                className="rounded-lg"
              ></iframe>

              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-primary">Informations</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span>contact@coeurdelom.fr</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span>France</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
