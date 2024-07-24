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
  Autocomplete,
  Container,
} from '@mui/material';
import useGroup from '../Hooks/useGroup';
import useUpdateGroup from '../Hooks/useUpdateGroup';
import useFetchParticipants from '../Hooks/useFetchParticipants';
import { User } from './GroupList';
import useFetchUsers from '../Hooks/useFetchUsers';

interface Participant {
  id: string;
  name: string;
  surname: string;
  email: string;
}

interface EditGroupProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  onGroupUpdated: () => void;
}

const EditGroup: React.FC<EditGroupProps> = ({ open, onClose, groupId, onGroupUpdated }) => {
  const { group, loading: groupLoading } = useGroup(groupId);
  const { updateGroup, message } = useUpdateGroup();
  const participants = useFetchParticipants(groupId);
  const allUsers = useFetchUsers(); 

  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState(group?.title || '');
  const [description, setDescription] = useState(group?.description || '');
  const [location, setLocation] = useState(group?.location || '');
  const [time, setTime] = useState(group?.time || '');
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [snackMessage, setSnackMessage] = useState(''); // New state for Snackbar message

  useEffect(() => {
    if (group) {
      setTitle(group.title);
      setDescription(group.description);
      setLocation(group.location);
      setTime(group.time);
      setSelectedParticipants(participants);
    }
  }, [group, groupId]);

  useEffect(() => {
    setUsers(allUsers.filter(u => !selectedParticipants.some(selected => selected.id === u.id)));
  }, [selectedParticipants, allUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateGroup({
        groupId,
        title,
        description,
        location,
        time,
        selectedParticipants,
      });
      onGroupUpdated();
      onClose(); 
      setSnackMessage('Group updated successfully!');
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
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => `${option.name} ${option.surname} (${option.email})`}
            value={selectedParticipants}
            onChange={(event, newValue) => setSelectedParticipants(newValue)}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Add Participants" placeholder="Select participants" />
            )}
            aria-required="true"
          />
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
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
