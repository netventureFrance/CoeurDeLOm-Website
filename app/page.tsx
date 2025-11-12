export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl md:text-display font-bold mb-6 gradient-text">
            Coeur de l'OM
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Bien-être, méditation et spiritualité
          </p>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-primary">
              Découvrir
            </button>
            <button className="btn btn-secondary">
              Prendre RDV
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
