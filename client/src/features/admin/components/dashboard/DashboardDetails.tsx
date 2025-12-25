import { Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import StatisticCard from '@/features/admin/components/dashboard/StatisticCard';
import UserActivity from '@/features/admin/components/dashboard/UserActivity';
import QuizStatus from '@/features/admin/components/dashboard/QuizStatus';
import type { DashboardDetailsProps } from '@/features/types';

const DashboardDetails = ({ statistics }: DashboardDetailsProps) => {
  const {
    activeUsers = 0,
    totalUsers = 0,
    totalQuizzes = 0,
    publishedQuizzes = 0,
    unpublishedQuizzes = 0,
    totalAttempts = 0,
    recentAttempts = 0,
    averageScore = 0
  } = statistics;

  return (
    <>
      {/* statistics */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}
      >
        <StatisticCard
          title="Total Quizzes"
          value={totalQuizzes}
          icon={QuizIcon}
          color="#1976d2"
          subtitle={`${publishedQuizzes} published`}
        />
        <StatisticCard
          title="Total Users"
          value={totalUsers}
          icon={PeopleIcon}
          color="#2e7d32"
          subtitle={`${activeUsers} active`}
        />
        <StatisticCard
          title="Quiz Attempts"
          value={totalAttempts}
          icon={AssessmentIcon}
          color="#ed6c02"
          subtitle={`${recentAttempts} recent`}
        />
        <StatisticCard
          title="Average Score"
          value={`${averageScore.toFixed(0)}%`}
          icon={TrendingUpIcon}
          color="#9c27b0"
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3
        }}
      >
        {/* quiz status */}
        <QuizStatus
          publishedQuizzes={publishedQuizzes}
          unpublishedQuizzes={unpublishedQuizzes}
          totalQuizzes={totalQuizzes}
        />

        {/* activity */}
        <UserActivity
          activeUsers={activeUsers}
          totalUsers={totalUsers}
          recentAttempts={recentAttempts}
        />
      </Box>
    </>
  );
};

export default DashboardDetails;
