import { Box, Typography, Chip, Paper } from '@mui/material';
import { getChipColor } from '@/features/quiz/helpers';
import type { QuizQuestionProgressProps } from '@/features/types';

const QuizQuestionProgress = ({
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  answers
}: QuizQuestionProgressProps) => (
  <Paper sx={{ p: 2, mt: 3 }}>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      Question Progress
    </Typography>

    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      {questions?.map((q, idx) => {
        const isAnswered = answers?.some((a) => a.questionId === q.id);
        const isCurrent = idx === currentQuestionIndex;

        const chipColor = getChipColor(isCurrent, isAnswered);

        return (
          <Chip
            key={q.id}
            label={idx + 1}
            size="small"
            onClick={() => setCurrentQuestionIndex(idx)}
            color={chipColor}
            variant={isCurrent ? 'filled' : 'outlined'}
          />
        );
      })}
    </Box>
  </Paper>
);

export default QuizQuestionProgress;
