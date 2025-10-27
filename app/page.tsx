import ChatWidget from '@/components/ChatWidget'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🧑‍🍳 AI Chef Malbosca
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Il tuo chef personale per ricette creative con frutta e verdura biologica italiana.
            Chiedi qualsiasi cosa e ricevi ricette su misura in pochi secondi!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-3">🍎</div>
            <h3 className="font-bold text-lg mb-2">Prodotti Bio 100%</h3>
            <p className="text-gray-600 text-sm">
              Solo ingredienti biologici italiani di altissima qualità
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">Ricette Istantanee</h3>
            <p className="text-gray-600 text-sm">
              Risposte in tempo reale con ricette personalizzate
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="font-bold text-lg mb-2">Sempre Disponibile</h3>
            <p className="text-gray-600 text-sm">
              24/7, quando hai bisogno di ispirazione culinaria
            </p>
          </div>
        </div>

        {/* Chat Widget */}
        <ChatWidget />

        {/* Examples */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h3 className="font-bold text-xl text-center mb-6 text-gray-800">
            Prova a chiedere:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-700">
                💬 "Ho delle mele disidratate, cosa posso preparare per colazione?"
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-700">
                💬 "Ricetta salata veloce per pranzo con noci"
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-700">
                💬 "Uno snack energetico per il lavoro"
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-700">
                💬 "Dolce facile con fichi secchi per ospiti"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Powered by Malbosca 🌱 | Ricette generate con AI</p>
        </footer>
      </div>
    </main>
  )
}