import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchQuizCategories } from '@/features/api/quiz';
import type { Difficulty } from '@/types/Quiz';
import type { QuizFiltersProps } from '@/features/types';

const QuizFilters = ({
  searchTerm,
  setSearchTerm,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCategory,
  setSelectedCategory
}: QuizFiltersProps) => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'quizzes', 'categories'] as const,
    queryFn: () => fetchQuizCategories(),
    enabled: true
  });

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        label="Search quizzes"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title or description..."
      />
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Difficulty</InputLabel>
        <Select
          value={selectedDifficulty}
          label="Difficulty"
          onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | '')}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {isLoading ? (
            <MenuItem disabled className="!flex !place-content-center p-4">
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            [
              <MenuItem key="all" value="">
                All
              </MenuItem>,
              ...(categories?.map((cat: string) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              )) || [])
            ]
          )}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default QuizFilters;
