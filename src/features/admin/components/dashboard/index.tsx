import { Box, Typography, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { fetchDashboardStats } from '@/features/api/admin';
import { FourGridSkeleton } from '@/components/loader/skeletons';
import DashboardDetails from '@/features/admin/components/dashboard/DashboardDetails';

const DashboardStatistic = () => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['admin', 'statistics'],
    queryFn: fetchDashboardStats
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of your quiz platform statistics
          </Typography>
        </Box>
        <Chip
          icon={<TrendingUpIcon />}
          label="Live statistics"
          color="success"
          variant="outlined"
          size="small"
        />
      </Box>

      {isLoading ? <FourGridSkeleton /> : <DashboardDetails statistics={statistics || {}} />}
    </Box>
  );
};

export default DashboardStatistic;
