import React, { useEffect } from 'react';
import { Drawer, TextField, IconButton, Box } from '@mui/material';
import { Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
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
      aria-labelledby="chat-panel-title"
      aria-describedby="chat-panel-description"
    >
      <Box sx={{ paddingX: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton 
            onClick={onClose} 
            color="primary" 
            sx={{ margin: 1 }}
            aria-label="Close chat panel"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <MessageTimeline messages={messages} />
        <Box sx={{ display: 'flex', margin: 1 }}>
          <TextField
            label="Type a message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            sx={{ marginTop: 2 }}
            aria-label="Message input"
          />
          <IconButton 
            onClick={sendMessage} 
            color="primary" 
            sx={{ marginLeft: 2, marginTop: 2, borderRadius: 1, padding: 2, backgroundColor: "aliceblue" }}
            aria-label="Send message"
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatPanel;