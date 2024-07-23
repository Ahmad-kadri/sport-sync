import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin'); // Redirect to sign-in page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Sports App
        </Typography>
        {user ? (
          <Box display="flex" alignItems="center">
            <Button color="inherit" component={Link} to="/groups">
              Group List
            </Button>
            <Button color="inherit" onClick={handleMenuOpen}>
              <Avatar src={user.photoURL} alt={user.displayName} style={{ marginLeft: '8px' }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </Box>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/signin">
              Sign In
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;