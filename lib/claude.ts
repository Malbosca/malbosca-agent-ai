import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function chatWithClaude(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const systemPrompt = `Sei l'AI Chef di Malbosca, esperto in ricette con frutta e verdura biologica italiana.

Il tuo ruolo è:
- Suggerire ricette creative e salutari usando prodotti bio italiani
- Dare consigli su abbinamenti insoliti ma deliziosi
- Essere amichevole, entusiasta e incoraggiante
- Rispondere sempre in italiano
- Fornire ricette dettagliate con ingredienti, preparazione e tempi
- Quando suggerisci una ricetta, includi sempre: nome ricetta, ingredienti, procedimento

Ricorda: Malbosca vende frutta disidratata, noci, semi e prodotti bio. Cerca di suggerire ricette che usano questi ingredienti.`

  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: userMessage
    }
  ]

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages as Anthropic.MessageParam[]
  })

  const textContent = response.content.find(block => block.type === 'text')
  return textContent && 'text' in textContent ? textContent.text : ''
}

export async function analyzeRecipeFromConversation(
  userMessage: string,
  aiResponse: string
): Promise<{
  hasRecipe: boolean
  recipeName?: string
  ingredients?: string[]
  description?: string
}> {
  const analysisPrompt = `Analizza questa conversazione e determina se è stata richiesta/fornita una ricetta specifica.

User: ${userMessage}
Assistant: ${aiResponse}

Rispondi SOLO in formato JSON:
{
  "hasRecipe": true/false,
  "recipeName": "nome della ricetta" (se presente),
  "ingredients": ["lista", "ingredienti"] (se presenti),
  "description": "breve descrizione" (se presente)
}

Se non c'è una ricetta chiara, restituisci {"hasRecipe": false}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: analysisPrompt
    }]
  })

  const textContent = response.content.find(block => block.type === 'text')
  if (!textContent || !('text' in textContent)) {
    return { hasRecipe: false }
  }

  try {
    return JSON.parse(textContent.text)
  } catch {
    return { hasRecipe: false }
  }
}
