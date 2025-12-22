import type { CreateQuizRequest, Difficulty, Quiz } from '@/types/Quiz';

export interface AdminQuizzesProps {
  searchQuery: string | null;
  selectedDifficulty: string | null;
  selectedCategory: string | null;
}

export interface MostPopularQuizzesProps {
  mostPopularQuizzes: Array<{
    id: string;
    title: string;
    attempts: number;
  }>;
}

export interface StatisticCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}

export interface UserActivityProps {
  activeUsers: number;
  totalUsers: number;
  recentAttempts: number;
}

export interface QuizStatusProps {
  publishedQuizzes: number;
  unpublishedQuizzes: number;
  totalQuizzes: number;
}

export interface DashboardDetailsProps {
  statistics: {
    activeUsers?: number;
    totalUsers?: number;
    totalQuizzes?: number;
    publishedQuizzes?: number;
    unpublishedQuizzes?: number;
    totalAttempts?: number;
    recentAttempts?: number;
    averageScore?: number;
  };
}

// user quiz attempt related types
export interface QuizFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDifficulty: Difficulty | '';
  setSelectedDifficulty: (value: Difficulty | '') => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

export interface QuizModalProps {
  open: boolean;
  quiz?: Quiz | null;
  onClose: () => void;
  onSave: (quiz: CreateQuizRequest) => void;
  isSubmitting?: boolean;
}

export interface QuizFormData {
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  timeLimit: number;
  questions: Array<{
    id?: string;
    text: string;
    options: Array<{
      id?: string;
      text: string;
    }>;
    correctAnswer: string;
    explanation?: string;
    points: number;
  }>;
}

export interface AdminQuizzesComponentProps extends AdminQuizzesProps {
  onEditQuiz?: (quiz: Quiz) => void;
}

export interface QuizzesResponse {
  data?: Quiz[];
  meta_data?: {
    total_rows?: number;
  };
}

export interface QuizQuestionProgressProps {
  questions: { id: string }[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: { questionId: string }[];
}

// timer hook types
export interface UseQuizTimerProps {
  timeLimitInMinutes: number;
  onTimeUp?: () => void;
}

export interface UseQuizTimerReturn {
  timeRemaining: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  isRunning: boolean;
  formattedTime: string;
}
