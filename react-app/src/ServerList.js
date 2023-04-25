import React, {useState, useEffect} from 'react';
import { ListItem, ListItemIcon, ListItemText, Avatar, Link, List, Grid } from '@mui/material';
import GroupChat from './GroupChat';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';


const ServerList = ({ id, loggedIn, servers, setServers}) => {   

    return (
        <List sx={{width: '7%'}}>
            <h3>Servers</h3>
            {servers.map((server) =>
            <ListItem button>
                <ListItemText primary={server.name}></ListItemText>
            </ListItem>
            )}
        </List>
    )
}

export default ServerList;