import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  Divider,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CreateGroup from './CreateGroup'; // Import the CreateGroup component

export interface Group {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export interface Participant {
  id: string;
  name: string;
  surname: string;
  email: string;
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const fetchGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'groups'));
      const groupList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Group[];
      setGroups(groupList);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroupOpen = () => {
    setIsCreateGroupOpen(true);
  };

  const handleCreateGroupClose = () => {
    setIsCreateGroupOpen(false);
  };

  const handleGroupCreated = () => {
    fetchGroups();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateGroupOpen}
        >
          Create New Group
        </Button>
        <Typography variant="h4">
          Groups List
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {groups.map((group) => (
            <ListItem
              component={Link}
              to={`/groups/${group.id}`}
              key={group.id}
              sx={{
                marginBottom: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {group.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {group.description}
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      <strong>Location:</strong> {group.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Time:</strong> {group.time}
                    </Typography>
                  </Box>
                }
              />
              <IconButton component={Link} to={`/groups/${group.id}`} sx={{ ml: 'auto' }} color="primary">
                <ArrowForward />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>
      <CreateGroup open={isCreateGroupOpen} onClose={handleCreateGroupClose} onGroupCreated={handleGroupCreated} />
    </Container>
  );
};

export default GroupList;