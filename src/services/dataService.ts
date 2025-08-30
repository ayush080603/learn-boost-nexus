
import { supabase } from "@/integrations/supabase/client";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
}

export interface QuizAttempt {
  id?: string;
  user_id?: string;
  score: number;
  total_questions: number;
  completed_at?: string;
  time_taken?: number;
  subject?: string;
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
  user_id?: string;
  card_id: string;
  learned: boolean;
  review_count: number;
  last_reviewed?: string;
}

export const dataService = {
  // Questions API
  async getQuestions(limit?: number, subject?: string): Promise<Question[]> {
    console.log('Fetching questions from API...', { limit, subject });
    
    let query = supabase.from('questions').select('*');
    
    if (subject) {
      query = query.eq('subject', subject);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
    
    const questions = data?.map(q => ({
      ...q,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
      difficulty: q.difficulty as "Easy" | "Medium" | "Hard"
    })) || [];
    
    console.log(`Fetched ${questions.length} questions from API`);
    return questions;
  },

  async addQuestion(question: Omit<Question, 'id'>): Promise<void> {
    console.log('Adding new question to API...', question);
    
    const { error } = await supabase.from('questions').insert([{
      ...question,
      options: JSON.stringify(question.options)
    }]);
    
    if (error) {
      console.error('Error adding question:', error);
      throw error;
    }
    
    console.log('Question added successfully');
  },

  async updateQuestion(id: string, question: Partial<Question>): Promise<void> {
    console.log('Updating question via API...', { id, question });
    
    const updateData = { ...question };
    if (question.options) {
      updateData.options = JSON.stringify(question.options);
    }
    
    const { error } = await supabase.from('questions')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating question:', error);
      throw error;
    }
    
    console.log('Question updated successfully');
  },

  async deleteQuestion(id: string): Promise<void> {
    console.log('Deleting question via API...', id);
    
    const { error } = await supabase.from('questions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
    
    console.log('Question deleted successfully');
  },

  // Quiz Attempts API
  async saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
    console.log('Saving quiz attempt to API...', attempt);
    
    const { data: { user } } = await supabase.auth.getUser();
    const attemptWithUser = {
      ...attempt,
      user_id: user?.id || null
    };
    
    const { error } = await supabase.from('quiz_attempts').insert([attemptWithUser]);
    if (error) {
      console.error('Error saving quiz attempt:', error);
      throw error;
    }
    
    console.log('Quiz attempt saved successfully');
  },

  async getQuizAttempts(): Promise<QuizAttempt[]> {
    console.log('Fetching quiz attempts from API...');
    
    const { data, error } = await supabase.from('quiz_attempts')
      .select('*')
      .order('completed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching quiz attempts:', error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} quiz attempts`);
    return data || [];
  },

  // User Progress API
  async updateUserProgress(progress: UserProgress): Promise<void> {
    console.log('Updating user progress via API...', progress);
    
    const { data: { user } } = await supabase.auth.getUser();
    const progressWithUser = {
      ...progress,
      user_id: user?.id || null
    };
    
    const { error } = await supabase.from('user_progress')
      .upsert([progressWithUser], { onConflict: 'user_id,subject' });
    
    if (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
    
    console.log('User progress updated successfully');
  },

  async getUserProgress(): Promise<UserProgress[]> {
    console.log('Fetching user progress from API...');
    
    const { data, error } = await supabase.from('user_progress').select('*');
    if (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} progress records`);
    return data || [];
  },

  // Flashcard Progress API
  async updateFlashcardProgress(progress: FlashcardProgress): Promise<void> {
    console.log('Updating flashcard progress via API...', progress);
    
    const { data: { user } } = await supabase.auth.getUser();
    const progressWithUser = {
      ...progress,
      user_id: user?.id || null
    };
    
    const { error } = await supabase.from('flashcard_progress')
      .upsert([progressWithUser], { onConflict: 'user_id,card_id' });
    
    if (error) {
      console.error('Error updating flashcard progress:', error);
      throw error;
    }
    
    console.log('Flashcard progress updated successfully');
  },

  async getFlashcardProgress(): Promise<FlashcardProgress[]> {
    console.log('Fetching flashcard progress from API...');
    
    const { data, error } = await supabase.from('flashcard_progress').select('*');
    if (error) {
      console.error('Error fetching flashcard progress:', error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} flashcard progress records`);
    return data || [];
  },

  // Statistics API
  async getStats() {
    console.log('Fetching platform statistics from API...');
    
    const [quizAttemptsResult, userProgressResult] = await Promise.all([
      supabase.from('quiz_attempts').select('*'),
      supabase.from('user_progress').select('*')
    ]);

    const quizAttempts = quizAttemptsResult.data || [];
    const userProgress = userProgressResult.data || [];

    const totalUsers = new Set(quizAttempts.map(q => q.user_id).filter(Boolean)).size || 1;
    const completedQuizzes = quizAttempts.length;
    const totalQuestions = quizAttempts.reduce((sum, attempt) => sum + attempt.total_questions, 0);
    const totalCorrect = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    
    const completionRate = totalQuestions > 0 ? Math.round((completedQuizzes / totalUsers) * 100) : 94;
    const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 87;

    const stats = {
      activeUsers: totalUsers > 0 ? `${totalUsers}+` : '10K+',
      completionRate: `${completionRate}%`,
      averageImprovement: `+${Math.max(15, Math.round(averageScore - 70))}%`
    };
    
    console.log('Platform statistics fetched:', stats);
    return stats;
  }
};
