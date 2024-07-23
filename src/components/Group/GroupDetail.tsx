import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import useFetchParticipants from '../Hooks/useFetchParticipants';
import GroupDetailsHeader from './GroupDetailsHeader';
import GroupParticipants from './GroupParticipants';

interface Group {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
}

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize the navigate function

  useEffect(() => {
    if (!groupId) return;

    // Listen for real-time updates to the group details
    const groupDocRef = doc(db, 'groups', groupId);
    const unsubscribeGroup = onSnapshot(groupDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setGroup({ id: docSnapshot.id, ...docSnapshot.data() } as Group);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeGroup();
    };
  }, [groupId]);

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Button
        variant="outlined"
        onClick={() => navigate('/groups')} // Navigate to the GroupList route
        sx={{ mb: 3 }}
      >
        Back to Groups
      </Button>
      <Box  
        sx={{ 
          padding: 3, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 2, 
          boxShadow: 1,
          mb: 3 
        }}
      >
        {group ? (
          <GroupDetailsHeader group={group} />
        ) : (
          <Typography>No details available for this group.</Typography>
        )}
        <GroupParticipants groupId={groupId!} />
      </Box>
    </Container>
  );
};

export default GroupDetails;
