import React from 'react';
import { Typography, Box, Divider } from '@mui/material';

interface Group {
  title: string;
  description: string;
  location: string;
  time: string;
}

const GroupDetailsHeader: React.FC<{ group: Group }> = ({ group }) => {
  return (
    <Box >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
        {group.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
        {group.description}
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Location:</strong> {group.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Time:</strong> {new Date(group.time).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default GroupDetailsHeader;
