-- OPTIMIZATION SCRIPT FOR USER_PROGRESS
-- This script conflicts with previous policies due to multiple definitions.
-- Running this will clean up duplicates and install a single optimized policy.

-- 1. CLEANUP: Drop all known potential policy names to start fresh.
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON public.user_progress;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.user_progress;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_progress;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.user_progress;

-- 2. OPTIMIZATION: Create a SINGLE policy for all CRUD operations.
-- The use of `(select auth.uid())` wraps the function call, making it stable
-- for the query execution plan, thus resolving the performance warning.
-- "FOR ALL" covers SELECT, INSERT, UPDATE, DELETE in one go.

CREATE POLICY "Users can manage own progress"
ON public.user_progress
FOR ALL
USING (
  user_id = (select auth.uid())
)
WITH CHECK (
  user_id = (select auth.uid())
);

-- 3. VERIFICATION: Ensure RLS is active
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 4. ANALYTICS FIX (If not already applied):
DROP POLICY IF EXISTS "Allow public read access" ON public.analytics_esercizi;
CREATE POLICY "Allow public read access" ON public.analytics_esercizi FOR SELECT USING (true);
ALTER TABLE public.analytics_esercizi ENABLE ROW LEVEL SECURITY;
