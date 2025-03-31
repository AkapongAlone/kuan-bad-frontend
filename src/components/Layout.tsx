// src/components/Layout.tsx

import React, { ReactNode } from 'react';
import { 
  AppBar, 
  Box, 
  Container, 
  CssBaseline, 
  Toolbar, 
  Typography,
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit'
            }}
          >
            Badminton Room Management
          </Typography>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
          >
            Rooms
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/create-room"
          >
            Create Room
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200]
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            Badminton Room Management System © {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;