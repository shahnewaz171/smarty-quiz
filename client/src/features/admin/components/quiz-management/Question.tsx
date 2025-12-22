import { z } from 'zod';
import { Controller, useWatch, type Control, type FieldErrors } from 'react-hook-form';
import {
  TextField,
  MenuItem,
  Box,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QuestionOptions from '@/features/admin/components/quiz-management/QuestionOptions';
import { quizFormSchema } from '@/features/admin/helpers/validator';

type QuizFormData = z.infer<typeof quizFormSchema>;

interface QuestionProps {
  question: {
    id: string;
    questionText: string;
    options: { id: string; text: string }[];
    correctAnswer: string;
    explanation?: string;
    points: number;
  };
  qIndex: number;
  control: Control<QuizFormData>;
  errors: FieldErrors<QuizFormData>;
  remove: (index: number) => void;
}

const Question = ({ question, qIndex, control, errors, remove }: QuestionProps) => {
  // watch options for the current question to populate correct answer select
  const watchedOptions = useWatch({
    control,
    name: `questions.${qIndex}.options`
  });

  return (
    <Box
      key={question.id}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2">Question {qIndex + 1}</Typography>
        <IconButton size="small" onClick={() => remove(qIndex)} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Controller
        name={`questions.${qIndex}.questionText` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Question Text"
            fullWidth
            error={!!errors.questions?.[qIndex]?.questionText}
            helperText={errors.questions?.[qIndex]?.questionText?.message}
            sx={{ mb: 2 }}
          />
        )}
      />

      <QuestionOptions control={control} questionIndex={qIndex} errors={errors} />

      <Controller
        name={`questions.${qIndex}.correctAnswer` as const}
        control={control}
        render={({ field }) => (
          <FormControl
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            error={!!errors.questions?.[qIndex]?.correctAnswer}
          >
            <InputLabel>Correct Answer</InputLabel>
            <Select {...field} label="Correct Answer">
              {watchedOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.text || `Option ${watchedOptions.indexOf(option) + 1}`}
                </MenuItem>
              ))}
            </Select>
            {errors.questions?.[qIndex]?.correctAnswer && (
              <FormHelperText>{errors.questions[qIndex]?.correctAnswer?.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Controller
        name={`questions.${qIndex}.explanation` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Explanation (Optional)"
            fullWidth
            size="small"
            multiline
            rows={2}
            sx={{ mb: 1 }}
          />
        )}
      />

      <Controller
        name={`questions.${qIndex}.points` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Points"
            type="number"
            size="small"
            inputProps={{ min: 1 }}
            error={!!errors.questions?.[qIndex]?.points}
            helperText={errors.questions?.[qIndex]?.points?.message}
            sx={{ width: 120 }}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
    </Box>
  );
};

export default Question;
