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
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

interface CreateGroupProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated: () => void; // New prop for the callback function
}

const CreateGroup: React.FC<CreateGroupProps> = ({ open, onClose, onGroupCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '!=', ''));
      const querySnapshot = await getDocs(q);
      const usersList: User[] = [];
      querySnapshot.forEach((doc) => {
        const user = { id: doc.id, ...doc.data() } as User;
        if (user.id !== currentUserId) {
          usersList.push(user);
        }
      });
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'groups'), {
        title,
        description,
        location,
        time,
        createdAt: new Date(),
      });

      const participantsCollection = collection(db, 'groups', docRef.id, 'participants');
      await Promise.all(selectedParticipants.map((user) => addDoc(participantsCollection, { ...user })));

      setMessage(`Group created successfully! ID: ${docRef.id}`);
      onClose();
      onGroupCreated(); // Call the callback function to update the group list
      setTimeout(() => {
        navigate('/groups');
      }, 2000);
    } catch (error) {
      console.error('Error creating group:', error);
      setMessage('Error creating group. Please try again.');
    }
  };

  return (
    <Container>
      <Dialog open={open} onClose={onClose} aria-labelledby="create-group-dialog-title">
        <DialogTitle id="create-group-dialog-title">Create a New Group</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} aria-labelledby="create-group-form">
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
              onChange={(event, value) => setSelectedParticipants(value)}
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
                Create Group
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage('')}>
        <Alert onClose={() => setMessage('')} severity={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateGroup;