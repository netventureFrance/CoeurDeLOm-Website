import { type Locale, getDictionary } from '@/lib/i18n';
import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';
import { pageMetadata, GEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, 'contact');
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const contact = dict.contact as any;

  return (
    <main className="relative min-h-screen pt-40 pb-20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <InteractiveTitle className="text-4xl md:text-5xl font-normal text-purple-900">
                {contact.title}
              </InteractiveTitle>
            </div>
            <div className="h-1 w-24 bg-gradient-rainbow mx-auto mb-8"></div>
          </div>

          {/* Address + map */}
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl shadow-xl p-8 mb-12">
            <address className="not-italic space-y-2 text-lg text-gray-700">
              <h2 className="text-2xl text-purple-900 mb-4">{contact.addressTitle}</h2>
              <p className="font-semibold text-purple-900">Cœur de l&apos;Om</p>
              <p>140 rue Pioch Boutonnet<br />34090 Montpellier, France</p>
              <p className="text-gray-500">{contact.byAppointment}</p>
              <p className="pt-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=140+rue+Pioch+Boutonnet+34090+Montpellier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-700 underline underline-offset-4 hover:text-purple-900"
                >
                  {contact.directions}
                </a>
              </p>
            </address>
            {/* OpenStreetMap rather than Google Maps: no cookies or tracking, so no consent banner needed */}
            <iframe
              title={contact.mapTitle}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${GEO.longitude - 0.006}%2C${GEO.latitude - 0.003}%2C${GEO.longitude + 0.006}%2C${GEO.latitude + 0.003}&layer=mapnik&marker=${GEO.latitude}%2C${GEO.longitude}`}
              className="w-full h-72 rounded-2xl border-0"
              loading="lazy"
            ></iframe>
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
