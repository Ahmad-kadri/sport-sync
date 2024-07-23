// src/components/Profile.tsx

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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid));
        await deleteUser(auth.currentUser);
        setOpenEditDialog(false)
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
              <Button variant="contained" color="primary" onClick={() => setOpenEditDialog(true)}>
                Edit Profile
              </Button>
              <Button variant="contained" color="secondary" onClick={handleDelete}>
                Delete Account
              </Button>
            </Box>
            <EditProfileDialog
              open={openEditDialog}
              onClose={() => setOpenEditDialog(false)}
              userInfo={userInfo}
            />
          </>
        ) : (
          <Typography>No user information available.</Typography>
        )}
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {error || message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile;