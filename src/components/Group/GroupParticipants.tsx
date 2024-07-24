import React from 'react';
import { Typography, Box, Divider, List, ListItem, ListItemText } from '@mui/material';
import useFetchParticipants from '../Hooks/useFetchParticipants';

interface Participant {
  id: string;
  name: string;
  surname: string;
  email: string;
}

const GroupParticipants: React.FC<{ groupId: string }> = ({ groupId }) => {
  const participants: Participant[] = useFetchParticipants(groupId);

  return (
    <Box mt={3}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }} role="heading" aria-level={2}>
        Participants
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List aria-label="List of participants">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <ListItem key={participant.id} sx={{ borderBottom: '1px solid #ddd' }} aria-labelledby={`participant-${participant.id}`}>
              <ListItemText
                primary={`${participant.name} ${participant.surname}`}
                secondary={participant.email}
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
            No participants found.
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default GroupParticipants;