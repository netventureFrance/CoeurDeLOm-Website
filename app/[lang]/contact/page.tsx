import { type Locale, getDictionary } from '@/lib/i18n';
import ContactForm from '@/components/ContactForm';

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              {dict.contact.title}
            </h1>
            <div className="h-1 w-24 bg-gradient-rainbow mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <ContactForm lang={lang} dict={dict} />
            </div>

            {/* Contact Info & Cal.com */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6">Prenez rendez-vous</h3>
                <p className="mb-6">
                  Réservez directement votre consultation en ligne via Cal.com
                </p>

                {/* Cal.com Embed - Replace with your username */}
                <div className="bg-white rounded-lg p-4">
                  <iframe
                    src="https://cal.com/your-username"
                    width="100%"
                    height="600"
                    frameBorder="0"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>

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
