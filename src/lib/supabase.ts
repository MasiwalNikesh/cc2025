import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Database features will be disabled.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: false
    }
  }
)

// Database types
export interface VisitorSubmission {
  id?: string
  name: string
  email: string
  company: string
  phone: string
  designation?: string
  context: 'consultation' | 'quote'
  created_at?: string
}

export interface FeedbackSubmission {
  id?: string
  rating: number
  comments?: string
  created_at?: string
}

// Helper functions
export async function saveVisitorSubmission(data: VisitorSubmission) {
  const { data: result, error } = await supabase
    .from('visitor_submissions')
    .insert([data])
    .select()

  if (error) throw error
  return result
}

export async function saveFeedbackSubmission(data: FeedbackSubmission) {
  const { data: result, error } = await supabase
    .from('feedback_submissions')
    .insert([data])
    .select()

  if (error) throw error
  return result
}
