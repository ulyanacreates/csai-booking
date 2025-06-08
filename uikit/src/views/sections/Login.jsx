'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CUSTOMER_PATH, BUSINESS_PATH } from '@/path';
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
import MenuItem from '@mui/material/MenuItem';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const API_URL = 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';

      const payload = mode === 'login'
        ? { 
            userName: email,
            password: password 
          }
        : {
            userName: email,
            password: password,
            phoneNumber: phone,
            user_type: userType,
            fullName: name
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Authentication failed" }));
        setError(errorData.message || "Incorrect login/password");
        return;
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));

      if (mode === 'signup') {
        if (userType === 'company') {
          localStorage.setItem('isFirstLogin', 'false'); 
        }
        router.push('/')
      } else {
          router.push('/');
      }

    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication error');
      console.error('Authentication error:', err);
    }
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
          onChange={(_, newValue) => {
            setMode(newValue);
            setError(''); // Clear errors when switching modes
          }}
          variant="fullWidth"
        >
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} mt={3}>
          <Stack spacing={2}>
            {mode === 'signup' && (
              <>
                <TextField
                  label="Full Name"
                  type="text"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <TextField
                  label="User Type"
                  select
                  fullWidth
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                  helperText="Select whether you're a customer or restaurant owner"
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="company">Restaurant Owner</MenuItem>
                </TextField>
              </>
            )}

            <TextField
              label="User Name"
              type="text"
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
            
            {error && (
              <Typography color="error" variant="body2" textAlign="center">
                {error}
              </Typography>
            )}

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={loading}
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}