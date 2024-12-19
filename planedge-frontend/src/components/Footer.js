import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Container maxWidth="lg" style={{ textAlign: 'center', padding: '20px' }}>
      <Typography variant="body1">© 2024 Planedge - All rights reserved.</Typography>
      <Typography variant="body2">Terms of Service | Privacy Policy | Contact</Typography>
    </Container>
  );
}
