import React, { useState } from 'react';
import {
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import useFetchParticipants from '../Hooks/useFetchParticipants';
import AddParticipantDialog from './AddParticipantDialog'; // Adjust the path as needed

interface Participant {
  id: string;
  name: string;
  surname: string;
  email: string;
}

const GroupParticipants: React.FC<{ groupId: string }> = ({ groupId }) => {
  const { participants, loading, error, deleteParticipant } = useFetchParticipants(groupId);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDeleteClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedParticipant) {
      try {
        await deleteParticipant(selectedParticipant.id);
      } catch (error) {
        setLocalError('Error deleting participant. Please try again.');
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedParticipant(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedParticipant(null);
  };

  return (
    <Box mt={3}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }} role="heading" aria-level={2}>
        Participants
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {loading ? (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
          Loading participants...
        </Typography>
      ) : (
        <List aria-label="List of participants">
          {participants.length > 0 ? (
            participants.map((participant) => (
              <ListItem key={participant.id} sx={{ borderBottom: '1px solid #ddd' }} aria-labelledby={`participant-${participant.id}`}>
                <ListItemText
                  primary={`${participant.name} ${participant.surname}`}
                  secondary={participant.email}
                />
                <Tooltip title="Delete Participant">
                  <IconButton
                    aria-label={`Delete ${participant.name} ${participant.surname}`}
                    onClick={() => handleDeleteClick(participant)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
              No participants found.
            </Typography>
          )}
        </List>
      )}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete {selectedParticipant?.name} {selectedParticipant?.surname}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!error || !!localError} autoHideDuration={6000} onClose={() => setLocalError(null)}>
        <Alert onClose={() => setLocalError(null)} severity="error">
          {error || localError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GroupParticipants;