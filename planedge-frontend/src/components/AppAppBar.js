import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function AppAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Planedge Cost Estimation
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Cost Estimation</Button>
        <Button color="inherit">About Us</Button>
        <Button color="inherit">Contact</Button>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}
