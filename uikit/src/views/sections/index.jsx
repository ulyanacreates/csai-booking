'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  OutlinedInput,
  IconButton,
  Paper,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/restaurants')
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Restaurants</Typography>

      <Grid container spacing={3}>
        {restaurants.map((res) => (
          <Grid item xs={12} sm={6} md={4} key={res.id}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={res.image || '/placeholder.jpg'}
                alt={res.name}
              />
              <CardContent>
                <Typography variant="h6">{res.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {res.description || 'No description available.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
      {!chatOpen && (
        <Button
            variant="contained"
            onClick={() => setChatOpen(true)}
            sx={{
              borderRadius: '50%',
              minWidth: 72,
              minHeight: 72,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 6,
              animation: 'pulse 2s infinite',
              fontSize: 28,
              '&:hover': { bgcolor: 'primary.dark' },
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' }
              }
            }}
        >
          <ChatIcon />
        </Button>
      )}

      {/* Chat Box */}
      {chatOpen && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 300,
            p: 2,
            boxShadow: 6,
            zIndex: 10,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">Chat with us</Typography>
            <IconButton size="small" onClick={() => setChatOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <OutlinedInput
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Make your reservation here"
              endAdornment={
                <Stack direction="row" spacing={1}>
                  <IconButton>
                    <MicIcon fontSize="small" />
                  </IconButton>
                  <IconButton>
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Stack>
              }
            />
          </Box>
        </Paper>
      )}
      </Box>
    </Box>
  );
}
