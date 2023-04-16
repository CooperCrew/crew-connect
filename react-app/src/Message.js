import React from 'react';
import { Grid, ListItemText, Link, Tooltip } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';

const Message = ({ message, handleDeleteMessage }) => (
  <Grid item xs={12}>
    <ListItemText align="left" primary={message.text} secondary={"User ID: " + message.sender}></ListItemText>
    <Tooltip title="Delete this message">
    <DeleteOutlined sx={{color: '#a10b0b'}} onClick={() => handleDeleteMessage(message.id, message.sender)}>
      {"Delete"}
    </DeleteOutlined>
    </Tooltip>
  </Grid>
);

export default Message;
