import { getDictionary, type Locale } from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-white pt-24">
        <div className="container mx-auto px-8 py-20 text-center max-w-5xl">
          <h1 className="text-7xl md:text-8xl mb-12 text-violet font-normal tracking-wide" style={{ fontFamily: "'Satisfy', cursive" }}>
            Cœur de l'Om
          </h1>
          <p className="text-2xl md:text-3xl text-bleu font-normal leading-relaxed max-w-4xl mx-auto">
            Découvrez l'efficacité des soins vibratoires pour libérer les tensions et favoriser une circulation fluide de l'énergie.
          </p>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-cyan">MÉDITATION</h3>
              <p className="text-gray-700 leading-relaxed">
                Séances guidées pour retrouver le calme intérieur et la clarté mentale.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-cyan">SPIRITUALITÉ</h3>
              <p className="text-gray-700 leading-relaxed">
                Accompagnement sur le chemin de l'éveil et de la reconnexion à soi.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-cyan">THÉRAPIES DOUCES</h3>
              <p className="text-gray-700 leading-relaxed">
                Soins énergétiques et naturopathie pour harmoniser corps et esprit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
