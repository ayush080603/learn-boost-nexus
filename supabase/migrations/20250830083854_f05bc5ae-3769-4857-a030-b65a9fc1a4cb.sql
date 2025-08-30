-- Check what policies currently exist
SELECT policyname, tablename FROM pg_policies WHERE tablename IN ('user_progress', 'quiz_attempts', 'flashcard_progress');

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_progress;

DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON public.quiz_attempts;

DROP POLICY IF EXISTS "Users can view their own flashcard progress" ON public.flashcard_progress;
DROP POLICY IF EXISTS "Users can insert their own flashcard progress" ON public.flashcard_progress;
DROP POLICY IF EXISTS "Users can update their own flashcard progress" ON public.flashcard_progress;

-- Now create the correct secure policies
CREATE POLICY "secure_user_progress_select" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "secure_user_progress_insert" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "secure_user_progress_update" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "secure_quiz_attempts_select" 
ON public.quiz_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "secure_quiz_attempts_insert" 
ON public.quiz_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "secure_flashcard_progress_select" 
ON public.flashcard_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "secure_flashcard_progress_insert" 
ON public.flashcard_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "secure_flashcard_progress_update" 
ON public.flashcard_progress 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);