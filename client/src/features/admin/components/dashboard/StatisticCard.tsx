import { Box, Card, CardContent, Typography } from '@mui/material';
import type { StatisticCardProps } from '@/features/types';

const StatisticCard = ({ title, value, icon: Icon, color, subtitle }: StatisticCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>

          <Typography variant="h4" component="div" sx={{ mb: 1 }}>
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            bgcolor: `${color}15`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon sx={{ color, fontSize: 32 }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default StatisticCard;
