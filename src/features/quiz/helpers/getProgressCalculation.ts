import type { Answer, Question } from '@/types/Quiz';

interface ProgressCalculationParams {
  currentQuestionIndex: number;
  questions: Array<Question>;
  answers: Array<Answer>;
}

const getProgressCalculation = ({
  currentQuestionIndex,
  questions,
  answers
}: ProgressCalculationParams) => {
  const isLastQuestion = currentQuestionIndex === questions?.length - 1;

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions?.[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);

  return { isLastQuestion, progress, currentQuestion, currentAnswer };
};

export default getProgressCalculation;
