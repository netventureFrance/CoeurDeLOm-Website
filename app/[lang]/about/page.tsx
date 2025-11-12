import { type Locale, getDictionary } from '@/lib/i18n';

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-8">
        {/* Hero Section with Profile */}
        <section className="mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Text Content */}
            <div className="space-y-8">
              <h1 className="gradient-text mb-8">QUI SUIS-JE?</h1>
              <div className="space-y-6 text-lg leading-relaxed bg-white p-8 rounded-3xl shadow-lg">
                <p className="text-gray-700">
                  Formée en Allemagne il y a plus de vingt ans, j'ai toujours perçu la naturopathie comme un art d'unir le corps, l'énergie et la conscience. Au fil du temps, ma pratique s'est ouverte aux soins vibratoires, à la méditation et à une approche intérieure du soin, où l'écoute devient un acte de guérison et d'éveil.
                </p>
                <p className="text-gray-700">
                  J'accompagne chaque personne selon son rythme, dans un espace bienveillant où le corps retrouve son intelligence naturelle, le cœur sa clarté et l'âme son alignement.
                </p>
                <p className="text-gray-700">
                  Mon cabinet comprend également un espace de méditation, lieu de ressourcement et de partage, où j'accueille ponctuellement de petits groupes pour des pratiques guidées et des expériences de reconnexion à soi. J'aurai joie à vous accueillir et à vous accompagner vers un état de présence, d'harmonie et de vitalité intérieure.
                </p>
              </div>
              <a href="#diplomes" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan to-bleu text-white rounded-full text-lg font-medium hover:shadow-lg transition-all hover:scale-105">
                Diplômes & Formations
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            {/* Profile Image with Gradient Border */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan via-violet to-pourpre rounded-full transform scale-105 animate-blob"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-jaune via-orange to-rouge rounded-full transform scale-105 animate-blob animation-delay-2000"></div>
                <img
                  src="/Val-1.png"
                  alt="Valérie"
                  className="relative z-10 rounded-full w-96 h-96 object-cover border-8 border-white shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Diplomas Section */}
        <section id="diplomes" className="max-w-5xl mx-auto">
          <h2 className="gradient-text mb-16 text-center">DIPLÔMES & FORMATIONS</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan to-bleu p-1 rounded-3xl">
              <div className="bg-white rounded-3xl p-8 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan to-bleu rounded-full mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-cyan">Naturopathie</h3>
                <p className="text-gray-600 text-lg">Heilpraktikerin<br/>Allemagne, 2004</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-violet to-pourpre p-1 rounded-3xl">
              <div className="bg-white rounded-3xl p-8 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-violet to-pourpre rounded-full mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-violet">Chromobio-Énergie</h3>
                <p className="text-gray-600 text-lg">École Internationale de Chromobio-Énergie</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-vert to-vert-turquoise p-1 rounded-3xl">
              <div className="bg-white rounded-3xl p-8 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-vert to-vert-turquoise rounded-full mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-vert">Méditation & Spiritualité</h3>
                <p className="text-gray-600 text-lg">Formation continue en pratiques méditatives</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
