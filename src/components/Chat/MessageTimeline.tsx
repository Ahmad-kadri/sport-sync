// src/components/MessageTimeline.tsx

import React from 'react';
import { List, ListItem, Typography, Box } from '@mui/material';
import { User } from '../Group/GroupList';
import useUserInfo from '../Hooks/useUserInfo';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: User;
}

interface MessageTimelineProps {
  messages: Message[];
}

const MessageTimeline: React.FC<MessageTimelineProps> = ({ messages }) => {
  const { userInfo } = useUserInfo()

  return (
    <List sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
      {messages.map((msg) => (
        <ListItem key={msg.id} sx={{ padding: 0 }}>
          <Box
            sx={{
              maxWidth: '80%',
              marginLeft: msg.sender.id === userInfo?.id ? 'auto' : '0',
              marginRight: msg.sender.id === userInfo?.id ? '0' : 'auto',
              backgroundColor: msg.sender.id === userInfo?.id ? '#dcf8c6' : '#fff',
              borderRadius: 2,
              padding: 2,
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender.id === userInfo?.id ? 'flex-end' : 'flex-start'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {msg.sender.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {msg.text}
            </Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default MessageTimeline;