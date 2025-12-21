import { useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useDebounceValue } from '@/hooks/useDebounce';
import QuizList from '@/features/quiz/components/quiz-list/QuizList';
import QuizFilters from '@/features/shared/QuizFilters';
import type { Difficulty } from '@/types/Quiz';

const Quiz = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // debounced search term
  const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebounceValue('', 400);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Quizzes
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Choose a quiz to test your knowledge
      </Typography>

      {/* filters */}
      <QuizFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* quizzes */}
      <QuizList
        searchQuery={debouncedSearchTerm}
        selectedDifficulty={selectedDifficulty}
        selectedCategory={selectedCategory}
      />
    </Box>
  );
};

export default Quiz;
