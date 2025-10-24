import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateRecipeImage(
  recipeName: string,
  ingredients: string[],
  description: string
): Promise<string> {
  try {
    const prompt = `Una foto professionale food photography di: ${recipeName}. Ingredienti visibili: ${ingredients.slice(0, 5).join(', ')}. Stile: naturale, luce morbida, sfondo rustico in legno, ingredienti biologici italiani Malbosca. Alta qualità, appetitoso, minimalista, 4K.`

    console.log(`🎨 Generating image for: ${recipeName}`)

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural'
    })

    const imageUrl = response.data[0].url
    console.log(`✅ Image generated: ${imageUrl}`)

    return imageUrl || ''
    
  } catch (error) {
    console.error('❌ Error generating image:', error)
    return ''
  }
}