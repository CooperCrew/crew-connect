import React, { useState, useEffect } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Link,
  List,
  Grid,
} from '@mui/material';
import GroupChatList from './GroupChatList';

const ServerList = ({ id, loggedIn, servers, setServers, serverUsers, setServerUsers, setChats, chats, selectedServer, setSelectedServer}) => {
//   const [selectedServer, setSelectedServer] = useState(null);

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
    <>
      <List sx={{ width: '7%' }}>
        <h3>Servers</h3>
        {servers.map((server) => (
          <ListItem
          button
          onClick={() => setSelectedServer(server)}
          selected={selectedServer && selectedServer.id === server.id}
        >
          <ListItemText primary={server.name}></ListItemText>
        </ListItem>
      ))}
    </List>
    {selectedServer && (
      <GroupChatList
        id={id}
        loggedIn={loggedIn}
        chats={chats}
        setChats={setChats}
        serverUsers={serverUsers}
      />
    )}
  </>
);
};

export default ServerList;
