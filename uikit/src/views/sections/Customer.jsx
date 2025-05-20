'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

export default function Customer() {
  const [restaurants, setRestaurants] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 
  const messagesEndRef = useRef(null);
  useEffect(() => {
    axios.get('/api/restaurants')
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error(err));
  }, []);
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { from: 'user', text: message };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post('/api/chat/', { message });
      const botReply = { from: 'bot', text: res.data.response };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      const errorReply = { from: 'bot', text: 'Sorry, something went wrong.' };
      setMessages((prev) => [...prev, errorReply]);
    }

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
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

      {/* Chat Button & Box */}
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

        {chatOpen && (
          <Paper
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 320,
              p: 2,
              boxShadow: 6,
              zIndex: 10,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Chat Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Chat with us</Typography>
              <IconButton size="small" onClick={() => setChatOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* Chat Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', mt: 2, mb: 1 }}>
              <List dense>
                {messages.map((msg, idx) => (
                  <ListItem key={idx} sx={{ justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <ListItemText
                      primary={msg.text}
                      sx={{
                        bgcolor: msg.from === 'user' ? 'primary.light' : 'grey.200',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        maxWidth: '75%',
                      }}
                    />
                  </ListItem>
                ))}
                <div ref={messagesEndRef} />
              </List>
            </Box>

            {/* Input Area */}
            <OutlinedInput
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              endAdornment={
                <Stack direction="row" spacing={1}>
                  <IconButton>
                    <MicIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={sendMessage}>
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Stack>
              }
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
}
