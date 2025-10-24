import { NextRequest, NextResponse } from 'next/server'
import { chatWithClaude, analyzeRecipeFromConversation } from '@/lib/claude'
import { getServiceSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Genera risposta con Claude
    const aiResponse = await chatWithClaude(message, conversationHistory || [])

    // Analizza se c'è una ricetta nella conversazione
    const recipeAnalysis = await analyzeRecipeFromConversation(message, aiResponse)

    // Salva conversazione su Supabase
    const supabase = getServiceSupabase()
    const { data: savedConversation, error: saveError } = await supabase
      .from('conversations')
      .insert({
        user_message: message,
        ai_response: aiResponse,
        session_id: sessionId || null,
        parsed_recipes: recipeAnalysis.hasRecipe ? recipeAnalysis : null,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving conversation:', saveError)
    }

    // Se c'è una ricetta, aggiorna il tracking
    if (recipeAnalysis.hasRecipe && recipeAnalysis.recipeName) {
      await updateRecipeTracking(
        recipeAnalysis.recipeName,
        recipeAnalysis.ingredients || [],
        recipeAnalysis.description || '',
        savedConversation?.id
      )
    }

    return NextResponse.json({
      response: aiResponse,
      hasRecipe: recipeAnalysis.hasRecipe,
      recipeName: recipeAnalysis.recipeName
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateRecipeTracking(
  recipeName: string,
  ingredients: string[],
  description: string,
  conversationId?: string
) {
  const supabase = getServiceSupabase()

  // Controlla se la ricetta esiste già
  const { data: existing } = await supabase
    .from('recipes_tracking')
    .select('*')
    .eq('recipe_name', recipeName)
    .single()

  if (existing) {
    // Incrementa contatore
    await supabase
      .from('recipes_tracking')
      .update({
        request_count: existing.request_count + 1,
        last_requested: new Date().toISOString(),
        last_conversation_id: conversationId || existing.last_conversation_id
      })
      .eq('recipe_name', recipeName)
  } else {
    // Crea nuovo tracking
    await supabase
      .from('recipes_tracking')
      .insert({
        recipe_name: recipeName,
        request_count: 1,
        ingredients: ingredients.join(', '),
        description: description,
        last_requested: new Date().toISOString(),
        last_conversation_id: conversationId || null
      })
  }
}
