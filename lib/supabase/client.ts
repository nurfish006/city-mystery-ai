import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  const supabaseUrl =
    typeof window !== "undefined"
      ? window.location.origin.includes("localhost")
        ? process.env.NEXT_PUBLIC_SUPABASE_URL
        : process.env.NEXT_PUBLIC_SUPABASE_URL
      : process.env.NEXT_PUBLIC_SUPABASE_URL

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
