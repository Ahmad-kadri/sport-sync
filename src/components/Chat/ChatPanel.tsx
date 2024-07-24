// src/components/ChatPanel.tsx
import React from 'react';
import { Drawer, TextField, IconButton, Box } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import MessageTimeline from './MessageTimeline';
import { useMessages } from '../Hooks/useMessages';

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ open, onClose, groupId }) => {
  const { messages, message, setMessage, sendMessage } = useMessages(groupId);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 350,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 350,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MessageTimeline messages={messages} />
        <TextField
          label="Type a message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          sx={{ marginTop: 2 }}
        />
        <IconButton onClick={sendMessage} color="primary" sx={{ marginTop: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default ChatPanel;