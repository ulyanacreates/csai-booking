'use client';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

// For SEO optimization
import useDataThemeMode from '@/hooks/useDataThemeMode';

export default function Business() {
  // Set up dark/light mode
  useDataThemeMode();

  useEffect(() => {
    // Any side effects when component mounts
    document.title = 'Business View | AI Customer Service';
  }, []);

  return (
    <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
      <Container>
        <Stack spacing={4}>
          <Typography variant="h2" component="h1" align="center" sx={{ mb: 2 }}>
            Business
          </Typography>
          
          <Divider />
          
          <Typography variant="body1">
            This is the business view of our AI Customer Service platform. 
            From here, business owners can manage their booking services, view analytics, 
            and configure AI customer support settings.
          </Typography>
          
          <Box sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" color="text.secondary">
              Business Dashboard Coming Soon
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}