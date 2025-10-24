# 🚀 GUIDA RAPIDA - Malbosca AI Chef

## ⚠️ IMPORTANTE: API KEY

**NON utilizzare l'API key che hai condiviso in chat!**

Quella key è stata esposta pubblicamente e deve essere:
1. **Revocata immediatamente** su console.anthropic.com
2. **Sostituita con una nuova key**

---

## 📦 COSA HAI RICEVUTO

Starter kit completo con:
- ✅ Chatbot AI Chef funzionante
- ✅ Integrazione Supabase (salvataggio automatico)
- ✅ Agent AI per analisi ricette
- ✅ Generazione contenuti social automatica
- ✅ Dashboard approvazione
- ✅ Ready per deploy Netlify

---

## 🏃 SETUP IN 5 MINUTI

### STEP 1: Installa
```bash
cd malbosca-ai-chef
npm install
```

### STEP 2: Configura .env.local

Copia `.env.example` in `.env.local` e inserisci:

```env
# 🔑 API KEYS (DA PRENDERE)

# 1. Anthropic (console.anthropic.com → API Keys → Create new)
ANTHROPIC_API_KEY=sk-ant-api03-NUOVA_KEY_QUI

# 2. Supabase (supabase.com → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# 3. App URL (lascia così per local)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### STEP 3: Avvia

```bash
npm run dev
```

Apri: http://localhost:3000

✅ **FUNZIONA!** Il chatbot è pronto!

---

## 🎯 COSA PUOI FARE ADESSO

### 1️⃣ Testa il Chatbot
- Vai su http://localhost:3000
- Chatta con l'AI Chef
- Chiedi: "Ho delle mandorle, cosa posso fare per colazione?"
- Vai su Supabase → Table Editor → conversations
- ✅ Vedi la conversazione salvata!

### 2️⃣ Testa l'Agent AI
```bash
# Apri un nuovo terminale
curl http://localhost:3000/api/analyze
```
- L'agent analizza le conversazioni
- Genera contenuti social
- Vai su http://localhost:3000/dashboard
- ✅ Vedi i contenuti generati!

### 3️⃣ Approva Contenuti
- Dashboard: http://localhost:3000/dashboard
- Clicca "Approva" sui post che ti piacciono
- Quelli approvati sono pronti per pubblicazione

---

## 📝 PROSSIMI STEP

1. **Testa tutto in locale** (oggi)
2. **Push su GitHub** (domani)
3. **Deploy su Netlify** (2 giorni)
4. **Configura cron job** per analisi automatica (3 giorni)
5. **Integra API social** per pubblicazione automatica (1 settimana)

---

## 🆘 PROBLEMI?

### "Module not found"
```bash
npm install
```

### "Cannot connect to Supabase"
- Controlla che hai creato le tabelle (leggi README.md)
- Verifica le credenziali in .env.local

### "Anthropic API error"
- Crea una NUOVA API key (revoca quella vecchia!)
- Verifica di avere credito su Anthropic

### Altro
- Leggi **README.md** completo (ha tutto)
- Controlla console browser (F12)
- Guarda i log nel terminale

---

## 📚 FILE IMPORTANTI

- **README.md** → Documentazione completa
- **.env.example** → Template configurazione
- **app/page.tsx** → Homepage chatbot
- **app/dashboard/page.tsx** → Dashboard admin
- **lib/agent.ts** → Logica AI Agent

---

## ✅ CHECKLIST

Prima di andare in produzione:

- [ ] Revocata vecchia API key Anthropic
- [ ] Creata nuova API key Anthropic
- [ ] Database Supabase creato con tabelle
- [ ] Testato chatbot in locale
- [ ] Testato agent in locale
- [ ] Testato dashboard in locale
- [ ] Push su GitHub
- [ ] Deploy su Netlify
- [ ] Configurato cron job

---

**🎉 HAI TUTTO PRONTO! Segui il README.md per i dettagli.**

**🌱 Buon lavoro con Malbosca!**
