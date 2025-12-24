import {
  Card,
  CardContent,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Question, Answer } from '@/types/Quiz';

interface QuizQuestionCardProps {
  currentQuestion: Question;
  currentAnswer: Answer | undefined;
  isLastQuestion: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  isSubmitting: boolean;
  onAnswerChange: (questionId: string, selectedAnswer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const QuizQuestionCard = ({
  currentQuestion,
  currentAnswer,
  isLastQuestion,
  currentQuestionIndex,
  isSubmitting,
  onAnswerChange,
  onPrevious,
  onNext,
  onSubmit
}: QuizQuestionCardProps) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {currentQuestion.questionText}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
      </Typography>

      {/* options */}
      <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
        <RadioGroup
          value={currentAnswer?.selectedAnswer || ''}
          onChange={(e) => onAnswerChange(currentQuestion.id, e.target.value)}
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
          <Button variant="outlined" onClick={onPrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          <Button variant="contained" className="ml-4!" onClick={onNext} disabled={isLastQuestion}>
            Next
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isLastQuestion && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

QuizQuestionCard.displayName = 'QuizQuestionCard';
