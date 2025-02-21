import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://phcycaybazfxglbamqzt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY3ljYXliYXpmeGdsYmFtcXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4Mjg2OTIsImV4cCI6MjA1NTQwNDY5Mn0.v9IvIo4FkWaz7QtGCXDeULdBotbNLctqUhVFScD8enY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});