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
  Divider,
  Avatar,
  Fade,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const API_URL = "http://localhost:8000";

export default function Customer() {
  const theme = useTheme();
  const [restaurants, setRestaurants] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'));
    axios.get(API_URL + '/api/restaurants', {
        headers: {
          Authorization: `${user.token}`,
        },
      })
      .then((res) => {
        console.log('API Response:', res.data);
        
        // Ensure we have valid data and add fallback IDs if needed
        const restaurantData = res.data.rests || [];
        const processedRestaurants = restaurantData.map((restaurant, index) => ({
          ...restaurant,
          // Ensure each restaurant has a unique ID
          id: restaurant.id || `restaurant-${index}-${Date.now()}`
        }));
        
        setRestaurants(processedRestaurants);
        console.log('Processed Restaurants:', processedRestaurants);
      })
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
      let user = JSON.parse(localStorage.getItem('user'));
      const payload = {
        user_id: user.user_id,
        message: message, 
      };
      const res = await axios.post(API_URL + '/api/chat/', payload, {
        headers: {
          Authorization: `${user.token}`,
        },
      });
      console.log(res);
      const botReply = { from: 'bot', text: res.data.reply };
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
        {restaurants.map((res, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={res.id || `restaurant-fallback-${index}`}
          >
            <Card sx={{
              maxWidth: 345,
              height: 500,
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
              }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={res.image_url || '/placeholder.jpg'}
                alt={res.name}
              />
              <CardContent>
                <Typography variant="h6">{res.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {res.descp || 'No description available.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chat Button & Interface */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}>
        {!chatOpen && (
          <Button
            variant="contained"
            onClick={() => setChatOpen(true)}
            sx={{
              borderRadius: '50%',
              minWidth: 64,
              minHeight: 64,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: theme.shadows[8],
              animation: 'pulse 2s infinite',
              fontSize: 24,
              transition: 'all 0.3s ease',
              '&:hover': { 
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', boxShadow: `0 0 0 0 ${theme.palette.primary.main}40` },
                '70%': { transform: 'scale(1)', boxShadow: `0 0 0 10px ${theme.palette.primary.main}00` },
                '100%': { transform: 'scale(1)', boxShadow: `0 0 0 0 ${theme.palette.primary.main}00` }
              }
            }}
          >
            <ChatIcon />
          </Button>
        )}

        <Fade in={chatOpen} timeout={300}>
          <Paper
            sx={{
              position: 'fixed',
              top: 80, // Leave space for navbar/menu
              left: 0,
              right: 0,
              bottom: 0,
              display: chatOpen ? 'flex' : 'none',
              flexDirection: 'column',
              borderRadius: '24px 24px 0 0',
              boxShadow: theme.shadows[24],
              bgcolor: 'background.paper',
              overflow: 'hidden',
            }}
          >
            {/* Chat Header */}
            <Box
              sx={{
                p: 3,
                bgcolor: 'primary.main',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <SmartToyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Customer Service AI Assistant
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Online • Ready to help!
                    </Typography>
                  </Box>
                </Stack>
                <IconButton 
                  onClick={() => setChatOpen(false)}
                  sx={{ 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>

            {/* Chat Messages */}
            <Box 
              sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                p: 2,
                bgcolor: theme.palette.grey[50],
                backgroundImage: `radial-gradient(circle at 25px 25px, ${theme.palette.grey[200]}40 2px, transparent 0), radial-gradient(circle at 75px 75px, ${theme.palette.grey[200]}40 2px, transparent 0)`,
                backgroundSize: '100px 100px',
              }}
            >
              {messages.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <SmartToyIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Welcome to AI Customer Service
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ask me anything about restaurants, bookings, or recommendations!
                  </Typography>
                </Box>
              )}

              <List sx={{ py: 0 }}>
                {messages.map((msg, idx) => (
                  <ListItem 
                    key={`message-${idx}`} 
                    sx={{ 
                      justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                      px: 0,
                      py: 1,
                    }}
                  >
                    <Stack 
                      direction={msg.from === 'user' ? 'row-reverse' : 'row'} 
                      spacing={1.5}
                      sx={{ maxWidth: '80%' }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: msg.from === 'user' ? 'primary.main' : 'secondary.main',
                          alignSelf: 'flex-end',
                        }}
                      >
                        {msg.from === 'user' ? (
                          <PersonIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <SmartToyIcon sx={{ fontSize: 18 }} />
                        )}
                      </Avatar>
                      
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          bgcolor: msg.from === 'user' ? 'primary.main' : 'background.paper',
                          color: msg.from === 'user' ? 'primary.contrastText' : 'text.primary',
                          borderRadius: msg.from === 'user' 
                            ? '18px 18px 6px 18px' 
                            : '18px 18px 18px 6px',
                          wordBreak: 'break-word',
                          position: 'relative',
                          '&::before': msg.from === 'user' ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            right: -6,
                            width: 0,
                            height: 0,
                            borderLeft: `6px solid ${theme.palette.primary.main}`,
                            borderBottom: '6px solid transparent',
                          } : {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: -6,
                            width: 0,
                            height: 0,
                            borderRight: `6px solid ${theme.palette.background.paper}`,
                            borderBottom: '6px solid transparent',
                          }
                        }}
                      >
                        <Typography variant="body1">
                          {msg.text}
                        </Typography>
                      </Paper>
                    </Stack>
                  </ListItem>
                ))}
                <div ref={messagesEndRef} />
              </List>
            </Box>

            <Divider />

            {/* Input Area */}
            <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <OutlinedInput
                  fullWidth
                  multiline
                  maxRows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  sx={{ 
                    borderRadius: 6,
                    bgcolor: theme.palette.grey[50],
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.grey[300],
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    }
                  }}
                />
                <Stack direction="row" spacing={0.5}>
                  <IconButton 
                    sx={{ 
                      bgcolor: theme.palette.grey[100],
                      '&:hover': { bgcolor: theme.palette.grey[200] }
                    }}
                  >
                    <MicIcon />
                  </IconButton>
                  <IconButton 
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { 
                        bgcolor: 'primary.dark',
                      },
                      '&.Mui-disabled': {
                        bgcolor: theme.palette.grey[300],
                        color: theme.palette.grey[500],
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
}