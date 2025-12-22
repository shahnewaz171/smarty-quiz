import { lazy, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useDebounceValue } from '@/hooks/useDebounce';

import QuizFilters from '@/features/shared/QuizFilters';
import AdminQuizzes from '@/features/admin/components/quiz-management/AdminQuizzes';
import { createQuiz, updateQuiz } from '@/features/api/admin';
import type { Difficulty, CreateQuizRequest, Quiz } from '@/types/Quiz';
import { showNotification } from '@/lib/sonner';

const QuizModal = lazy(() => import('@/features/admin/components/quiz-management/QuizModal'));

const QuizManagement = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const queryClient = useQueryClient();

  // debounced search term
  const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebounceValue('', 400);

  // mutations
  const createQuizMutation = useMutation({
    mutationFn: (quiz: CreateQuizRequest) => createQuiz(quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quizzes'] });
      setModalOpen(false);
    },
    onError: (error) => {
      showNotification(`Error creating quiz: ${error.message}`, 'error');
    }
  });

  const updateQuizMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateQuizRequest }) => updateQuiz(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quizzes'] });
      setModalOpen(false);
      setEditingQuiz(null);
    },
    onError: (error) => {
      showNotification(`Error creating quiz: ${error.message}`, 'error');
    }
  });

  const handleCreateQuiz = (quiz: CreateQuizRequest) => {
    if (editingQuiz) {
      updateQuizMutation.mutate({ id: editingQuiz.id, data: quiz });
    } else {
      createQuizMutation.mutate(quiz);
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingQuiz(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Quiz Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, edit, and manage quizzes
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
          Create Quiz
        </Button>
      </Box>

      {/* filters */}
      <QuizFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* quiz list */}
      <AdminQuizzes
        searchQuery={debouncedSearchTerm}
        selectedDifficulty={selectedDifficulty}
        selectedCategory={selectedCategory}
        onEditQuiz={handleEditQuiz}
      />

      {/* modals */}
      {modalOpen && (
        <QuizModal
          open={modalOpen}
          quiz={editingQuiz}
          onClose={handleCloseModal}
          onSave={handleCreateQuiz}
          isSubmitting={createQuizMutation.isPending || updateQuizMutation.isPending}
        />
      )}
    </Box>
  );
};

export default QuizManagement;
