# 🧑‍🍳 Malbosca AI Chef - Social Media Agent

Sistema completo di AI Chef chatbot + Agent di generazione automatica contenuti social.

## 🎯 Cosa Fa Questo Progetto

1. **Chatbot AI Chef**: Gli utenti chattano sul sito e chiedono ricette
2. **Salvataggio Automatico**: Tutte le conversazioni vengono salvate su Supabase
3. **Analisi AI**: Un agent analizza le ricette più richieste ogni giorno
4. **Generazione Contenuti**: Crea automaticamente post per Instagram, Facebook, TikTok, X
5. **Dashboard Approvazione**: Tu vedi e approvi i contenuti prima della pubblicazione

---

## 🚀 Setup Veloce (10 minuti)

### 1️⃣ Prerequisiti

- Node.js 18+ installato
- Account Supabase (gratis)
- API Key Anthropic Claude

### 2️⃣ Crea il Database Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un progetto
2. Vai su **SQL Editor** e esegui questo script:

```sql
-- Tabella conversazioni chat
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  parsed_recipes JSONB
);

-- Tabella tracking ricette richieste
CREATE TABLE recipes_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_name TEXT NOT NULL UNIQUE,
  request_count INTEGER DEFAULT 1,
  last_requested TIMESTAMPTZ DEFAULT NOW(),
  ingredients TEXT,
  description TEXT,
  last_conversation_id UUID REFERENCES conversations(id)
);

-- Tabella coda contenuti da approvare
CREATE TABLE content_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes_tracking(id),
  recipe_name TEXT NOT NULL,
  social_platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  generated_content JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  scheduled_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

-- Indici
CREATE INDEX idx_recipes_count ON recipes_tracking(request_count DESC);
CREATE INDEX idx_content_status ON content_queue(status);
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp DESC);

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all" ON conversations FOR ALL USING (true);
CREATE POLICY "Enable all" ON recipes_tracking FOR ALL USING (true);
CREATE POLICY "Enable all" ON content_queue FOR ALL USING (true);
```

3. Vai su **Settings → API** e copia:
   - Project URL
   - Anon key
   - Service role key

### 3️⃣ Ottieni API Key Anthropic

1. Vai su [console.anthropic.com](https://console.anthropic.com)
2. Crea un account (se non ce l'hai)
3. Vai su API Keys
4. Crea una nuova key

### 4️⃣ Installa il Progetto

```bash
# Clona/scarica il progetto
cd malbosca-ai-chef

# Installa dipendenze
npm install

# Copia il file .env.example
cp .env.example .env.local

# Apri .env.local e inserisci le tue credenziali
```

**File `.env.local`:**
```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5️⃣ Avvia in Locale

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

✅ **Il chatbot è pronto!**

---

## 📱 Come Usare

### **Per gli Utenti:**

1. Vai sulla homepage
2. Chatta con l'AI Chef
3. Chiedi ricette con ingredienti bio
4. Ricevi risposte personalizzate

### **Per Te (Admin):**

1. Gli utenti chattano → conversazioni salvate automaticamente
2. Vai su `/dashboard` per vedere i contenuti generati
3. Approva/rifiuta i post social
4. I contenuti approvati sono pronti per la pubblicazione

### **Agent Automatico:**

L'agent analizza le conversazioni ogni giorno. Per eseguirlo manualmente:

```bash
# Opzione 1: Chiamata API
curl http://localhost:3000/api/analyze

# Opzione 2: Esegui script (da creare)
npm run analyze
```

L'agent:
- ✅ Analizza conversazioni ultime 24h
- ✅ Identifica ricette richieste 3+ volte
- ✅ Genera post Instagram, Reel, Facebook, X
- ✅ Salva nella coda di approvazione
- ✅ Ti notifica (da implementare: email)

---

## 🚀 Deploy su Netlify

### 1️⃣ Push su GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TUO_USERNAME/malbosca-ai-chef.git
git push -u origin main
```

### 2️⃣ Deploy su Netlify

1. Vai su [netlify.com](https://netlify.com)
2. Clicca **"Add new site" → "Import an existing project"**
3. Connetti il repository GitHub
4. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Environment variables:** Aggiungi le stesse variabili del `.env.local`
6. Deploy!

### 3️⃣ Configura Cron Job (Analisi Automatica)

Su Netlify, usa **Netlify Functions** per eseguire l'analisi quotidiana:

Crea `netlify/functions/daily-analysis.ts`:

```typescript
import { schedule } from '@netlify/functions'

export const handler = schedule('0 9 * * *', async () => {
  await fetch('https://TUO_SITO.netlify.app/api/analyze', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_SECRET_TOKEN'
    }
  })
  return { statusCode: 200 }
})
```

---

## 📂 Struttura Progetto

```
malbosca-ai-chef/
├── app/
│   ├── page.tsx                    # Homepage con chatbot
│   ├── dashboard/
│   │   └── page.tsx                # Dashboard approvazione contenuti
│   ├── api/
│   │   ├── chat/route.ts           # Endpoint chatbot
│   │   └── analyze/route.ts        # Endpoint agent analisi
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ChatWidget.tsx              # Componente chat UI
├── lib/
│   ├── supabase.ts                 # Client Supabase
│   ├── claude.ts                   # Client Anthropic
│   └── agent.ts                    # Logica AI Agent
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env.local                      # Le tue credenziali
```

---

## 🔧 Funzionalità Implementate

✅ **Chatbot Funzionante**
- Conversazioni in tempo reale
- Memoria conversazione
- Salvataggio automatico su Supabase

✅ **Analisi Ricette**
- Estrazione automatica ricette dalle chat
- Tracking popolarità
- Contatore richieste

✅ **Generazione Contenuti Social**
- Post Instagram con caption + hashtag
- Script Reel Instagram
- Post Facebook long-form
- Thread Twitter/X (da completare)

✅ **Dashboard Approvazione**
- Lista contenuti generati
- Filtri per stato
- Approva/Rifiuta con 1 click

---

## 🎯 Prossimi Passi (Da Implementare)

1. **Sistema Email Notifiche**
   - Quando ci sono nuovi contenuti → email a te
   - Usa Resend, SendGrid, o Brevo

2. **Pubblicazione Automatica**
   - Integrazione API Instagram
   - Integrazione API Facebook
   - Scheduling automatico

3. **Editor Contenuti**
   - Modifica post prima di approvare
   - Preview visuale

4. **Analytics**
   - Statistiche ricette più richieste
   - Performance contenuti social

5. **Autenticazione Admin**
   - Login per dashboard
   - Solo tu puoi approvare

---

## 🐛 Troubleshooting

### "Module not found"
```bash
npm install
```

### "Supabase connection error"
- Verifica le credenziali in `.env.local`
- Controlla che le tabelle esistano
- Verifica le RLS policy

### "Anthropic API error"
- Controlla che l'API key sia valida
- Verifica di avere credito disponibile

### Il chatbot non risponde
- Apri la console del browser (F12)
- Guarda gli errori
- Controlla i log di Next.js nel terminale

---

## 📞 Supporto

Per problemi o domande:
1. Controlla i log nel terminale
2. Guarda la console del browser (F12)
3. Verifica le credenziali in `.env.local`

---

## 🎉 Pronto!

Il tuo AI Chef è pronto per:
- ✅ Chattare con gli utenti
- ✅ Salvare conversazioni
- ✅ Generare contenuti social
- ✅ Dashboard di approvazione

**Prossimo step:** Configura il cron job per l'analisi automatica giornaliera!

---

**Fatto con ❤️ per Malbosca 🌱**
