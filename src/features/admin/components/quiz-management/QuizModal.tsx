import { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { quizFormSchema } from '@/features/admin/helpers/validator';
import type { QuizModalProps } from '@/features/types';
import type { CreateQuizRequest } from '@/types/Quiz';
import { CATEGORIES, getInitialQuizFormData } from '@/features/admin/helpers';
import Question from '@/features/admin/components/quiz-management/Question';
import AppModal from '@/components/ui/AppModal';

type QuizFormData = z.infer<typeof quizFormSchema>;

const QuizModal = ({ open, quiz, onClose, onSave, isSubmitting = false }: QuizModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    mode: 'onChange'
  });

  const {
    fields: questions,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'questions'
  });

  useEffect(() => {
    reset(getInitialQuizFormData(quiz));
  }, [quiz, open]);

  const addQuestion = () => {
    append({
      id: crypto.randomUUID(),
      questionText: '',
      options: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ],
      correctAnswer: '',
      explanation: '',
      points: 1
    });
  };

  const onSubmit = (data: QuizFormData) => {
    const { title, description, category, difficulty, timeLimit } = data;

    const quizData: CreateQuizRequest = {
      title,
      description,
      category,
      difficulty,
      timeLimit,
      questions: data.questions.map((q) => ({
        type: 'multiple-choice' as const,
        text: q.questionText,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points
      }))
    };

    onSave(quizData);
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={quiz ? 'Edit Quiz' : 'Create New Quiz'}
      maxWidth="md"
      actionLabel={quiz ? 'Update' : 'Create'}
      onConfirm={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* basic info */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Quiz Title"
              fullWidth
              required
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              multiline
              rows={3}
              required
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select {...field} label="Category">
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel>Difficulty</InputLabel>
                <Select {...field} label="Difficulty">
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
                {errors.difficulty && <FormHelperText>{errors.difficulty.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <Controller
            name="timeLimit"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Time Limit (min)"
                type="number"
                fullWidth
                inputProps={{ min: 1 }}
                error={!!errors.timeLimit}
                helperText={errors.timeLimit?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Box>

        {/* questions */}
        <Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6">Questions</Typography>
            <Button startIcon={<AddIcon />} onClick={addQuestion} variant="outlined" size="small">
              Add Question
            </Button>
          </Box>
          {errors.questions && !Array.isArray(errors.questions) && (
            <Typography color="error" variant="caption" sx={{ mb: 2, display: 'block' }}>
              {errors.questions.message}
            </Typography>
          )}

          <Stack spacing={3}>
            {questions.map((question, qIndex) => (
              <Question
                key={question.id}
                question={question}
                qIndex={qIndex}
                control={control}
                errors={errors}
                remove={remove}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </AppModal>
  );
};

export default QuizModal;
