import React from 'react';
import { Grid, ListItemText, Link, Tooltip } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';

const Message = ({ message, handleDeleteMessage }) => {
  console.log('Message:', message);
  return (
  <Grid item xs={12}>
    <b sx={{color: "grey"}}>{message.senderUsername}</b>
    <ListItemText align="left" primary={message.text}></ListItemText>
    <Tooltip title="Delete this message">
    <DeleteOutlined sx={{color: '#a10b0b'}} onClick={() => handleDeleteMessage(message.id, message.sender)}>
      {"Delete"}
    </DeleteOutlined>
    </Tooltip>
  </Grid> 
  );
};

export default Message;
