export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { runDailyAnalysis } from '@/lib/agent'

export async function GET(request: Request) {
  // Skip durante il build di Netlify
  if (process.env.NETLIFY === 'true' && !process.env.CONTEXT) {
    return NextResponse.json({ 
      success: true, 
      message: 'Skipped during build' 
    })
  }

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