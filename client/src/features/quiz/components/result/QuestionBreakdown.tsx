import { Box, Card, CardContent, Typography, Chip, Paper, Divider, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { Answer, Question } from '@/types/Quiz';

interface QuestionBreakdownProps {
  questions?: Question[];
  answers?: Answer[];
}

const QuestionBreakdown = ({ questions, answers }: QuestionBreakdownProps) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Question Breakdown
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* question breakdown */}
      {questions?.map((question, idx) => {
        const { id, correctAnswer, options, text, explanation } = question;

        const userAnswer = answers?.find((a) => a.questionId === id);
        const isCorrect = userAnswer?.selectedAnswer === correctAnswer;
        const selectedOption = options?.find((opt) => opt.id === userAnswer?.selectedAnswer);
        const correctOption = options?.find((opt) => opt.id === correctAnswer);

        return (
          <Paper key={id} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Question {idx + 1}
              </Typography>
              <Chip
                icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                label={isCorrect ? 'Correct' : 'Incorrect'}
                size="small"
                color={isCorrect ? 'success' : 'error'}
              />
            </Box>

            <Typography variant="body1" gutterBottom>
              {text}
            </Typography>

            <Stack spacing={1} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Your answer:
                </Typography>
                <Typography
                  variant="body1"
                  color={isCorrect ? 'success.main' : 'error.main'}
                  fontWeight="medium"
                >
                  {selectedOption?.text || 'Not answered'}
                </Typography>
              </Box>

              {!isCorrect && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Correct answer:
                  </Typography>
                  <Typography variant="body1" color="success.main" fontWeight="medium">
                    {correctOption?.text}
                  </Typography>
                </Box>
              )}

              {explanation && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Explanation:
                  </Typography>
                  <Typography variant="body2">{explanation}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        );
      })}
    </CardContent>
  </Card>
);

export default QuestionBreakdown;
