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
import TextField from '@mui/material/TextField'; // Added TextField
import IconButton from '@mui/material/IconButton'; // Added IconButton
import EditIcon from '@mui/icons-material/Edit'; // Added EditIcon
import SaveIcon from '@mui/icons-material/Save'; // Added SaveIcon
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Added AddIcon
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'; // For Sold Out
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; // For Available
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// @project
import useDataThemeMode from '@/hooks/useDataThemeMode';
import { GraphicsCard } from '@/components/cards';

// ... (dummyReservations, sortedReservations, dummyFloorplanItems remain the same)
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

// Dummy data for menu items
const initialMenuItems = [
  { id: 'm1', name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese, special sauce', price: '12.99', category: 'Main Course', isEditing: false },
  { id: 'm2', name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan, Caesar dressing', price: '9.50', category: 'Appetizer', isEditing: false },
  { id: 'm3', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center', price: '7.00', category: 'Dessert', isEditing: false },
];


export default function Business() {
  useDataThemeMode();
  const theme = useTheme();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  useEffect(() => {
    document.title = 'Business View | AI Customer Service';
  }, []);

  const listItemApproxHeight = 60; 
  const maxListHeight = listItemApproxHeight * 5.5;
  const floorplanListMaxHeight = listItemApproxHeight * 4.5; 
  const menuListMaxHeight = listItemApproxHeight * 6;


  const handleMenuItemChange = (id, field, value) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const toggleEditMenuItem = (id) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };
  
  const addNewMenuItem = () => {
    const newItemId = `m${menuItems.length + 1 + Date.now()}`; // Simple unique ID
    setMenuItems(prevItems => [
      ...prevItems,
      { id: newItemId, name: 'New Item', description: '', price: '0.00', category: 'Uncategorized', isEditing: true }
    ]);
  };

  const handleDeleteMenuItem = (id) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const toggleSoldOutStatus = (id) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isSoldOut: !item.isSoldOut } : item
      )
    );
  };


  return (
    <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
      <Container>
        <Stack spacing={4}>
          {/* ... (Existing Typography and Grid for Reservations/Floorplan) ... */}
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
                    width: '330px',
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
                      pr: 2, 
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

            {/* Floorplan Holder Section */}
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
                  }}
                >
                  <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Restaurant Floorplan
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', my: 2, overflow: 'hidden' }}>
                    {isUserLoggedIn ? (
                      <Grid container spacing={1} sx={{ flexGrow: 1, height: '100%' }}>
                        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src="/assets/images/floorplan/fp1.jpg" 
                            alt="Restaurant Floorplan"
                            sx={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              width: 'auto',
                              objectFit: 'contain', 
                              borderRadius: 1, 
                            }}
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.secondary, mt: 0 }}>
                            Objects:
                          </Typography>
                          <List 
                            dense 
                            sx={{ 
                              height: 'calc(100% - 24px)',
                              maxHeight: floorplanListMaxHeight,
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
                          m: 'auto',
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
          
          <Divider sx={{ my: 4 }} /> {/* Ensure some margin around divider */}

          {/* Menu Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GraphicsCard
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h5" component="h2" sx={{ color: theme.palette.text.primary }}>
                  Menu Details
                </Typography>
                
                <Button 
                  variant="contained" 
                  startIcon={<AddCircleOutlineIcon />} 
                  onClick={addNewMenuItem}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Add New Menu Item
                </Button>

                <List sx={{ maxHeight: menuListMaxHeight, overflowY: 'auto', pr: 1 }}>
                  {menuItems.map((item) => (
                    <ListItem
                      key={item.id}
                      divider
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 2 }}
                    >
                      {item.isEditing ? (
                        <Stack spacing={2} sx={{ width: '100%' }}>
                          <TextField
                            label="Item Name"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={item.name}
                            onChange={(e) => handleMenuItemChange(item.id, 'name', e.target.value)}
                          />
                          <TextField
                            label="Description"
                            variant="outlined"
                            size="small"
                            fullWidth
                            multiline
                            rows={2}
                            value={item.description}
                            onChange={(e) => handleMenuItemChange(item.id, 'description', e.target.value)}
                          />
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={4}>
                              <TextField
                                label="Price"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={item.price}
                                onChange={(e) => handleMenuItemChange(item.id, 'price', e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={6} sm={8}>
                              <TextField
                                label="Category"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={item.category}
                                onChange={(e) => handleMenuItemChange(item.id, 'category', e.target.value)}
                              />
                            </Grid>
                          </Grid>
                          <Stack direction="row" spacing={1} sx={{alignSelf: 'flex-end'}}>
                            <IconButton onClick={() => toggleEditMenuItem(item.id)} size="small" color="primary">
                              <SaveIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteMenuItem(item.id)} size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </Stack>
                      ) : (
                        <Box sx={{ width: '100%' }}>
                          <ListItemText
                            primary={item.name}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color={item.isSoldOut ? theme.palette.error.main : "text.secondary"} sx={{ textDecoration: item.isSoldOut ? 'line-through' : 'none' }}>
                                  {item.description}
                                </Typography>
                                <br />
                                <Typography component="span" variant="caption" color={item.isSoldOut ? theme.palette.error.main : "text.secondary"} sx={{ textDecoration: item.isSoldOut ? 'line-through' : 'none' }}>
                                  Price: ${item.price} | Category: {item.category}
                                  {item.isSoldOut && " (Sold Out)"}
                                </Typography>
                              </>
                            }
                            primaryTypographyProps={{ 
                              sx: { 
                                textDecoration: item.isSoldOut ? 'line-through' : 'none',
                                color: item.isSoldOut ? theme.palette.error.main : 'inherit'
                              } 
                            }}
                          />
                          <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, right: 16 }}>
                            <IconButton onClick={() => toggleEditMenuItem(item.id)} size="small">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => toggleSoldOutStatus(item.id)} size="small" color={item.isSoldOut ? "success" : "warning"}>
                              {item.isSoldOut ? <AddShoppingCartIcon /> : <RemoveShoppingCartIcon />}
                            </IconButton>
                          </Stack>
                        </Box>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </GraphicsCard>
          </motion.div>
          
        </Stack>
      </Container>
    </Box>
  );
}