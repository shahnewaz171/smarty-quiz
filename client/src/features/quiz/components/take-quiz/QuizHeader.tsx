import { Box, Typography, Chip, Paper, LinearProgress } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';

interface QuizHeaderProps {
  title: string;
  formattedTime: string;
  timeRemaining: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
}

export const QuizHeader = ({
  title,
  formattedTime,
  timeRemaining,
  currentQuestionIndex,
  totalQuestions,
  progress
}: QuizHeaderProps) => (
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
      Question {currentQuestionIndex + 1} of {totalQuestions}
    </Typography>
  </Paper>
);

QuizHeader.displayName = 'QuizHeader';
