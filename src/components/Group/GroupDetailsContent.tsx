import React from 'react';
import { Box, Typography } from '@mui/material';
import GroupDetailsHeader from './GroupDetailsHeader';
import GroupParticipants from './GroupParticipants';

interface Group {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
}

interface GroupDetailsContentProps {
  group: Group | null;
  groupId: string;
}

const GroupDetailsContent: React.FC<GroupDetailsContentProps> = ({ group, groupId }) => {
  return (
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
          <GroupParticipants groupId={groupId} />
        </>
      ) : (
        <Typography>No details available for this group.</Typography>
      )}
    </Box>
  );
};

export default GroupDetailsContent;