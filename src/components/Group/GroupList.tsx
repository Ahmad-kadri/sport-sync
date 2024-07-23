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
  IconButton
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface Group {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'groups'));
        const groupList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Group[];
        setGroups(groupList);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Groups List
      </Typography>
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
                  cursor: 'pointer'
                }
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
              <IconButton
                component={Link}
                to={`/groups/${group.id}`}
                sx={{ ml: 'auto' }}
                color="primary"
              >
                <ArrowForward />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default GroupList;
