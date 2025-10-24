import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Chef Malbosca - Ricette Bio Personalizzate',
  description: 'Il tuo chef AI personale per ricette creative con frutta e verdura biologica italiana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
