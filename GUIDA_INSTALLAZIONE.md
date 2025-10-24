# 🎯 GUIDA SEMPLICISSIMA - AGENT AI MALBOSCA

## 📦 HAI RICEVUTO 2 CARTELLE:

1. **malbosca-chatbot-modified** 
   → Aggiorna il chatbot esistente (leggi ISTRUZIONI_CHATBOT.md)

2. **malbosca-agent-ai** (questa!)
   → L'Agent AI che genera i post social

---

## 🚀 INSTALLAZIONE AGENT AI (10 MINUTI):

### **STEP 1: Apri la cartella del progetto**

1. **Trova** la cartella `malbosca-agent-ai` sul desktop
2. **Tasto destro** sulla cartella
3. Clicca **"Apri con Code"** (Visual Studio Code)
4. Si apre Visual Studio Code con il progetto

---

### **STEP 2: Apri il Terminale in Visual Studio Code**

1. In Visual Studio Code, guarda il menu in alto
2. Clicca su **"Terminal"**
3. Clicca su **"New Terminal"**
4. Si apre una finestra nera in basso (il terminale)

---

### **STEP 3: Inserisci la tua API Key Anthropic**

1. Nel pannello a sinistra, vedi i file del progetto
2. **Clicca** sul file `.env.local`
3. Si apre il file
4. **Trova** la riga: `ANTHROPIC_API_KEY=TUA_API_KEY_ANTHROPIC_QUI`
5. **Sostituisci** `TUA_API_KEY_ANTHROPIC_QUI` con la tua vera API key
6. **Esempio:**
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
   ```
7. **Salva** il file (Ctrl+S o Cmd+S su Mac)

---

### **STEP 4: Installa il progetto**

Nel terminale (la finestra nera in basso), **scrivi**:

```bash
npm install
```

**Premi INVIO**

Aspetta 2-3 minuti... vedrai scorrere tante righe. È normale! ✅

Quando finisce, vedrai qualcosa tipo:
```
added 234 packages in 2m
```

---

### **STEP 5: Avvia il progetto**

Nel terminale, **scrivi**:

```bash
npm run dev
```

**Premi INVIO**

Vedrai:
```
ready - started server on 0.0.0.0:3000
```

✅ **PERFETTO! IL PROGETTO È PARTITO!**

---

### **STEP 6: Apri nel browser**

1. **Apri il browser** (Chrome, Edge, Firefox...)
2. **Vai su:** http://localhost:3000
3. 🎉 **Vedrai il chatbot di test!**

---

### **STEP 7: Testa l'Agent AI**

**OPZIONE A - Manuale (per testare):**

1. Nel browser, vai su: http://localhost:3000/api/analyze
2. Aspetta 10-20 secondi
3. Vedrai un JSON con i risultati
4. Poi vai su: http://localhost:3000/dashboard
5. 🎉 **Vedrai i post generati dall'AI!**

**OPZIONE B - Dashboard diretta:**

1. Nel browser, vai su: http://localhost:3000/dashboard
2. Vedi la lista dei contenuti generati
3. Clicca **"Approva"** su quelli che ti piacciono
4. Clicca **"Rifiuta"** su quelli che non vuoi

---

## 🎯 COSA FA L'AGENT AI:

### **Automaticamente:**
1. ✅ Legge le conversazioni dal chatbot (salvate su Supabase)
2. ✅ Trova le ricette più richieste (3+ volte)
3. ✅ Genera POST per ogni social:
   - Instagram (post + reel)
   - Facebook (post lungo)
   - TikTok (script video)
   - Twitter/X (thread)
4. ✅ Li mette nella **Dashboard** per te
5. ✅ TU approvi/rifiuti
6. ✅ Quelli approvati → pubblicazione automatica

---

## 📱 DASHBOARD - COME USARLA:

### **URL:** http://localhost:3000/dashboard

**Cosa vedi:**
- Lista di tutti i post generati
- Filtri: Tutti / In Attesa / Approvati / Rifiutati
- Per ogni post:
  - 📸 Anteprima contenuto
  - 📝 Caption e hashtag
  - ✅ Bottone "Approva"
  - ❌ Bottone "Rifiuta"

**Cosa fare:**
1. Leggi il post
2. Se ti piace → **Approva** ✅
3. Se non ti piace → **Rifiuta** ❌
4. I post approvati sono pronti per pubblicazione

---

## 🔄 ESEGUIRE L'ANALISI MANUALMENTE:

Ogni volta che vuoi generare nuovi post:

**METODO 1 - Browser:**
- Vai su: http://localhost:3000/api/analyze
- Aspetta la risposta
- Vai su dashboard per vedere i nuovi post

**METODO 2 - Terminale:**
Nel terminale di Visual Studio Code, scrivi:
```bash
curl http://localhost:3000/api/analyze
```

---

## ⏰ AUTOMATIZZARE (dopo i test):

Quando sei pronto, puoi impostare:
- **Cron job** che esegue l'analisi ogni giorno alle 9:00
- **Email automatiche** quando ci sono nuovi post
- **Pubblicazione automatica** sui social

(Ti spiego dopo come fare, prima testiamo tutto!)

---

## 🆘 PROBLEMI COMUNI:

### "Errore: Cannot find module"
→ Hai dimenticato `npm install`
→ Rifai lo STEP 4

### "Port 3000 already in use"
→ C'è già qualcosa sulla porta 3000
→ Chiudi altri programmi o usa: `npm run dev -- -p 3001`

### "Supabase connection error"
→ Controlla che il file `.env.local` sia salvato
→ Verifica che le credenziali siano corrette

### "Non vedo contenuti nella dashboard"
→ Prima devi far girare l'analisi: http://localhost:3000/api/analyze
→ Assicurati di avere conversazioni su Supabase

---

## ✅ CHECKLIST INSTALLAZIONE:

- [ ] Cartella aperta in Visual Studio Code
- [ ] File `.env.local` modificato con API key Anthropic
- [ ] Eseguito `npm install` (senza errori)
- [ ] Eseguito `npm run dev` (server partito)
- [ ] Aperto http://localhost:3000 (vedo il chatbot)
- [ ] Aperto http://localhost:3000/dashboard (vedo la dashboard)
- [ ] Eseguita analisi manuale (http://localhost:3000/api/analyze)
- [ ] Vedo i post generati nella dashboard

---

## 🎉 QUANDO HAI FINITO:

Scrivi: "✅ Agent AI funziona! Vedo i post nella dashboard!"

E ti spiego:
1. Come generare immagini AI per i post
2. Come automatizzare la pubblicazione
3. Come impostare il cron job giornaliero

---

## 📞 HAI BISOGNO DI AIUTO?

**Problemi tecnici?**
- Fai uno screenshot dell'errore
- Mandamelo
- Ti guido passo passo

**Non ti lasciamo solo!** 💪

---

**Fatto con ❤️ per Malbosca 🌱**
