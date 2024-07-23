import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Container,
  Snackbar,
  Alert,
  Autocomplete
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase'; // Ensure `auth` is imported
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

const CreateGroup: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch current user ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '!=', '')); // Adjust the query as needed
      const querySnapshot = await getDocs(q);
      const usersList: User[] = [];
      querySnapshot.forEach((doc) => {
        const user = { id: doc.id, ...doc.data() } as User;
        if (user.id !== currentUserId) { // Filter out the current user
          usersList.push(user);
        }
      });
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Open dialog and fetch users
  const handleClickOpen = () => {
    fetchUsers();
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Add group with selected participants
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

      // Add selected participants to the group
      const participantsCollection = collection(db, 'groups', docRef.id, 'participants');
      await Promise.all(
        selectedParticipants.map(user =>
          addDoc(participantsCollection, { ...user })
        )
      );

      setMessage(`Group created successfully! ID: ${docRef.id}`);
      setOpen(false);
      setTimeout(() => {
        navigate('/groups');
      }, 2000); // Navigate after 2 seconds to show confirmation
    } catch (error) {
      console.error('Error creating group:', error);
      setMessage('Error creating group. Please try again.');
    }
  };

  return (
    <Container>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create Group
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Group</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Time"
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              margin="normal"
            />

            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => `${option.name} ${option.surname} (${option.email})`}
              onChange={(event, value) => setSelectedParticipants(value)}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Add Participants" placeholder="Select participants" />
              )}
            />

            <DialogActions>
              <Button onClick={handleClose} color="primary">
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