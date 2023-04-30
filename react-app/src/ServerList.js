import React, { useEffect } from 'react';
import {ListItem, ListItemText, List, Grid} from '@mui/material';
import GroupChatList from './GroupChatList';
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';

const ServerList = ({ id, loggedIn, servers, setServers, serverUsers, setServerUsers, setChats, chats, selectedServer, setSelectedServer, inviteCode}) => {

  const fetchGroupChatUsers = async (groupChatId) => {
    const response = await fetch(`/groupchats/` + groupChatId + `/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.map((user) => user.username);
  };

  const fetchGroupChatMessages = async (groupChatId) => {
    const response = await fetch(`/message/groupID/` + groupChatId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.map((message) => ({
      id: message.messageId,
      sender: message.userId,
      senderUsername: message.username, 
      text: message.message,
    }));
  };
  

  const fetchServerUsers = async (serverId) => {
    const response = await fetch(`/server/` + serverId + `/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setServerUsers(data);
  };

  useEffect(() => {
    if (!selectedServer) return;

    const fetchGroupChats = async () => {
      const response = await fetch(
        `/server/${encodeURIComponent(selectedServer.id)}/user/${encodeURIComponent(id)}/groupchats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      const newChats = await Promise.all(
        data.map(async (entry) => {
          const users = await fetchGroupChatUsers(entry['groupChatId']);
          const messages = await fetchGroupChatMessages(entry['groupChatId']);
          return {
            id: entry['groupChatId'],
            users,
            name: entry['groupName'],
            messages,
          };
        })
      );
      setChats(newChats);
    };

    fetchGroupChats();
    fetchServerUsers(selectedServer.id);
  }, [selectedServer]);

  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={12} md={3} lg={2}><List>
        <h3>Servers</h3>
        {servers.map((server) => (
          <ListItem
          button
          onClick={() => {
            setSelectedServer(server);
          }}
          selected={selectedServer && selectedServer.id === server.id}
        >
          <ListItemText primary={server.name}></ListItemText>
        </ListItem>
      ))}
    </List></Grid>
    {selectedServer && (
      <Grid item xs={12} md={9} lg={10}>
      <GroupChatList
        id={id}
        loggedIn={loggedIn}
        chats={chats}
        setChats={setChats}
        serverUsers={serverUsers}
        selectedServer = {selectedServer}
      />
      </Grid>
    )}
    
  </Grid>
);
};

export default ServerList;
