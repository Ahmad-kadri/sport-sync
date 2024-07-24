import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../../firebase';
import EditProfileDialog from './EditProfileDialog';
import useUserInfo from '../Hooks/useUserInfo';

const UserProfile: React.FC = () => {
  const { userInfo, loading, error: fetchError, refetchUserInfo } = useUserInfo();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid));
        await deleteUser(auth.currentUser);
        setOpenDeleteDialog(false);
        navigate('/signup');
      } catch (error) {
        console.error('Error deleting account:', error);
        setError('Error deleting account. Please try again.');
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (!openEditDialog) {
      refetchUserInfo();
    }
  }, [openEditDialog, refetchUserInfo]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">Error: {fetchError}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        {userInfo ? (
          <>
            <Box mb={2}>
              <Typography variant="body1"><strong>Name:</strong> {userInfo.name}</Typography>
              <Typography variant="body1"><strong>Surname:</strong> {userInfo.surname}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {userInfo.email}</Typography>
            </Box>
            <Divider style={{ marginBottom: '16px' }} />
            <Box display="flex" justifyContent="space-between">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setOpenEditDialog(true)}
                aria-label="Edit Profile"
              >
                Edit Profile
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => setOpenDeleteDialog(true)}
                aria-label="Delete Account"
              >
                Delete Account
              </Button>
            </Box>
            <EditProfileDialog
              open={openEditDialog}
              onClose={() => setOpenEditDialog(false)}
              userInfo={userInfo}
            />
            <Dialog 
              open={openDeleteDialog} 
              onClose={() => setOpenDeleteDialog(false)}
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-description"
            >
              <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent id="delete-dialog-description">
                <Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDeleteDialog(false)} aria-label="Cancel">
                  Cancel
                </Button>
                <Button 
                  onClick={handleDelete} 
                  color="secondary" 
                  variant="contained"
                  aria-label="Confirm Delete"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Typography>No user information available.</Typography>
        )}
      </Paper>
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        aria-live="assertive"
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {error || message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile;