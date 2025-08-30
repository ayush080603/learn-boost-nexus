-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can read user progress" ON public.user_progress;
DROP POLICY IF EXISTS "Anyone can create user progress" ON public.user_progress;
DROP POLICY IF EXISTS "Anyone can update user progress" ON public.user_progress;

-- Drop similar overly permissive policies on other tables
DROP POLICY IF EXISTS "Anyone can read quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Anyone can create quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Anyone can manage flashcard progress" ON public.flashcard_progress;

-- Add secure policies that restrict access to user's own data only
CREATE POLICY "Users can view their own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Add secure policies for quiz_attempts
CREATE POLICY "Users can view their own quiz attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" 
ON public.quiz_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add secure policies for flashcard_progress
CREATE POLICY "Users can view their own flashcard progress" 
ON public.flashcard_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flashcard progress" 
ON public.flashcard_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcard progress" 
ON public.flashcard_progress 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);