import { Box, Container, Typography } from '@mui/material';

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
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} Smarty Quiz. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
