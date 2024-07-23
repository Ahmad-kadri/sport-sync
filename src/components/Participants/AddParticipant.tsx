// src/components/AddParticipants.tsx
import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { Button, List, ListItem, ListItemText, TextField, MenuItem, Paper } from '@mui/material';
import { db } from '../../firebase';
import useFetchUsers from '../Hooks/useFetchUsers';
import useFetchParticipants from '../Hooks/useFetchParticipants';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

interface AddParticipantsProps {
  groupId: string;
  currentUserId: string;
  onClose: () => void;
}

const AddParticipants: React.FC<AddParticipantsProps> = ({ groupId, currentUserId, onClose }) => {
  const users = useFetchUsers();
  const existingParticipants = useFetchParticipants(groupId);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        user.id !== currentUserId &&
        !existingParticipants.some(p => p.id === user.id) &&
        !selectedUsers.some(su => su.id === user.id)
      );
      setSuggestedUsers(filteredUsers);
    } else {
      setSuggestedUsers([]);
    }
  }, [searchTerm, users, existingParticipants, selectedUsers, currentUserId]);

  const handleAddUser = (user: User) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(prevUsers => [...prevUsers, user]);
    }
    setSearchTerm('');
    setOpen(false);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const handleAddToGroup = async () => {
    try {
      const participantsCollection = collection(db, 'groups', groupId, 'participants');
      await Promise.all(
        selectedUsers.map(user => addDoc(participantsCollection, {
          userId: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email
        }))
      );
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error('Error adding participants:', error);
    }
  };

  return (
    <div>
      <TextField
        label="Search Users"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setOpen(true);
        }}
      />
      {open && suggestedUsers.length > 0 && (
        <Paper style={{ maxHeight: 200, overflowY: 'auto', position: 'absolute', zIndex: 1 }}>
          {suggestedUsers.map(user => (
            <MenuItem key={user.id} onClick={() => handleAddUser(user)}>
              {user.name} {user.surname} ({user.email})
            </MenuItem>
          ))}
        </Paper>
      )}

      <div>
        <List>
          {selectedUsers.map(user => (
            <ListItem key={user.id}>
              <ListItemText primary={`${user.name} ${user.surname} (${user.email})`} />
              <Button onClick={() => handleRemoveUser(user.id)}>Remove</Button>
            </ListItem>
          ))}
        </List>
      </div>

      <Button onClick={handleAddToGroup} variant="contained" color="primary">
        Add Selected Users to Group
      </Button>
    </div>
  );
};

export default AddParticipants;