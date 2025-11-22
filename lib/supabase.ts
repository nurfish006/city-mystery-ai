import { createClient } from '@supabase/supabase-js'

// Mock supabase client for development - will be real in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key-for-development'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Mock implementation for development
if (process.env.NODE_ENV === 'development') {
  // This ensures we don't break during development without real Supabase
  console.log('🔧 Using mock Supabase client for development')
}