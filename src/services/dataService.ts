
import { supabase } from '@/integrations/supabase/client';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: string;
  subject: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizAttempt {
  id?: string;
  user_id?: string;
  score: number;
  total_questions: number;
  subject?: string;
  time_taken?: number;
  completed_at?: string;
}

export interface UserProgress {
  id?: string;
  user_id?: string;
  subject: string;
  questions_answered: number;
  correct_answers: number;
  total_study_time: number;
  streak_days: number;
  last_study_date?: string;
}

export interface FlashcardProgress {
  id?: string;
  card_id: string;
  learned: boolean;
  review_count: number;
  user_id?: string;
  last_reviewed?: string;
}

// Helper function to convert Json to string array for options
const convertOptionsFromJson = (options: any): string[] => {
  if (Array.isArray(options)) {
    return options;
  }
  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Questions API
export const fetchQuestions = async (subject?: string): Promise<Question[]> => {
  let query = supabase.from('questions').select('*');
  
  if (subject) {
    query = query.eq('subject', subject);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
  
  return (data || []).map(item => ({
    ...item,
    options: convertOptionsFromJson(item.options)
  }));
};

export const createQuestion = async (question: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<Question> => {
  const { data, error } = await supabase
    .from('questions')
    .insert([{
      ...question,
      options: JSON.stringify(question.options)
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating question:', error);
    throw error;
  }
  
  return {
    ...data,
    options: convertOptionsFromJson(data.options)
  };
};

export const updateQuestion = async (id: string, updates: Partial<Question>): Promise<Question> => {
  const updateData = updates.options 
    ? { ...updates, options: JSON.stringify(updates.options) }
    : updates;

  const { data, error } = await supabase
    .from('questions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating question:', error);
    throw error;
  }
  
  return {
    ...data,
    options: convertOptionsFromJson(data.options)
  };
};

export const deleteQuestion = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// Quiz attempts API
export const saveQuizAttempt = async (attempt: Omit<QuizAttempt, 'id' | 'completed_at'>): Promise<QuizAttempt> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert([attempt])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving quiz attempt:', error);
    throw error;
  }
  
  return data;
};

export const fetchQuizAttempts = async (userId?: string): Promise<QuizAttempt[]> => {
  let query = supabase.from('quiz_attempts').select('*');
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query.order('completed_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching quiz attempts:', error);
    throw error;
  }
  
  return data || [];
};

// User progress API
export const fetchUserProgress = async (userId?: string, subject?: string): Promise<UserProgress[]> => {
  let query = supabase.from('user_progress').select('*');
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  if (subject) {
    query = query.eq('subject', subject);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
  
  return data || [];
};

export const updateUserProgress = async (progress: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'>): Promise<UserProgress> => {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert([progress], { onConflict: 'user_id,subject' })
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
  
  return data;
};

// Flashcard progress API
export const fetchFlashcardProgress = async (userId?: string): Promise<FlashcardProgress[]> => {
  let query = supabase.from('flashcard_progress').select('*');
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching flashcard progress:', error);
    throw error;
  }
  
  return data || [];
};

export const updateFlashcardProgress = async (progress: Omit<FlashcardProgress, 'id' | 'created_at'>): Promise<FlashcardProgress> => {
  const { data, error } = await supabase
    .from('flashcard_progress')
    .upsert([progress], { onConflict: 'user_id,card_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error updating flashcard progress:', error);
    throw error;
  }
  
  return data;
};

// Admin API
export const makeUserAdmin = async (email: string): Promise<void> => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (profileError || !profile) {
    console.error('Error finding user profile:', profileError);
    throw new Error('User not found');
  }

  const { error } = await supabase
    .from('user_roles')
    .upsert([{ user_id: profile.id, role: 'admin' }], { onConflict: 'user_id,role' });

  if (error) {
    console.error('Error making user admin:', error);
    throw error;
  }
};

// Default export as dataService object for backward compatibility
const dataService = {
  // Questions
  getQuestions: fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  
  // Quiz attempts
  saveQuizAttempt,
  getQuizAttempts: fetchQuizAttempts,
  
  // User progress
  getUserProgress: fetchUserProgress,
  updateUserProgress,
  
  // Flashcard progress
  getFlashcardProgress: fetchFlashcardProgress,
  updateFlashcardProgress,
  
  // Admin functions
  makeUserAdmin
};

export default dataService;
export { dataService };
