import React, { useState } from 'react';
import { Grid, ListItemText, Tooltip } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';

const Message = ({ message, handleDeleteMessage, id, shouldDisplayUsername }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const renderDeleteIcon = () => {
    if (id === message.sender && isHovering) {
      return (
        <Tooltip title="Delete this message">
          <DeleteOutlined
            sx={{ color: '#a10b0b', position: 'relative', right: 0 }}
            onClick={() => handleDeleteMessage(message.id, message.sender)}
          >
            {'Delete'}
          </DeleteOutlined>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <Grid item xs={12} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Grid container alignItems="center">
        <Grid item xs>
          {shouldDisplayUsername && <b sx={{ color: 'grey' }}>{message.senderUsername}</b>}
          <ListItemText align="left" primary={message.text}></ListItemText>
        </Grid>
        {renderDeleteIcon()}
      </Grid>
    </Grid>
  );
};

export default Message;
