export type QuestionType = 'multiple-choice' | 'true-false';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  text: string;
  options: Option[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  timeLimit: number;
  passingScore?: number;
  status?: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface Answer {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Answer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  quiz?: Quiz;
}

export interface QuizResult extends QuizAttempt {
  quiz: Quiz;
  percentage: number;
  passed: boolean;
}

export interface CreateQuizRequest {
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  timeLimit: number;
  passingScore?: number;
  questions: Omit<Question, 'id' | 'quizId'>[];
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {
  isPublished?: boolean;
}

export interface SubmitQuizRequest {
  answers: Answer[];
  startedAt?: string;
}

export interface QuizListFilters {
  category?: string;
  difficulty?: Difficulty;
  search?: string;
}

export interface QuizListResponse {
  data?: Quiz[];
  meta_data?: { total_rows?: number };
}

export interface QuizListProps {
  searchQuery: string | null;
  selectedDifficulty: string | null;
  selectedCategory: string | null;
}
