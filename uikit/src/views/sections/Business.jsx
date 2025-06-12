'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
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
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation'; // Add this import

// @project
import useDataThemeMode from '@/hooks/useDataThemeMode';
import { GraphicsCard } from '@/components/cards';

const API_URL = "http://localhost:8000";

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
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [openRestaurantNameModal, setOpenRestaurantNameModal] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLoginAlert, setShowLoginAlert] = useState(false); // Add this state

  useEffect(() => {
    document.title = 'Business View | AI Customer Service';
    
    // Check for first login flag
    const firstLogin = localStorage.getItem('isFirstLogin');
    if (firstLogin === 'true') {
      setOpenRestaurantNameModal(true);
    }

    // Load business data
    loadBusinessData();
  }, []);

const loadBusinessData = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      setShowLoginAlert(true);
      // setLoading(false);
      // Navigate back after showing the alert for a bit longer
      setTimeout(() => {
        router.back(); // or router.push('/login') to go to specific login page
      }, 1); // Give user time to see the alert
      return;
    }

    const headers = {
      Authorization: `${user.token}`,
    };

    // Load reservations for a specific restaurant
    // You'll need to determine which restaurant this business user manages
    // For now, I'll use a placeholder - you might want to store this in user data
    const restaurantName = user.user_name || "Default"; // Replace with actual restaurant name
    
    try {
      const reservationsResponse = await axios.get(`${API_URL}/api/restaurant/reservations/${encodeURIComponent(restaurantName)}`, { headers });
      console.log('Restaurant Reservations Response:', reservationsResponse.data);
      
      if (reservationsResponse.data && Array.isArray(reservationsResponse.data.data)) {
        const processedReservations = reservationsResponse.data.data.map((reservation, index) => ({
          ...reservation,
          id: reservation.customer_id || `reservation-${index}-${Date.now()}`,
          name: reservation.customer_name,
          time: new Date(reservation.res_time).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          numberOfPeople: reservation.num,
          tableNumber: `T${index + 1}` // You might want to add actual table assignment logic
        }));
        // Sort reservations by time
        const sortedReservations = processedReservations.sort((a, b) => {
          return new Date(a.res_time) - new Date(b.res_time);
        });
        
        setReservations(sortedReservations);
      } else {
        console.warn('No reservations data found for restaurant');
        setReservations([]);
      }
    } catch (reservationsError) {
      console.error("Error fetching restaurant reservations:", reservationsError);
      setReservations([]);
    }

    // Load menu items
    try {
      const menuResponse = await axios.get(`${API_URL}/api/menu`, { headers }); // Remove the trailing slash
      console.log('Menu Response:', menuResponse.data);
      
      if (menuResponse.data && Array.isArray(menuResponse.data.menu)) {
        const processedMenuItems = menuResponse.data.menu.map((item, index) => ({
          ...item,
          id: item.id || `menu-${index}-${Date.now()}`,
          isEditing: false
        }));
        setMenuItems(processedMenuItems);
      } else {
        console.warn('No menu data found, using fallback');
        setMenuItems([
          { id: 'm1', name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese, special sauce', price: '12.99', category: 'Main Course', isEditing: false },
          { id: 'm2', name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan, Caesar dressing', price: '9.50', category: 'Appetizer', isEditing: false },
          { id: 'm3', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center', price: '7.00', category: 'Dessert', isEditing: false },
        ]);
      }
    } catch (menuError) {
      console.error("Error fetching menu:", menuError);
      setMenuItems([
        { id: 'm1', name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese, special sauce', price: '12.99', category: 'Main Course', isEditing: false },
        { id: 'm2', name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan, Caesar dressing', price: '9.50', category: 'Appetizer', isEditing: false },
        { id: 'm3', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center', price: '7.00', category: 'Dessert', isEditing: false },
      ]);
    }

  } catch (error) {
    console.error("Error loading business data:", error);
  }
};

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

  const toggleEditMenuItem = async (id) => {
    const item = menuItems.find(item => item.id === id);
    
    if (item.isEditing) {
      // Save the item
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const headers = {
          Authorization: `${user.token}`,
        };

        const payload = {
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          isSoldOut: item.isSoldOut || false
        };

        await axios.put(`${API_URL}/api/menu/${id}`, payload, { headers });
        console.log('Menu item updated successfully');
      } catch (error) {
        console.error('Error updating menu item:', error);
      }
    }

    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };
  
  const addNewMenuItem = async () => {
    console.log('Adding new menu item...');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('User data:', user);
      const headers = {
        Authorization: `${user.token}`,
      };

      const newItem = {
        name: 'New Item',
        description: '',
        price: '0.00',
        category: 'Uncategorized',
        isSoldOut: false
      };

      const response = await axios.post(`${API_URL}/api/menu`, newItem, { headers });
      console.log('New menu item created:', response.data);

      const newItemId = response.data.id || `m${menuItems.length + 1 + Date.now()}`;
      setMenuItems(prevItems => [
        ...prevItems,
        { ...newItem, id: newItemId, isEditing: true }
      ]);
    } catch (error) {
      console.error('Error creating menu item:', error);
      // Fallback to local creation
      const newItemId = `m${menuItems.length + 1 + Date.now()}`;
      setMenuItems(prevItems => [
        ...prevItems,
        { id: newItemId, name: 'New Item', description: '', price: '0.00', category: 'Uncategorized', isEditing: true }
      ]);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = {
        Authorization: `${user.token}`,
      };

      await axios.delete(`${API_URL}/api/menu/${id}`, { headers });
      console.log('Menu item deleted successfully');
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }

    setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const toggleSoldOutStatus = async (id) => {
    const item = menuItems.find(item => item.id === id);
    const newSoldOutStatus = !item.isSoldOut;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = {
        Authorization: `${user.token}`,
      };

      const payload = {
        ...item,
        isSoldOut: newSoldOutStatus
      };

      await axios.put(`${API_URL}/api/menu/${id}`, payload, { headers });
      console.log('Menu item sold out status updated successfully');
    } catch (error) {
      console.error('Error updating sold out status:', error);
    }

    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isSoldOut: newSoldOutStatus } : item
      )
    );
  };

  const handleRestaurantNameChange = (event) => {
    setRestaurantName(event.target.value);
  };

  const handleCloseRestaurantNameModal = () => {
    setOpenRestaurantNameModal(false);
    localStorage.removeItem('isFirstLogin');
    console.log('Restaurant Name Modal Closed. Name (if any):', restaurantName);
  };

  const handleSaveRestaurantName = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const headers = {
        Authorization: `${user.token}`,
      };

      const payload = {
        restaurantName: restaurantName
      };

      // await axios.post(`${API_URL}/api/restaurant/setup`, payload, { headers });
      console.log('Restaurant name saved successfully:', restaurantName);
    } catch (error) {
      console.error('Error saving restaurant name:', error);
    }

    setOpenRestaurantNameModal(false);
    localStorage.removeItem('isFirstLogin');
  };

  // if (loading) {
  //   return (
  //     <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
  //       <Container>
  //         <Typography variant="h4" align="center">Loading...</Typography>
  //       </Container>
  //     </Box>
  //   );
  // }

  return (
    <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
      <Container>
        <Dialog open={openRestaurantNameModal} onClose={handleCloseRestaurantNameModal}>
          <DialogTitle>Enter Restaurant Name</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{mb: 2}}>
              Welcome! Please enter the name of your restaurant to get started.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="restaurant-name"
              label="Restaurant Name"
              type="text"
              fullWidth
              variant="standard"
              value={restaurantName}
              onChange={handleRestaurantNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveRestaurantName}>Save</Button>
          </DialogActions>
        </Dialog>

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
                    {reservations.length > 0 ? reservations.map((reservation, index) => (
                      <ListItem key={reservation.id} disablePadding 
                        sx={{ 
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '&:last-child': { borderBottom: 'none' } 
                        }}
                      >
                        <ListItemText
                          primary={`${index + 1}. ${reservation.name || reservation.customerName} - Table ${reservation.tableNumber || reservation.table_number}`}
                          secondary={`Time: ${reservation.time} - Guests: ${reservation.numberOfPeople || reservation.party_size}`}
                          primaryTypographyProps={{ color: theme.palette.text.primary, fontWeight: 'medium' }}
                          secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                        />
                      </ListItem>
                    )) : (
                      <ListItem>
                        <ListItemText
                          primary="No reservations for today"
                          primaryTypographyProps={{ color: theme.palette.text.secondary, textAlign: 'center' }}
                        />
                      </ListItem>
                    )}
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
          
          <Divider sx={{ my: 4 }} />

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