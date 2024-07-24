// src/components/GroupDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { Container, Typography, Box, CircularProgress, Button } from '@mui/material';
import GroupDetailsHeader from './GroupDetailsHeader';
import GroupParticipants from './GroupParticipants';
import EditGroup from './EditGroup';
import ChatPanel from '../Chat/ChatPanel';

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false); // State for chat panel
  const navigate = useNavigate(); // Initialize the navigate function

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

  const handleEditOpen = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleDelete = async () => {
    if (groupId) {
      try {
        await deleteDoc(doc(db, 'groups', groupId));
        navigate('/groups');
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleGroupUpdated = () => {
    // Refresh the group details to reflect the updates
    setLoading(true);
    const groupDocRef = doc(db, 'groups', groupId!);
    onSnapshot(groupDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setGroup({ id: docSnapshot.id, ...docSnapshot.data() } as Group);
        setLoading(false);
      }
    });
  };

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
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button
          variant="outlined"
          onClick={() => navigate('/groups')} // Navigate to the GroupList route
        >
          Back to Groups
        </Button>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditOpen}
            sx={{ mr: 2 }}
          >
            Edit Group
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ mr: 2 }}
          >
            Delete Group
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsChatPanelOpen(true)}
          >
            Open Chat
          </Button>
        </Box>
      </Box>
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
          <>
            <GroupDetailsHeader group={group} />
            <GroupParticipants groupId={groupId!} />
          </>
        ) : (
          <Typography>No details available for this group.</Typography>
        )}
      </Box>
      <EditGroup open={isEditDialogOpen} onClose={handleEditClose} groupId={groupId!} onGroupUpdated={handleGroupUpdated} />
      <ChatPanel open={isChatPanelOpen} onClose={() => setIsChatPanelOpen(false)} groupId={groupId!} />
    </Container>
  );
};

export default GroupDetails;