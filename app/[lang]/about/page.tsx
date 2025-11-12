import { type Locale, getDictionary } from '@/lib/i18n';

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-8">
        {/* Hero Section with Profile */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Text Content */}
            <div>
              <h1 className="text-cyan mb-8">QUI SUIS-JE?</h1>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Formée en Allemagne il y a plus de vingt ans, j'ai toujours perçu la naturopathie comme un art d'unir le corps, l'énergie et la conscience. Au fil du temps, ma pratique s'est ouverte aux soins vibratoires, à la méditation et à une approche intérieure du soin, où l'écoute devient un acte de guérison et d'éveil.
                </p>
                <p>
                  J'accompagne chaque personne selon son rythme, dans un espace bienveillant où le corps retrouve son intelligence naturelle, le cœur sa clarté et l'âme son alignement.
                </p>
                <p>
                  Mon cabinet comprend également un espace de méditation, lieu de ressourcement et de partage, où j'accueille ponctuellement de petits groupes pour des pratiques guidées et des expériences de reconnexion à soi. J'aurai joie à vous accueillir et à vous accompagner vers un état de présence, d'harmonie et de vitalité intérieure.
                </p>
              </div>
              <a href="#diplomes" className="inline-flex items-center gap-2 mt-8 text-lg font-medium hover:text-cyan transition-colors">
                Diplômes
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full transform scale-95 -z-10"></div>
                <img
                  src="/Val-1.png"
                  alt="Valérie"
                  className="relative z-10 rounded-full w-96 h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Diplomas Section */}
        <section id="diplomes" className="max-w-4xl mx-auto">
          <h2 className="text-cyan mb-12">DIPLÔMES & FORMATIONS</h2>
          <div className="space-y-8 bg-white rounded-2xl p-8 shadow-sm">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Naturopathie</h3>
              <p className="text-gray-600">Heilpraktikerin - Allemagne, 2004</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Chromobio-Énergie</h3>
              <p className="text-gray-600">École Internationale de Chromobio-Énergie</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Méditation & Spiritualité</h3>
              <p className="text-gray-600">Formation continue en pratiques méditatives</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
