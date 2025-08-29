
-- Create questions table for dynamic quiz questions
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of answer options
  correct_answer INTEGER NOT NULL, -- Index of correct answer
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  subject TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz attempts table to track user quiz sessions
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users, -- nullable for anonymous users
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  time_taken INTEGER, -- in seconds
  subject TEXT
);

-- Create user progress table to track learning progress
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users, -- nullable for anonymous users
  subject TEXT NOT NULL,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_study_time INTEGER NOT NULL DEFAULT 0, -- in minutes
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_study_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject)
);

-- Create flashcard progress table
CREATE TABLE public.flashcard_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users, -- nullable for anonymous users
  card_id TEXT NOT NULL, -- reference to hardcoded flashcard IDs
  learned BOOLEAN NOT NULL DEFAULT false,
  review_count INTEGER NOT NULL DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample questions to expand the quiz
INSERT INTO public.questions (question, options, correct_answer, explanation, difficulty, subject) VALUES
('What is the main purpose of React hooks?', 
 '["To replace class components entirely", "To manage state and lifecycle in functional components", "To improve performance only", "To handle routing"]', 
 1, 
 'React hooks allow you to use state and other React features in functional components without writing a class.', 
 'Medium', 'React'),

('Which HTTP method is idempotent?', 
 '["POST", "PUT", "PATCH", "DELETE"]', 
 1, 
 'PUT is idempotent because making the same PUT request multiple times will have the same effect as making it once.', 
 'Hard', 'Web Development'),

('What does SQL stand for?', 
 '["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"]', 
 0, 
 'SQL stands for Structured Query Language, used for managing relational databases.', 
 'Easy', 'Database'),

('What is the difference between let and const in JavaScript?', 
 '["No difference", "let is block-scoped, const is function-scoped", "const creates immutable variables, let creates mutable variables", "let is newer than const"]', 
 2, 
 'const creates variables that cannot be reassigned, while let creates variables that can be reassigned. Both are block-scoped.', 
 'Easy', 'JavaScript'),

('What is a JOIN in SQL?', 
 '["A way to combine data from multiple tables", "A way to sort data", "A way to filter data", "A way to update data"]', 
 0, 
 'A JOIN clause is used to combine rows from two or more tables, based on a related column between them.', 
 'Medium', 'Database'),

('What is the virtual DOM in React?', 
 '["A real DOM element", "A JavaScript representation of the real DOM", "A CSS framework", "A database"]', 
 1, 
 'The virtual DOM is a JavaScript representation of the real DOM kept in memory and synced with the real DOM.', 
 'Medium', 'React'),

('Which CSS property is used for flexbox?', 
 '["display: flex", "flex: true", "flexbox: on", "layout: flex"]', 
 0, 
 'The display: flex property is used to create a flex container and enable flexbox layout.', 
 'Easy', 'CSS'),

('What is the purpose of an API?', 
 '["To style web pages", "To store data", "To allow communication between software applications", "To create databases"]', 
 2, 
 'An API (Application Programming Interface) allows different software applications to communicate with each other.', 
 'Easy', 'Web Development'),

('What is a React component?', 
 '["A CSS file", "A reusable piece of UI", "A database table", "A server function"]', 
 1, 
 'A React component is a reusable piece of UI that can accept props and return JSX.', 
 'Easy', 'React'),

('What does CRUD stand for?', 
 '["Create, Read, Update, Delete", "Copy, Run, Upload, Download", "Connect, Request, Upload, Deploy", "Code, Review, Update, Debug"]', 
 0, 
 'CRUD stands for Create, Read, Update, Delete - the four basic operations for persistent storage.', 
 'Medium', 'Database');

-- Enable Row Level Security (tables are public for now since no auth is implemented)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (will be updated when auth is added)
CREATE POLICY "Anyone can read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Anyone can create quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read quiz attempts" ON public.quiz_attempts FOR SELECT USING (true);
CREATE POLICY "Anyone can create user progress" ON public.user_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update user progress" ON public.user_progress FOR UPDATE USING (true);
CREATE POLICY "Anyone can read user progress" ON public.user_progress FOR SELECT USING (true);
CREATE POLICY "Anyone can manage flashcard progress" ON public.flashcard_progress FOR ALL USING (true);
