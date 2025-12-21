import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Paper
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { fetchQuizById, submitQuiz } from '@/features/api/quiz';
import { showNotification } from '@/lib/sonner';
import getProgressCalculation from '@/features/quiz/helpers/getProgressCalculation';
import QuizQuestionProgress from '@/features/quiz/components/take-quiz/QuizQuestionProgress';
import useQuizTimer from '@/features/quiz/hooks/useQuizTimer';
import LoadingSpinner from '@/components/loader/LoadingSpinner';
import APIErrorAlert from '@/layouts/APIErrorAlert';
import type { Answer, QuizResult } from '@/types/Quiz';

const QuizTaking = () => {
  // params
  const { quizId } = useParams<{ quizId: string }>();

  // state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // quiz details
  const {
    data: quiz,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quizzes', 'detail', quizId],
    queryFn: ({ queryKey }) => fetchQuizById(queryKey[2] as string),
    enabled: !!quizId,
    staleTime: 10 * 60 * 1000
  });
  const { id: quiz_id, title, timeLimit, questions = [] } = quiz || {};

  // submit quiz mutation
  const handleSubmitQuiz = () => {
    if (!quiz_id) return;

    submitQuizMutation.mutate(
      { quizId: quiz_id, data: { answers } },
      {
        onSuccess: (result) => {
          navigate(`/quiz/${quiz_id}/result/${result.id}`);
        }
      }
    );
  };

  // web worker timer
  const { timeRemaining, formattedTime, startTimer, isRunning } = useQuizTimer({
    timeLimitInMinutes: timeLimit || 5,
    onTimeUp: () => {
      handleSubmitQuiz();
    }
  });

  // start timer on quiz load
  useEffect(() => {
    if (quiz_id && !isRunning && timeRemaining > 0) {
      startTimer();
    }
  }, [quiz_id, isRunning, startTimer, timeRemaining]);

  // submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: async ({ quizId: id, data }: { quizId: string; data: { answers: Answer[] } }) => {
      const attempt = await submitQuiz(id, data);
      const percentage = attempt.score;
      const passed = attempt.passed;

      if (!attempt.quiz) {
        throw new Error('Quiz data not included in response');
      }

      return {
        ...attempt,
        quiz: attempt.quiz,
        percentage,
        passed
      } as QuizResult;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
      queryClient.setQueryData(['quiz-results', result.id], result);
    },
    onError: (err) => {
      showNotification(`Error submitting quiz: ${err.message}`, 'error');
    }
  });

  const handleAnswerChange = (questionId: string, selectedAnswer: string) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, selectedAnswer };
        return updated;
      }
      return [...prev, { questionId, selectedAnswer }];
    });
  };

  const handleNext = () => {
    if (quiz_id && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading quiz..." />;
  }

  if (error) {
    return <APIErrorAlert message="Failed to load quiz. Please try again." />;
  }

  // progress calculation
  const { isLastQuestion, progress, currentQuestion, currentAnswer } = getProgressCalculation({
    currentQuestionIndex,
    questions,
    answers
  });

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">{title}</Typography>
          <Chip
            icon={<TimerIcon />}
            label={formattedTime}
            color={timeRemaining < 60 ? 'error' : 'primary'}
          />
        </Box>
        <LinearProgress variant="determinate" value={progress} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>
      </Paper>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currentQuestion.text}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
          </Typography>

          {/* options */}
          <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
            <RadioGroup
              value={currentAnswer?.selectedAnswer || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    px: 2,
                    py: 1,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Box>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                className="!ml-4"
                onClick={handleNext}
                disabled={isLastQuestion}
              >
                Next
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {isLastQuestion && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleSubmitQuiz}
                  disabled={submitQuizMutation.isPending}
                >
                  {submitQuizMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* question progress */}
      <QuizQuestionProgress
        questions={questions}
        answers={answers}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    </Box>
  );
};

export default QuizTaking;
