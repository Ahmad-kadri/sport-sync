import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../../firebase';

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  userInfo: { name: string; surname: string } | null;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onClose, userInfo }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setSurname(userInfo.surname);
    }
  }, [userInfo]);

  const handleUpdate = async () => {
    setError('');
    setMessage('');

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: `${name} ${surname}` });
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { name, surname });

        setMessage('Profile updated successfully!');
        onClose();
      } catch (error) {
        console.error('Error updating profile:', error);
        setError('Error updating profile. Please try again.');
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      aria-labelledby="edit-profile-dialog-title"
      aria-describedby="edit-profile-dialog-description"
    >
      <DialogTitle id="edit-profile-dialog-title">Edit Profile</DialogTitle>
      <DialogContent id="edit-profile-dialog-description">
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          aria-required="true"
        />
        <TextField
          label="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          fullWidth
          margin="normal"
          aria-required="true"
        />
        {error && (
          <Alert severity="error" aria-live="assertive">
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" aria-live="polite">
            {message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel">
          Cancel
        </Button>
        <Button onClick={handleUpdate} variant="contained" color="primary" aria-label="Update Profile">
          Update
        </Button>
      </DialogActions>
      <Snackbar 
        open={!!message} 
        autoHideDuration={6000} 
        onClose={() => setMessage('')} 
        aria-live="polite"
      >
        <Alert onClose={() => setMessage('')} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EditProfileDialog;