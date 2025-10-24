import { getServiceSupabase } from './supabase'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface RecipeAnalysis {
  recipeName: string
  requestCount: number
  ingredients: string[]
  description: string
}

/**
 * Analizza le conversazioni recenti e identifica le ricette più richieste
 */
export async function analyzeRecentConversations(hoursBack: number = 24): Promise<RecipeAnalysis[]> {
  const supabase = getServiceSupabase()
  
  const cutoffDate = new Date()
  cutoffDate.setHours(cutoffDate.getHours() - hoursBack)

  // Ottieni conversazioni recenti
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')
    .gte('timestamp', cutoffDate.toISOString())
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }

  // Analizza ogni conversazione per estrarre ricette
  const recipeMap = new Map<string, RecipeAnalysis>()

  for (const conv of conversations || []) {
    if (conv.parsed_recipes && conv.parsed_recipes.hasRecipe) {
      const recipeName = conv.parsed_recipes.recipeName
      
      if (recipeMap.has(recipeName)) {
        const existing = recipeMap.get(recipeName)!
        existing.requestCount++
      } else {
        recipeMap.set(recipeName, {
          recipeName: recipeName,
          requestCount: 1,
          ingredients: conv.parsed_recipes.ingredients || [],
          description: conv.parsed_recipes.description || ''
        })
      }
    }
  }

  // Aggiorna la tabella recipes_tracking
  for (const [recipeName, analysis] of recipeMap) {
    await upsertRecipeTracking(recipeName, analysis)
  }

  // Restituisci ricette ordinate per popolarità
  return Array.from(recipeMap.values())
    .sort((a, b) => b.requestCount - a.requestCount)
}

/**
 * Aggiorna o inserisce il tracking di una ricetta
 */
async function upsertRecipeTracking(recipeName: string, analysis: RecipeAnalysis) {
  const supabase = getServiceSupabase()

  const { data: existing } = await supabase
    .from('recipes_tracking')
    .select('*')
    .eq('recipe_name', recipeName)
    .single()

  if (existing) {
    // Aggiorna contatore
    await supabase
      .from('recipes_tracking')
      .update({
        request_count: existing.request_count + analysis.requestCount,
        last_requested: new Date().toISOString()
      })
      .eq('recipe_name', recipeName)
  } else {
    // Inserisci nuova ricetta
    await supabase
      .from('recipes_tracking')
      .insert({
        recipe_name: recipeName,
        request_count: analysis.requestCount,
        ingredients: analysis.ingredients.join(', '),
        description: analysis.description,
        last_requested: new Date().toISOString()
      })
  }
}

/**
 * Genera contenuti social per una ricetta popolare
 */
export async function generateSocialContent(
  recipeName: string,
  ingredients: string[],
  description: string,
  recipeId: string
) {
  const contents = []

  // Instagram Post
  const instagramPost = await generateInstagramPost(recipeName, ingredients, description)
  contents.push({
    recipe_id: recipeId,
    recipe_name: recipeName,
    social_platform: 'instagram',
    content_type: 'post',
    generated_content: instagramPost
  })

  // Instagram Reel Script
  const reelScript = await generateReelScript(recipeName, ingredients, description)
  contents.push({
    recipe_id: recipeId,
    recipe_name: recipeName,
    social_platform: 'instagram',
    content_type: 'reel',
    generated_content: reelScript
  })

  // Facebook Post
  const facebookPost = await generateFacebookPost(recipeName, ingredients, description)
  contents.push({
    recipe_id: recipeId,
    recipe_name: recipeName,
    social_platform: 'facebook',
    content_type: 'post',
    generated_content: facebookPost
  })

  // Salva nella coda
  const supabase = getServiceSupabase()
  await supabase.from('content_queue').insert(contents)

  return contents
}

async function generateInstagramPost(recipeName: string, ingredients: string[], description: string) {
  const prompt = `Crea un post Instagram accattivante per questa ricetta bio:

Ricetta: ${recipeName}
Ingredienti: ${ingredients.join(', ')}
Descrizione: ${description}

Genera in formato JSON:
{
  "caption": "testo del post (max 150 parole, emozionale, con emoji)",
  "hashtags": ["lista", "di", "hashtag", "rilevanti"] (max 15),
  "cta": "call to action finale"
}

Tono: Naturale, salutista, italiano, entusiasta. Menziona Malbosca come fonte di ingredienti bio.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  })

  const textContent = response.content.find(block => block.type === 'text')
  if (textContent && 'text' in textContent) {
    try {
      return JSON.parse(textContent.text)
    } catch {
      return { caption: textContent.text, hashtags: [], cta: '' }
    }
  }
  return null
}

async function generateReelScript(recipeName: string, ingredients: string[], description: string) {
  const prompt = `Crea uno script per Reel Instagram (30 secondi) per questa ricetta:

Ricetta: ${recipeName}
Ingredienti: ${ingredients.join(', ')}
Descrizione: ${description}

Genera in formato JSON:
{
  "hook": "frase d'apertura catchy (3-5 secondi)",
  "steps": ["step 1", "step 2", "step 3"] (ognuno 5-7 secondi),
  "outro": "chiusura con CTA",
  "onScreenText": ["testo", "da", "mostrare", "sullo", "schermo"],
  "music": "suggerimento musica/mood"
}

Stile: Veloce, dinamico, visual-first. Perfetto per ricetta rapida e appetitosa.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }]
  })

  const textContent = response.content.find(block => block.type === 'text')
  if (textContent && 'text' in textContent) {
    try {
      return JSON.parse(textContent.text)
    } catch {
      return { hook: '', steps: [], outro: '', onScreenText: [], music: '' }
    }
  }
  return null
}

async function generateFacebookPost(recipeName: string, ingredients: string[], description: string) {
  const prompt = `Crea un post Facebook lungo e coinvolgente per questa ricetta bio:

Ricetta: ${recipeName}
Ingredienti: ${ingredients.join(', ')}
Descrizione: ${description}

Genera in formato JSON:
{
  "title": "titolo accattivante",
  "body": "testo lungo (200-300 parole) con storytelling, benefici, consigli",
  "cta": "call to action",
  "tags": ["suggerimenti", "di", "tag"]
}

Tono: Caldo, familiare, educational. Racconta la storia della ricetta, i benefici degli ingredienti bio.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }]
  })

  const textContent = response.content.find(block => block.type === 'text')
  if (textContent && 'text' in textContent) {
    try {
      return JSON.parse(textContent.text)
    } catch {
      return { title: '', body: textContent.text, cta: '', tags: [] }
    }
  }
  return null
}

/**
 * Funzione principale da eseguire quotidianamente (cron job)
 */
export async function runDailyAnalysis() {
  console.log('🤖 Starting daily analysis...')
  
  // 1. Analizza conversazioni ultime 24h
  const recipes = await analyzeRecentConversations(24)
  console.log(`📊 Found ${recipes.length} recipes`)

  // 2. Per ricette con 3+ richieste, genera contenuti
  const supabase = getServiceSupabase()
  
  for (const recipe of recipes) {
    if (recipe.requestCount >= 3) {
      console.log(`✨ Generating content for: ${recipe.recipeName} (${recipe.requestCount} requests)`)
      
      // Ottieni ID ricetta dal tracking
      const { data: trackingData } = await supabase
        .from('recipes_tracking')
        .select('id')
        .eq('recipe_name', recipe.recipeName)
        .single()

      if (trackingData) {
        await generateSocialContent(
          recipe.recipeName,
          recipe.ingredients,
          recipe.description,
          trackingData.id
        )
      }
    }
  }

  console.log('✅ Daily analysis complete!')
  return recipes
}
