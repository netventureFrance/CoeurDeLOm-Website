import { getDictionary, type Locale } from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Soft Light Background */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 pt-24 relative overflow-hidden">
        {/* Soft animated background blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan/10 rounded-full mix-blend-normal filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-4000"></div>

        <div className="container mx-auto px-8 py-20 text-center max-w-5xl relative z-10">
          <h1 className="text-7xl md:text-8xl mb-12 bg-gradient-to-r from-purple-400/80 via-pink-300/80 to-cyan-400/80 bg-clip-text text-transparent font-normal tracking-wide" style={{ fontFamily: "'Satisfy', cursive" }}>
            Cœur de l'Om
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto">
            Découvrez l'efficacité des soins vibratoires pour libérer les tensions et favoriser une circulation fluide de l'énergie.
          </p>
        </div>
      </section>

      {/* Services Preview with Soft Cards */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-purple-300/70 via-pink-300/70 to-cyan-300/70 bg-clip-text text-transparent">
            NOS PRATIQUES
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-cyan-50/50 to-blue-50/50 rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-cyan-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-200/40 to-blue-200/40 rounded-full mb-6 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-cyan-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-600/80">MÉDITATION</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Séances guidées pour retrouver le calme intérieur et la clarté mentale.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-purple-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full mb-6 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-purple-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600/80">SPIRITUALITÉ</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Accompagnement sur le chemin de l'éveil et de la reconnexion à soi.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50/50 to-teal-50/50 rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-green-100/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-200/40 to-teal-200/40 rounded-full mb-6 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-green-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-600/80">THÉRAPIES DOUCES</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Soins énergétiques et naturopathie pour harmoniser corps et esprit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
