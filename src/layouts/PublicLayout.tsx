import { Outlet } from 'react-router';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import Logo from '@/components/icons/Logo';
import Footer from '@/layouts/Footer';

const PublicLayout = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <AppBar position="static" component="header">
      <Toolbar>
        <Logo sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Smarty Quiz
        </Typography>
      </Toolbar>
    </AppBar>

    <Container
      component="main"
      maxWidth="lg"
      sx={{
        flexGrow: 1,
        py: 4,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Outlet />
    </Container>

    <Footer />
  </Box>
);

export default PublicLayout;
