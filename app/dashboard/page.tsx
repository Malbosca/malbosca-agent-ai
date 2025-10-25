'use client'

import { useEffect, useState } from 'react'
import { supabase, ContentQueue } from '@/lib/supabase'
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react'

export default function Dashboard() {
  const [content, setContent] = useState<ContentQueue[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    loadContent()
  }, [filter])

  async function loadContent() {
    setLoading(true)
    try {
      let query = supabase
        .from('content_queue')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setContent(data || [])
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, newStatus: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('content_queue')
        .update({ 
          status: newStatus,
          approved_at: newStatus === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', id)

      if (error) throw error
      
      // Ricarica i contenuti
      loadContent()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      published: 'bg-blue-100 text-blue-800'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const getPlatformEmoji = (platform: string) => {
    const emojis = {
      instagram: '📸',
      facebook: '📘',
      tiktok: '🎵',
      x: '🐦'
    }
    return emojis[platform as keyof typeof emojis] || '📱'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento contenuti...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🎯 Dashboard Social Media
          </h1>
          <p className="text-gray-600 mt-1">
            Gestisci e approva i contenuti generati dall'AI Agent
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'Tutti' : f === 'pending' ? 'In Attesa' : f === 'approved' ? 'Approvati' : 'Rifiutati'}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {content.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Nessun contenuto {filter !== 'all' ? filter : 'disponibile'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              I contenuti generati dall'AI Agent appariranno qui
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {content.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {getPlatformEmoji(item.social_platform)}
                      </span>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {item.recipe_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.social_platform.toUpperCase()} • {item.content_type}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* 🆕 AI GENERATED IMAGE */}
                  {item.generated_content?.image_url && (
                    <div className="mb-4">
                      <img 
                        src={item.generated_content.image_url} 
                        alt={item.recipe_name}
                        className="w-full h-80 object-cover rounded-lg shadow-md"
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        🎨 Immagine generata con AI
                      </p>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">
                      Anteprima Contenuto:
                    </h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      {item.content_type === 'post' && (
                        <>
                          <p className="font-medium">Caption:</p>
                          <p className="whitespace-pre-wrap">
                            {item.generated_content?.caption?.substring(0, 200)}
                            {item.generated_content?.caption?.length > 200 ? '...' : ''}
                          </p>
                          {item.generated_content?.hashtags && (
                            <p className="text-blue-600">
                              {item.generated_content.hashtags.slice(0, 5).map((tag: string) => `#${tag}`).join(' ')}
                            </p>
                          )}
                        </>
                      )}
                      {item.content_type === 'reel' && (
                        <>
                          <p className="font-medium">Hook:</p>
                          <p>{item.generated_content?.hook}</p>
                          <p className="font-medium mt-2">Steps:</p>
                          <ul className="list-disc list-inside">
                            {item.generated_content?.steps?.map((step: string, idx: number) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {item.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(item.id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approva
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'rejected')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Rifiuta
                      </button>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                    <p>Creato: {new Date(item.created_at).toLocaleString('it-IT')}</p>
                    {item.approved_at && (
                      <p>Approvato: {new Date(item.approved_at).toLocaleString('it-IT')}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
