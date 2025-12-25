import { Box, Card, CardContent, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

import { fetchQuizStats, fetchUserStats } from '@/features/api/admin';

import LoadingSpinner from '@/components/loader/LoadingSpinner';
import APIErrorAlert from '@/layouts/APIErrorAlert';
import getStatisticsChartData from '@/features/admin/helpers/getStatisticsChartData';
import MostPopularQuizzes from '@/features/admin/components/statistics/MostPopularQuizzes';

const StatisticsView = () => {
  const {
    data: quizStats,
    isLoading: quizLoading,
    error: quizError
  } = useQuery({
    queryKey: ['admin', 'statistics', 'quizzes'],
    queryFn: fetchQuizStats
  });

  const {
    data: userStats,
    isLoading: userLoading,
    error: userError
  } = useQuery({
    queryKey: ['admin', 'statistics', 'users'],
    queryFn: fetchUserStats
  });

  if (quizLoading || userLoading) {
    return <LoadingSpinner message="Loading statistics..." />;
  }

  if (quizError || userError) {
    return <APIErrorAlert message="Failed to load statistics. Please try again." />;
  }

  const {
    totalQuizzes,
    publishedQuizzes,
    averageAttemptsPerQuiz,
    mostPopularQuizzes,
    quizzesByDifficulty = {},
    quizzesByCategory = {}
  } = quizStats || {};

  const { difficultyPieChartData, categoryData } = getStatisticsChartData(
    quizzesByDifficulty,
    quizzesByCategory
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Statistics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed analytics and insights
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 3
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quiz Overview
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Quizzes
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {totalQuizzes || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Published
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {publishedQuizzes || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Average Attempts per Quiz
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {averageAttemptsPerQuiz?.toFixed(0) || 0}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Overview
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {userStats?.totalUsers || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {userStats?.activeUsers || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  New This Month
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {userStats?.newUsersThisMonth || 0}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* charts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 3
        }}
      >
        {/* quizzes by difficulty */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quizzes by Difficulty
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <PieChart
                series={[
                  {
                    data: difficultyPieChartData,
                    highlightScope: { fade: 'global', highlight: 'item' }
                  }
                ]}
                height={300}
              />
            </Box>
          </CardContent>
        </Card>

        {/* quizzes by category */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quizzes by Category
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <BarChart
                dataset={categoryData}
                xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
                series={[{ dataKey: 'quizzes', label: 'Quizzes' }]}
                height={300}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* most popular quizzes */}
      <MostPopularQuizzes mostPopularQuizzes={mostPopularQuizzes || []} />
    </Box>
  );
};

export default StatisticsView;
