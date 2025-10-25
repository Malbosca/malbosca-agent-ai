import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that need elevated permissions
export function getServiceSupabase() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Types for our database tables
export interface Conversation {
  id: string
  user_message: string
  ai_response: string
  timestamp: string
  session_id: string | null
  parsed_recipes: any | null
}

export interface RecipeTracking {
  id: string
  recipe_name: string
  request_count: number
  last_requested: string
  ingredients: string | null
  description: string | null
  last_conversation_id: string | null
}

export interface ContentQueue {
  id: string
  recipe_id: string | null
  recipe_name: string
  social_platform: 'instagram' | 'facebook' | 'tiktok' | 'x'
  content_type: 'post' | 'reel' | 'story' | 'thread'
  generated_content: {
    caption?: string
    hashtags?: string[]
    hook?: string
    steps?: string[]
    image_url?: string
    [key: string]: any
  }
  status: 'pending' | 'approved' | 'rejected' | 'published'
  scheduled_date: string | null
  created_at: string
  approved_at: string | null
  published_at: string | null
}