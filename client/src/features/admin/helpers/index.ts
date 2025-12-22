import type { QuizFormData } from '@/features/types';
import type { Difficulty } from '@/types/Quiz';

export const difficultyColors: Record<Difficulty, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error'
};

export const CATEGORIES = [
  'Programming',
  'Mathematics',
  'Science',
  'History',
  'Geography',
  'Literature',
  'General Knowledge'
];

export const getInitialQuizFormData = (quiz?: QuizFormData | null) => {
  const {
    title = '',
    description = '',
    category = '',
    difficulty = 'easy',
    timeLimit = 30,
    questions = []
  } = quiz || {};

  return {
    title,
    description,
    category,
    difficulty,
    timeLimit,
    questions: questions.map((q) => ({
      id: q.id,
      questionText: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      points: q.points
    }))
  };
};
