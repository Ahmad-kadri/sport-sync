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
  CircularProgress,
} from '@mui/material';
import useFetchUsers from '../Hooks/useFetchUsers'; // Assuming a hook to fetch all users
import useFetchParticipants from '../Hooks/useFetchParticipants'; // Your existing hook
import { User } from './GroupList';

interface AddParticipantDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string; // Added to fetch participants of this group
}

const AddParticipantDialog: React.FC<AddParticipantDialogProps> = ({ open, onClose, groupId }) => {
  const { users } = useFetchUsers();
  const [allUsers, setallUsers] = useState<User[]>([]);
  const { participants, loading } = useFetchParticipants(groupId);
  const [selectedUser, setSelectedUser] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (participants.length > 0) {
      setSelectedUser(participants);
    }
  }, [participants]);

  const handleAdd = () => {
    if (selectedUser) {
      setSelectedUser(null);
      onClose();
    } else {
      setError('Please select a participant.');
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Invite Participant</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
              <Autocomplete
              multiple
              options={allUsers}
              getOptionLabel={(option) => `${option.name} ${option.surname} (${option.email})`}
              onChange={(event, value) => setSelectedUser(value)}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Add Participants" placeholder="Select participants" />
              )}
              aria-required="true"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddParticipantDialog;