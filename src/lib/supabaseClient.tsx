import { createClient } from "@supabase/supabase-js"

// URL del proyecto Supabase y clave anónima (API)
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
