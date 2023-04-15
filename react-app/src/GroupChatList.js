import React, {useState, useEffect} from 'react';
import { ListItem, ListItemIcon, ListItemText, Avatar, Link, List, Grid } from '@mui/material';
import GroupChat from './GroupChat';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

var stompClient = null;
let currentChatId = null;

const GroupChatList = ({ id, loggedIn, chats, setChats}) => {
    // Variable Declarations
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [connectedToSocket, setConnectedToSocket] = useState(false);

    const connect = () => {
        if (!connectedToSocket){
            let Sock = new SockJS('http://localhost:8080/ws');
            stompClient = Stomp.over(Sock);
            setConnectedToSocket(true);
        }
        stompClient.connect({}, onConnect, onError);
    }

    const OnMessageObtained = (payload) => {
        let newMessage = JSON.parse(payload.body);
        console.log(newMessage);

        const updatedChats = chats.map((chat) => {
            if (chat.id === newMessage.groupChatId) {
                return {
                ...chat,
                messages: [
                    ...chat.messages,
                    {
                    id: newMessage.messageId,
                    sender: newMessage.userId,
                    text: newMessage.message,
                    },
                ],
                };
            }
            return chat;
            });
            setChats(updatedChats);
    }

    const onConnect= () => {
        console.log("it connected;");   
        stompClient.subscribe(`/chatroom/${currentChatId}`, OnMessageObtained);
        
    }
    
    const onError = () => {
        console.log("It failed");
    }
    
    // Handler for clicking on a chat to view it
    const handleSelectChat = (chatId, id) => {
        setSelectedChatId(chatId);
        currentChatId = chatId;
        connect();
    };

    return (
    <Grid container>
        <Grid item xs={3}>
            <List>
            <h3>Your Chats</h3>
            {chats.map((chat) => (
                <ListItem button key={chat.id} onClick={() => handleSelectChat(chat.id)}>
                <ListItemIcon>
                    <Avatar alt={chat.name}/>
                </ListItemIcon>
                <ListItemText primary={chat.name}>{chat.name}</ListItemText>
                <ListItemText secondary={chat.users.map((user) => (
                    <span>{user}&emsp;</span>
                ))} align="right"></ListItemText>
                </ListItem>
                ))}
            </List>
        </Grid>
        <Grid item xs={9}>
            {selectedChatId && (
                <GroupChat
                    chat={chats.find((chat) => chat.id === selectedChatId)}
                    selectedChatId = {selectedChatId}
                    setSelectedChatId = {setSelectedChatId}
                    id = {id}
                    chats = {chats}
                    setChats = {setChats}
                    stompClient={stompClient}
                    connect={connect}
                />
            )}
        </Grid>
    </Grid>
    );
};

export default GroupChatList;
