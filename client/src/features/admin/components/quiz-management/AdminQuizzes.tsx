import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedIcon from '@mui/icons-material/Unpublished';

import { fetchAdminQuizzes, deleteQuiz, togglePublishQuiz } from '@/features/api/admin';
import { difficultyColors } from '@/features/admin/helpers';
import APIErrorAlert from '@/layouts/APIErrorAlert';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

import type { AdminQuizzesComponentProps, QuizzesResponse } from '@/features/types';
import type { Quiz, Difficulty } from '@/types/Quiz';

const AdminQuizzes = ({
  searchQuery,
  selectedDifficulty,
  selectedCategory,
  onEditQuiz
}: AdminQuizzesComponentProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const queryClient = useQueryClient();

  const filters = {
    search: searchQuery || undefined,
    difficulty: (selectedDifficulty as Difficulty) || undefined,
    category: selectedCategory || undefined
  };

  const {
    data: quizzesData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['admin', 'quizzes', 'list', filters] as const,
    queryFn: ({ queryKey }) => fetchAdminQuizzes(queryKey[3])
  });
  const { data: quizzes, meta_data } = (quizzesData as QuizzesResponse) || {};
  const { total_rows = 0 } = meta_data || {};

  // mutations
  const deleteQuizMutation = useMutation({
    mutationFn: (quizId: string) => deleteQuiz(quizId),
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quizzes'] });
      queryClient.removeQueries({ queryKey: ['admin', 'quizzes', 'detail', quizId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'statistics'] });
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ quizId, isPublished }: { quizId: string; isPublished: boolean }) =>
      togglePublishQuiz(quizId, isPublished),
    onSuccess: (updatedQuiz) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quizzes'] });
      queryClient.setQueryData(['admin', 'quizzes', 'detail', updatedQuiz.id], updatedQuiz);
      queryClient.invalidateQueries({ queryKey: ['admin', 'statistics'] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'quizzes' &&
          query.queryKey[1] === 'list'
      });
    }
  });

  // delete click
  const handleDeleteClick = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setDeleteDialogOpen(true);
  };

  // confirm delete
  const handleDeleteConfirm = () => {
    if (quizToDelete) {
      deleteQuizMutation.mutate(quizToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setQuizToDelete(null);
        }
      });
    }
  };

  // toggle publish
  const handleTogglePublish = (quiz: Quiz) => {
    togglePublishMutation.mutate({
      quizId: quiz.id,
      isPublished: !quiz.isPublished
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <APIErrorAlert message="Failed to load quizzes. Please try again." />;
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <Alert severity="info">{`No quizzes found. ${total_rows > 0 ? '' : 'Create your first quiz to get started!'}`}</Alert>
    );
  }

  return (
    <>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                {/* quiz details */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip label={quiz.category} size="small" color="primary" />
                    <Chip
                      label={quiz.difficulty}
                      size="small"
                      color={difficultyColors[quiz.difficulty]}
                    />
                    <Chip
                      icon={quiz.isPublished ? <PublishIcon /> : <UnpublishedIcon />}
                      label={quiz.isPublished ? 'Published' : 'Unpublished'}
                      size="small"
                      color={quiz.isPublished ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {quiz.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {quiz.description}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {quiz.questions.length} questions • {quiz.timeLimit} minutes
                  </Typography>
                </Box>

                {/* actions */}
                <Stack direction="row" spacing={1}>
                  <Tooltip title={quiz.isPublished ? 'Unpublish Quiz' : 'Publish Quiz'}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleTogglePublish(quiz)}
                      disabled={togglePublishMutation.isPending}
                    >
                      {quiz.isPublished ? <UnpublishedIcon /> : <PublishIcon />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit Quiz">
                    <IconButton size="small" color="primary" onClick={() => onEditQuiz?.(quiz)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Quiz">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(quiz)}
                      disabled={deleteQuizMutation.isPending}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* modals */}
      <ConfirmationModal
        isOpen={deleteDialogOpen}
        title="Delete Quiz"
        subTitle={`Are you sure you want to delete "${quizToDelete?.title}"? This action cannot be undone.`}
        closeLabel="Cancel"
        actionLabel="Delete"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteQuizMutation.isPending}
      />
    </>
  );
};

export default AdminQuizzes;
