import React from 'react';
import { Container, Typography, Button } from '@mui/material';

export default function Hero() {
  return (
    <Container maxWidth="lg" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h2" component="h1">
        Start Your Construction Cost Estimation Now
      </Typography>
      <Typography variant="h5" color="textSecondary" style={{ marginTop: '20px' }}>
        Get accurate cost estimates for your project in minutes
      </Typography>
      <Button variant="contained" color="primary" style={{ marginTop: '30px' }}>
        Get Started
      </Button>
    </Container>
  );
}
