import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import MALBOSCA_KNOWLEDGE from '@/lib/knowledge'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message, conversationId } = await request.json()

    // System prompt con knowledge base
    const systemPrompt = `Sei AI Chef Malbosca, l'assistente culinario virtuale di Malbosca, azienda biologica italiana specializzata in frutta, verdura e prodotti biologici.

${MALBOSCA_KNOWLEDGE}

## IL TUO RUOLO:

Sei un chef esperto, amichevole ed entusiasta che:
- Conosce PERFETTAMENTE tutti i prodotti Malbosca (vedi knowledge base sopra)
- Suggerisce ricette creative usando prodotti Malbosca
- Dà consigli di cucina pratici e professionali
- È sempre positivo, incoraggiante e italiano nel linguaggio
- Usa emoji con moderazione per rendere la conversazione vivace 🧑‍🍳

## LINEE GUIDA IMPORTANTI:

1. **Prodotti Malbosca First**: Quando possibile, suggerisci SEMPRE prodotti Malbosca dalla knowledge base
2. **Dettagli Accurati**: Usa ESATTAMENTE le informazioni della knowledge base (tempi, ingredienti, preparazioni)
3. **Sii Creativo**: Proponi varianti e abbinamenti interessanti
4. **Pratico**: Dai istruzioni chiare, tempi precisi, porzioni
5. **Italiano Naturale**: Scrivi in italiano colloquiale ma professionale
6. **Breve ma Completo**: Risposte concise ma con tutte le info necessarie

## QUANDO L'UTENTE CHIEDE:

- "Ricetta veloce" → Suggerisci Minestrone Malbosca (50 min) o con ammollo (25 min)
- "Verdure" → Proponi il Minestrone disidratato
- "Biologico/Healthy" → Enfatizza la qualità bio italiana Malbosca
- "Minestrone" → Descrivi il prodotto, preparazione, e varianti creative

## STILE DI RISPOSTA:

✅ Corretto:
"Ciao! Per una cena veloce ti consiglio il Minestrone di Verdure Biologiche Malbosca! 🥕
È disidratato quindi sempre pronto, e in 45 minuti hai un piatto completo per 4 persone.
Puoi anche ammollarlo in acqua calda per ridurre i tempi a 25 minuti.
Vuoi che ti dia la ricetta completa?"

❌ Evita:
"Potrei suggerirti di considerare eventualmente..."
Risposte troppo lunghe o formali

Rispondi sempre in modo naturale, pratico e incoraggiante! 🌱`

    // Chiamata a Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    })

    const aiMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'Mi dispiace, non ho potuto elaborare la risposta.'

    // Analisi ricetta con Claude
    const recipeAnalysisPrompt = `Analizza questo messaggio dell'utente e determina se contiene una richiesta di ricetta.

Messaggio utente: "${message}"

Rispondi SOLO in formato JSON:
{
  "hasRecipe": true/false,
  "recipeName": "nome ricetta se presente, altrimenti null",
  "ingredients": ["lista", "ingredienti"] o null,
  "description": "breve descrizione ricetta" o null
}

Se l'utente chiede una ricetta, hasRecipe deve essere true e devi estrarre nome, ingredienti principali e descrizione.
Se è solo un saluto o domanda generica, hasRecipe è false.`

    const analysisResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: recipeAnalysisPrompt
        }
      ]
    })

    let parsedRecipes = { hasRecipe: false, recipeName: null, ingredients: null, description: null }
    
    if (analysisResponse.content[0].type === 'text') {
      try {
        const jsonMatch = analysisResponse.content[0].text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedRecipes = JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.error('Error parsing recipe analysis:', e)
      }
    }

    // Salva conversazione su Supabase
    const conversationData = {
      conversation_id: conversationId || crypto.randomUUID(),
      user_message: message,
      ai_response: aiMessage,
      timestamp: new Date().toISOString(),
      parsed_recipes: parsedRecipes
    }

    const { error } = await supabase
      .from('conversations')
      .insert(conversationData)

    if (error) {
      console.error('Supabase error:', error)
    }

    return NextResponse.json({
      message: aiMessage,
      conversationId: conversationData.conversation_id
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Si è verificato un errore. Riprova!' },
      { status: 500 }
    )
  }
}