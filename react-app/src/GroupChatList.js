import React, {useState, useEffect} from 'react';
import { ListItem, ListItemIcon, ListItemText, Avatar, Link, List, Grid } from '@mui/material';
import GroupChat from './GroupChat';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

var stompClient = null;
let currentChatId = null;
var subscription = null;
const GroupChatList = ({ id, loggedIn, chats, setChats}) => {
    // Variable Declarations
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [connectedToSocket, setConnectedToSocket] = useState(false);

    const connect = () => {
        if (!connectedToSocket){
            let Sock = new SockJS('http://localhost:8080/ws');
            stompClient = Stomp.over(Sock);
            setConnectedToSocket(true);
            stompClient.connect({}, onConnect, onError);
        } else {
            if(subscription) {
                subscription.unsubscribe();
                subscription = stompClient.subscribe(`/chatroom/${currentChatId}`, OnMessageObtained);
            }
        }
    }

    const OnMessageObtained = (payload) => {
        let newMessage = JSON.parse(payload.body);
        console.log(newMessage);
        if(newMessage.timeSent != 0) {
            setChats((prevChats) => {
                return prevChats.map((chat) => {
                    if (chat.id === newMessage.groupChatId ) {
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
            });
        }
        if(newMessage.timeSent == 0) {
            setChats((prevChats) => {
            return prevChats.map((chat) => {
                    if (chat.id === newMessage.groupChatId ) {
                            return {
                                ...chat,
                                messages: chat.messages.filter(message => message.id !== newMessage.messageId),
                            };
                            }
                return chat;
            });
        });                                  
        }
    }

    const onConnect= () => {
        //console.log("it connected;");   
        subscription = stompClient.subscribe(`/chatroom/${currentChatId}`, OnMessageObtained);
    }
    
    const onError = () => {
        console.log("Failed to join websocket");
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
