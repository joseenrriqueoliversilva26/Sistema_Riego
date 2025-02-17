import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jiwevpepvmlrajgxhfda.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imppd2V2cGVwdm1scmFqZ3hoZmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDQ2NjksImV4cCI6MjA1NTA4MDY2OX0.sqw2BBGfZq90wOyZGuJ9oTNuoUeNoqDzDInYCMazE2s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});