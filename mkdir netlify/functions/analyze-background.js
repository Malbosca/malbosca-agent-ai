const { schedule } = require('@netlify/functions')

exports.handler = async (event, context) => {
  // Importa le funzioni necessarie
  const fetch = require('node-fetch')
  
  const apiUrl = process.env.URL || 'https://sage-naiad-9e7a4e.netlify.app'
  
  try {
    console.log('🤖 Starting scheduled analysis...')
    
    // Chiama l'API di analisi
    const response = await fetch(`${apiUrl}/api/analyze`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    console.log('✅ Analysis completed:', data)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Analysis completed',
        data: data
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    }
  }
}
