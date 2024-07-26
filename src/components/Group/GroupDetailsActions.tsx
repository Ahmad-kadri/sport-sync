import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, MoreVert as MoreVertIcon, Chat as ChatIcon } from '@mui/icons-material';

interface GroupDetailsActionsProps {
  onEditOpen: () => void;
  onDelete: () => void;
  onChatOpen: () => void;
}

const GroupDetailsActions: React.FC<GroupDetailsActionsProps> = ({ onEditOpen, onDelete, onChatOpen }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    onEditOpen();
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleInviteClick = () => {
    // Logic to invite participants
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Tooltip title="Back to Groups">
          <IconButton
            aria-label="Back to Groups"
            onClick={() => navigate('/groups')}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Tooltip title="Open Chat">
            <IconButton
              aria-label="open chat"
              onClick={onChatOpen}
            >
              <ChatIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton
              aria-label="settings"
              aria-controls="settings-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleEditClick} aria-label="Edit Group">
              Edit Group
            </MenuItem>
            <MenuItem onClick={handleInviteClick} aria-label="Invite Participants">
              Invite Participants
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} aria-label="Delete Group" style={{ backgroundColor: '#f44336', color: '#fff' }}>
              Delete Group
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this group? This action cannot be undone.
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
    </>
  );
};

export default GroupDetailsActions;