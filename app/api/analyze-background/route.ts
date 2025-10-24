import { NextResponse } from 'next/server'
import { runDailyAnalysis } from '@/lib/agent'

export const maxDuration = 300 // 5 minuti

export async function GET(request: Request) {
  try {
    console.log('🤖 Starting background analysis...')
    
    const recipes = await runDailyAnalysis()
    
    return NextResponse.json({
      success: true,
      message: 'Analysis completed',
      recipesAnalyzed: recipes.length,
      recipes: recipes
    })
    
  } catch (error: any) {
    console.error('❌ Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}