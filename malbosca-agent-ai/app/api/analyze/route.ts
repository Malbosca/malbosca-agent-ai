import { NextRequest, NextResponse } from 'next/server'
import { runDailyAnalysis } from '@/lib/agent'

export async function POST(request: NextRequest) {
  try {
    // Verifica token di sicurezza (opzionale ma consigliato)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET || 'your-secret-token'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🚀 Running daily analysis...')
    const recipes = await runDailyAnalysis()

    return NextResponse.json({
      success: true,
      message: 'Daily analysis completed',
      recipesAnalyzed: recipes.length,
      recipes: recipes
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

// Endpoint GET per testare manualmente
export async function GET() {
  try {
    console.log('🧪 Running manual analysis...')
    const recipes = await runDailyAnalysis()

    return NextResponse.json({
      success: true,
      message: 'Manual analysis completed',
      recipesAnalyzed: recipes.length,
      recipes: recipes
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
