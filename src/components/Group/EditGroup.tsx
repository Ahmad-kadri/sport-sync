import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import useGroup from '../Hooks/useGroup';

interface EditGroupProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  onGroupUpdated: () => void;
}

const EditGroup: React.FC<EditGroupProps> = ({ open, onClose, groupId, onGroupUpdated }) => {
  const { group, loading: groupLoading, updateGroup, message } = useGroup(groupId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [snackMessage, setSnackMessage] = useState('');

  useEffect(() => {
    if (group) {
      setTitle(group.title);
      setDescription(group.description);
      setLocation(group.location);
      setTime(group.time);
    }
  }, [group]);

  useEffect(() => {
    if (message) {
      setSnackMessage(message);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateGroup({
        groupId,
        title,
        description,
        location,
        time,
      });
      onGroupUpdated();
      onClose();
    } catch (error) {
      setSnackMessage('Error updating group. Please try again.');
    }
  };

  if (groupLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-group-dialog-title"
      aria-describedby="edit-group-dialog-description"
    >
      <DialogTitle id="edit-group-dialog-title">Edit Group</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} aria-labelledby="edit-group-form">
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
            aria-required="true"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
            aria-required="true"
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            margin="normal"
            required
            aria-required="true"
          />
          <TextField
            label="Time"
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
            margin="normal"
            required
            aria-required="true"
          />
          <DialogActions>
            <Button onClick={onClose} color="error">
              Cancel
            </Button>
            <Button type="submit" color="success">
              Update Group
            </Button>
          </DialogActions>
        </form>
      </DialogContent>

      <Snackbar
        open={!!snackMessage}
        autoHideDuration={6000}
        onClose={() => setSnackMessage('')}
        aria-live="polite"
      >
        <Alert onClose={() => setSnackMessage('')} severity={snackMessage.includes('Error') ? 'error' : 'success'}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EditGroup;