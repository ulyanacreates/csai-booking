'use client';

import { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Button,
  Typography,
  Stack,
  Paper
} from '@mui/material';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'signup' && password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    // Replace with actual auth logic
    alert(`${mode === 'login' ? 'Logging in' : 'Signing up'} as ${email}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </Typography>

        <Tabs
          value={mode}
          onChange={(_, newValue) => setMode(newValue)}
          variant="fullWidth"
        >
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} mt={3}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === 'signup' && (
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
