import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Button, Chip, Paper, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { fetchQuizAttemptById } from '@/features/api/quiz';
import useQuizAttempts from '@/features/quiz/hooks/useQuizAttempts';
import APIErrorAlert from '@/layouts/APIErrorAlert';
import LoadingSpinner from '@/components/loader/LoadingSpinner';
import QuestionBreakdown from '@/features/quiz/components/result/QuestionBreakdown';
import type { QuizResult as QuizResultType } from '@/types/Quiz';
import { MaxAttemptsModal, StartQuizModal } from '@/features/quiz/components/modals/quiz';

const QuizResult = () => {
  const { quizId, resultId } = useParams<{ quizId: string; resultId: string }>();

  const [showMaxAttemptsModal, setShowMaxAttemptsModal] = useState(false);
  const [showRetakeConfirmModal, setShowRetakeConfirmModal] = useState(false);
  const navigate = useNavigate();

  const {
    data: result,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quiz-results', resultId],
    queryFn: async ({ queryKey }) => {
      const attempt = await fetchQuizAttemptById(queryKey[1] as string);
      const percentage = attempt.score;
      const passed = attempt.passed;

      return {
        ...attempt,
        quiz: attempt.quiz!,
        percentage,
        passed
      } as QuizResultType;
    },
    enabled: !!resultId
  });
  const { percentage, passed, quiz, correctAnswers, totalQuestions, answers } = result || {};

  // quiz attempts hook
  const { isMaxAttemptsReached, attemptCount, attemptsRemaining } = useQuizAttempts(quiz);

  // retake quiz
  const handleRetakeQuiz = () => {
    if (isMaxAttemptsReached) {
      setShowMaxAttemptsModal(true);
    } else {
      setShowRetakeConfirmModal(true);
    }
  };

  const handleConfirmRetake = () => {
    setShowRetakeConfirmModal(false);
    navigate(`/quiz/${quizId}`);
  };

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading quiz result..." />;
  }

  if (error) {
    return <APIErrorAlert message="No quiz result found." />;
  }

  return (
    <Box>
      <Paper
        sx={{
          p: 4,
          mb: 3,
          textAlign: 'center',
          background: passed
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}
      >
        {passed ? (
          <CheckCircleIcon sx={{ fontSize: 80, mb: 2 }} />
        ) : (
          <CancelIcon sx={{ fontSize: 80, mb: 2 }} />
        )}
        <Typography variant="h3" gutterBottom>
          {passed ? 'Congratulations!' : 'Better Luck Next Time'}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {passed ? 'You passed the quiz!' : "You didn't pass this time"}
        </Typography>
      </Paper>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {quiz?.title}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Score
              </Typography>
              <Typography variant="h4" color="primary">
                {percentage?.toFixed(1)}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Points
              </Typography>
              <Typography variant="h4">
                {correctAnswers} / {totalQuestions}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Questions
              </Typography>
              <Typography variant="h4">{quiz?.questions.length}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={passed ? 'Passed' : 'Failed'}
                color={passed ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* question breakdown */}
      <QuestionBreakdown questions={quiz?.questions} answers={answers} />

      {/* buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="outlined" startIcon={<HomeIcon />} onClick={handleBackToQuizzes}>
          Back to Quizzes
        </Button>
        <Button variant="contained" startIcon={<RestartAltIcon />} onClick={handleRetakeQuiz}>
          Retake Quiz
        </Button>
      </Box>

      {/* modals */}
      <MaxAttemptsModal
        isOpen={showMaxAttemptsModal}
        attemptCount={attemptCount}
        onClose={() => setShowMaxAttemptsModal(false)}
      />
      <StartQuizModal
        isOpen={showRetakeConfirmModal}
        quizTitle={quiz?.title || ''}
        questionCount={quiz?.questions.length || 0}
        timeLimit={quiz?.timeLimit || 0}
        attemptsRemaining={attemptsRemaining}
        onClose={() => setShowRetakeConfirmModal(false)}
        onConfirm={handleConfirmRetake}
      />
    </Box>
  );
};

export default QuizResult;
