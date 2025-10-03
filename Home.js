import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Job Portal
      </Typography>
      <Typography variant="h5" component="p" gutterBottom>
        Connect job seekers with employers. Find your dream job or post opportunities.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" size="large" component={Link} to="/jobs" sx={{ mr: 2 }}>
          Browse Jobs
        </Button>
        <Button variant="outlined" size="large" component={Link} to="/register">
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
