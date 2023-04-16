import React from 'react';
import { Grid, ListItemText, Link } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';

const Message = ({ message, handleDeleteMessage }) => (
  <Grid item xs={12}>
    <ListItemText align="left" primary={message.text} secondary={message.sender}></ListItemText>
    <DeleteOutlined onClick={() => handleDeleteMessage(message.id, message.sender)}>
      {"Delete"}
    </DeleteOutlined>
  </Grid>
);

export default Message;
