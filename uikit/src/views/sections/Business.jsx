'use client';
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// @project
import useDataThemeMode from '@/hooks/useDataThemeMode';
import { GraphicsCard } from '@/components/cards';

// ... (dummyReservations and sortedReservations remain the same)
// Dummy reservation data
const dummyReservations = [
  { id: 1, name: 'Alice Wonderland', tableNumber: 5, time: '18:30', numberOfPeople: 2 },
  { id: 2, name: 'Bob The Builder', tableNumber: 2, time: '19:00', numberOfPeople: 4 },
  { id: 3, name: 'Charlie Brown', tableNumber: 8, time: '17:00', numberOfPeople: 3 },
  { id: 4, name: 'Diana Prince', tableNumber: 3, time: '20:15', numberOfPeople: 2 },
  { id: 5, name: 'Edward Scissorhands', tableNumber: 1, time: '18:00', numberOfPeople: 1 },
  { id: 6, name: 'Fiona Gallagher', tableNumber: 6, time: '19:30', numberOfPeople: 5 },
  { id: 7, name: 'George Costanza', tableNumber: 4, time: '20:00', numberOfPeople: 2 },
  { id: 8, name: 'Harry Potter', tableNumber: 7, time: '17:30', numberOfPeople: 6 },
  { id: 9, name: 'Indiana Jones', tableNumber: 9, time: '21:00', numberOfPeople: 3 },
  { id: 10, name: 'Jack Sparrow', tableNumber: 10, time: '18:45', numberOfPeople: 4 },
  { id: 11, name: 'Kevin McCallister', tableNumber: 11, time: '16:00', numberOfPeople: 8 },
  { id: 12, name: 'Luna Lovegood', tableNumber: 12, time: '21:30', numberOfPeople: 2 },
];

// Sort reservations by time
const sortedReservations = [...dummyReservations].sort((a, b) => {
  const timeA = a.time.split(':').map(Number);
  const timeB = b.time.split(':').map(Number);
  if (timeA[0] !== timeB[0]) {
    return timeA[0] - timeB[0];
  }
  return timeA[1] - timeB[1];
});

// Dummy data for floorplan list
const dummyFloorplanItems = [
  { id: 't1', name: 'Table 1', status: 'Available', capacity: 4 },
  { id: 't2', name: 'Table 2', status: 'Occupied', capacity: 2 },
  { id: 't3', name: 'Table 3', status: 'Reserved', capacity: 6 },
  { id: 'b1', name: 'Bar Stool 1', status: 'Available', capacity: 1 },
  { id: 'p1', name: 'Patio Seat 5', status: 'Available', capacity: 2 },
];

export default function Business() {
  useDataThemeMode();
  const theme = useTheme();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  useEffect(() => {
    document.title = 'Business View | AI Customer Service';
  }, []);

  const listItemApproxHeight = 60; 
  const maxListHeight = listItemApproxHeight * 5.5;
  const floorplanListMaxHeight = listItemApproxHeight * 4.5; // Max height for floorplan list

  return (
    <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
      <Container>
        <Stack spacing={4}>

          <Grid container spacing={3} justifyContent="space-between"> 
            {/* Reservations List Section */}
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ width: '100%', height: '100%' }}
              >
                <GraphicsCard 
                  sx={{ 
                    p: { xs: 2, sm: 3 }, 
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2, 
                    boxShadow: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Today's Reservations
                  </Typography>
                  <List 
                    dense 
                    sx={{ 
                      maxHeight: maxListHeight, 
                      overflowY: 'auto', 
                      pr: 2, // Adjusted padding
                      flexGrow: 1, 
                    }}
                  >
                    {sortedReservations.map((reservation, index) => (
                      <ListItem key={reservation.id} disablePadding 
                        sx={{ 
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '&:last-child': { borderBottom: 'none' } 
                        }}
                      >
                        <ListItemText
                          primary={`${index + 1}. ${reservation.name} - Table ${reservation.tableNumber}`}
                          secondary={`Time: ${reservation.time} - Guests: ${reservation.numberOfPeople}`}
                          primaryTypographyProps={{ color: theme.palette.text.primary, fontWeight: 'medium' }}
                          secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </GraphicsCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ width: '100%', height: '100%' }}
              >
                <GraphicsCard
                  sx={{
                    p: { xs: 2, sm: 3 },
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    boxShadow: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    // justifyContent: 'space-between', // We'll let content define its space
                  }}
                >

                  <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Restaurant Floorplan
                  </Typography>
                  
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', my: 2, overflow: 'hidden' }}>
                    {isUserLoggedIn ? (
                      // Adjust inner Grid container and item props
                      <Grid container spacing={2} sx={{ flexGrow: 1, height: '100%' }}> {/* Reduced spacing */}
                        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Image takes 1/3 width */}
                          <Box
                            component="img"
                            src="/assets/images/floorplan/fp1.jpg" 
                            alt="Restaurant Floorplan"
                            sx={{
                              maxWidth: '100%', // Fit within its grid column
                              maxHeight: '300px', // Explicitly smaller max height for the image
                              width: 'auto',    // Maintain aspect ratio, width will adjust
                              objectFit: 'contain', 
                              borderRadius: 1, 
                            }}
                          />
                        </Grid>
                        <Grid item xs={8}> {/* List takes 2/3 width */}
                          <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.secondary, mt: 0 }}> {/* Adjusted margin top */}
                            Objects:
                          </Typography>
                          <List 
                            dense 
                            sx={{ 
                              height: 'calc(100% - 24px)', // Attempt to fill available height minus typography
                              maxHeight: floorplanListMaxHeight, // Still respect overall max height
                              overflowY: 'auto',
                              width: '100%',
                              backgroundColor: theme.palette.action.hover, 
                              borderRadius: 1,
                              p: 1,
                            }}
                          >
                            {dummyFloorplanItems.map((item) => (
                              <ListItem key={item.id} disablePadding 
                                sx={{ 
                                  borderBottom: `1px solid ${theme.palette.divider}`,
                                  '&:last-child': { borderBottom: 'none' } 
                                }}
                              >
                                <ListItemText
                                  primary={item.name}
                                  secondary={`Status: ${item.status} - Capacity: ${item.capacity}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      </Grid>
                    ) : (
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center', 
                          width: '80%', 
                          height: '200px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: theme.palette.action.hover,
                          m: 'auto', // Center the paper when not logged in
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Please log in to view and manage the floorplan.
                        </Typography>
                      </Paper>
                    )}
                  </Box>

                  {isUserLoggedIn && (
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 'auto', pt: 2 }}>
                      <Button variant="outlined" onClick={() => alert('View Analytics Clicked!')}>View Analytics</Button>
                      <Button variant="contained" onClick={() => alert('Edit Floorplan Clicked!')}>Edit Floorplan</Button>
                    </Stack>
                  )}
                </GraphicsCard>
              </motion.div>
            </Grid>
          </Grid>
          
          <Divider sx={{ mt: 4 }} />
          
        </Stack>
      </Container>
    </Box>
  );
}