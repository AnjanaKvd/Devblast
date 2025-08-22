import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
  // Get the current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto', // Pushes the footer to the bottom of the page
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on larger screens
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2 // Adds space between items
          }}
        >
          {/* Copyright Information */}
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {currentYear}
            <Link color="inherit" href="#" sx={{ ml: 0.5, textDecoration: 'none' }}>
              DevBlast
            </Link>
            . All rights reserved.
          </Typography>

          {/* Social Media Icons */}
          <Box>
            <IconButton 
              aria-label="Facebook" 
              color="inherit" 
              component="a" 
              href="https://facebook.com"
              target="_blank" // Open in new tab
            >
              <FacebookIcon />
            </IconButton>
            <IconButton 
              aria-label="Twitter" 
              color="inherit" 
              component="a" 
              href="https://twitter.com"
              target="_blank"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton 
              aria-label="Instagram" 
              color="inherit" 
              component="a" 
              href="https://instagram.com"
              target="_blank"
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}