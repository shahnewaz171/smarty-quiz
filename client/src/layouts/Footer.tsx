import { Box, Container, Typography, Link, Stack } from '@mui/material';
import { formatYear } from '@/utils/date';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 3,
      px: 2,
      mt: 'auto',
      bgcolor: 'background.paper',
      borderTop: 1,
      borderColor: 'divider'
    }}
  >
    <Container maxWidth="lg">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2" color="text.secondary">
          © {formatYear()} Smarty Quiz. All rights reserved.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Link
            href="#"
            variant="body2"
            color="text.secondary"
            underline="hover"
            aria-label="Privacy Policy"
          >
            Privacy
          </Link>
          <Link
            href="#"
            variant="body2"
            color="text.secondary"
            underline="hover"
            aria-label="Terms of Service"
          >
            Terms
          </Link>
          <Link
            href="#"
            variant="body2"
            color="text.secondary"
            underline="hover"
            aria-label="Contact Us"
          >
            Contact
          </Link>
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
