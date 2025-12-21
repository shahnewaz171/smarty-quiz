import z from 'zod';

export const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Option text is required')
});

export const questionSchema = z.object({
  id: z.string(),
  questionText: z.string().min(5, 'Question text must be at least 5 characters'),
  options: z.array(optionSchema).min(2, 'At least 2 options are required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().optional(),
  points: z.number().min(1, 'Points must be at least 1')
});

export const quizFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  timeLimit: z.number().min(1, 'Time limit must be at least 1 minute'),
  questions: z.array(questionSchema).min(1, 'At least 1 question is required')
});
