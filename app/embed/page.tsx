import ChatWidget from '@/components/ChatWidget'

export default function EmbedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Titolo minimale */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧑‍🍳 AI Chef Malbosca
          </h1>
          <p className="text-gray-600">
            Il tuo chef personale per ricette creative con frutta e verdura biologica italiana
          </p>
        </div>

        {/* Chat Widget */}
        <ChatWidget />

        {/* Footer minimale */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          Powered by Malbosca 🌱
        </div>
      </div>
    </div>
  )
}