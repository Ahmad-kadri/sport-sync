import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddParticipants from './AddParticipant'; // Make sure to adjust the import path

interface AddParticipantsDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  currentUserId: string;
}

const AddParticipantsDialog: React.FC<AddParticipantsDialogProps> = ({ open, onClose, groupId, currentUserId }) => {
  return (
    <Dialog fullWidth fullScreen open={open} onClose={onClose}>
      <DialogTitle>Add Participants</DialogTitle>
      <DialogContent>
        <AddParticipants groupId={groupId} currentUserId={currentUserId} onClose={onClose}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddParticipantsDialog;