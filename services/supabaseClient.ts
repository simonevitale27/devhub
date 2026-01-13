import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://egbcmvknkehyoztmocbt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYmNtdmtua2VoeW96dG1vY2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTI4MzUsImV4cCI6MjA4Mzg2ODgzNX0.oH5yiyBwUCqjd301CaC3xUt5G2iR1zMkR-UKJM1q5es';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database
export interface UserProgress {
  id?: string;
  user_id: string;
  lab: 'sql' | 'python';
  topic_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  exercise_index: number;
  completed_at?: string;
  attempts: number;
}

export interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}
