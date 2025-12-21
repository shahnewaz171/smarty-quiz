import { Skeleton, Box, Card, CardContent } from '@mui/material';

export const QuizCardSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
      </Box>
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={80} height={20} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 1 }} />
    </CardContent>
  </Card>
);

export const StatCardSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="50%" height={20} />
        </Box>
        <Skeleton variant="rounded" width={50} height={50} />
      </Box>
    </CardContent>
  </Card>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Box>
    {Array.from({ length: rows }).map((_, index) => (
      <Card key={index} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={56} height={56} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="30%" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="40%" height={16} />
            </Box>
            <Box>
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export const PageSkeleton = () => (
  <Box>
    <Skeleton variant="text" width="30%" height={48} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="50%" height={24} sx={{ mb: 4 }} />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </Box>
  </Box>
);

export const FourGridSkeleton = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
      gap: 3
    }}
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <StatCardSkeleton key={index} />
    ))}
  </Box>
);
