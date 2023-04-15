import React from 'react';
import { Grid, ListItemText, Link } from '@mui/material';

const Message = ({ message, handleDeleteMessage }) => (
  <Grid item xs={12}>
    <ListItemText align="left" primary={message.text} secondary={message.sender}></ListItemText>
    <Link href="#" variant="body2" onClick={() => handleDeleteMessage(message.id, message.sender)}>
      {"Delete"}
    </Link>
  </Grid>
);

export default Message;
