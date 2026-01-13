-- ================================================
-- DEVHUB DATABASE SETUP FOR SUPABASE
-- Run this in the Supabase SQL Editor
-- ================================================

-- 1. Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lab TEXT NOT NULL CHECK (lab IN ('sql', 'python')),
  topic_id TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  exercise_index INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  attempts INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate completions
  UNIQUE(user_id, lab, topic_id, difficulty, exercise_index)
);

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lab ON user_progress(lab);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at ON user_progress(completed_at);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Users can only view their own data
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "Users can delete own progress" ON user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- GOOGLE AUTH SETUP (Do this in Supabase Dashboard)
-- ================================================
-- 1. Go to Authentication > Providers > Google
-- 2. Enable Google provider
-- 3. Add your Google OAuth credentials:
--    - Client ID: from Google Cloud Console
--    - Client Secret: from Google Cloud Console
-- 4. Add redirect URL to Google Console:
--    https://egbcmvknkehyoztmocbt.supabase.co/auth/v1/callback
-- ================================================
