import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { Container, CircularProgress } from '@mui/material';
import EditGroup from './EditGroup';
import ChatPanel from '../Chat/ChatPanel';
import GroupDetailsActions from './GroupDetailsActions';
import GroupDetailsContent from './GroupDetailsContent';

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
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!groupId) return;

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
        <CircularProgress aria-live="polite" />
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <GroupDetailsActions
        onEditOpen={handleEditOpen}
        onDelete={handleDelete}
        onChatOpen={() => setIsChatPanelOpen(true)}
      />
      <GroupDetailsContent
        group={group}
        groupId={groupId!}
      />
      <EditGroup 
        open={isEditDialogOpen} 
        onClose={handleEditClose} 
        groupId={groupId!} 
        onGroupUpdated={handleGroupUpdated}
        aria-label="Edit Group Dialog"
      />
      <ChatPanel 
        open={isChatPanelOpen} 
        onClose={() => setIsChatPanelOpen(false)} 
        groupId={groupId!}
        aria-label="Chat Panel"
      />
    </Container>
  );
};

export default GroupDetails;