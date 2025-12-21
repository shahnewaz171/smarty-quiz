import { z } from 'zod';
import { useFieldArray, Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Button, TextField, Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { quizFormSchema } from '@/features/admin/helpers/validator';

type QuizFormData = z.infer<typeof quizFormSchema>;

const QuestionOptions = ({
  control,
  questionIndex,
  errors
}: {
  control: Control<QuizFormData>;
  questionIndex: number;
  errors: FieldErrors<QuizFormData>;
}) => {
  const {
    fields: options,
    append,
    remove
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`
  });

  const addOption = () => {
    append({ id: crypto.randomUUID(), text: '' });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Options
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={addOption}>
          Add Option
        </Button>
      </Box>

      {/* validation error */}
      {errors.questions?.[questionIndex]?.options &&
        !Array.isArray(errors.questions[questionIndex].options) && (
          <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>
            {errors.questions[questionIndex].options.message}
          </Typography>
        )}

      {/* options */}
      {options?.map((option, oIndex) => {
        const fieldName = `questions.${questionIndex}.options.${oIndex}.text` as const;

        return (
          <Box key={option.id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  placeholder={`Option ${oIndex + 1}`}
                  error={!!errors.questions?.[questionIndex]?.options?.[oIndex]?.text}
                  helperText={errors.questions?.[questionIndex]?.options?.[oIndex]?.text?.message}
                />
              )}
            />
            {options.length > 2 && (
              <IconButton size="small" onClick={() => remove(oIndex)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default QuestionOptions;
