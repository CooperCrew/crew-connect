import React, {useState, useEffect} from 'react';
import { ListItem, ListItemIcon, ListItemText, Avatar, Link, List, Grid, Stack } from '@mui/material';
import GroupChat from './GroupChat';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

var stompClient = null;
let currentChatId = null;
var subscription = null;
const GroupChatList = ({ id, loggedIn, chats, setChats, inviteCode, selectedServer}) => {
    // Variable Declarations
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [connectedToSocket, setConnectedToSocket] = useState(false);

    const connect = () => {
        if (!connectedToSocket){
            let Sock = new SockJS('/ws');
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
        if(newMessage.timeSent != 0 && newMessage.userId !== id) {
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
                                    senderUsername: newMessage.username,
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
    
    const fetchGroupChatMessages = async (chatId) => {
        try {
            const response = await fetch(`/message/groupID/${chatId}`);
            const data = await response.json();
            console.log(data);
            setChats((prevChats) => {
                return prevChats.map((chat) => {
                    if (chat.id === chatId) {
                        return {
                            ...chat,
                            messages: Array.isArray(data)
                                ? data.map((message) => ({
                                      id: message.messageId,
                                      sender: message.userId,
                                      senderUsername: message.username,
                                      text: message.message,
                                  }))
                                : [],
                        };
                    }
                    return chat;
                });
            });
        } catch (error) {
            console.error("Error fetching group chat messages:", error);
        }
    };

    // Handler for clicking on a chat to view it
    const handleSelectChat = (chatId, id) => {
        setSelectedChatId(chatId);
        fetchGroupChatMessages(chatId);
        currentChatId = chatId;
        connect();
    };

    return (
    <Grid container direction="row">
        <Grid item xs={12} md={4} lg={2.2}>
            <List>
            <h3>Channels</h3>
            {chats.map((chat) => (
                <ListItem button key={chat.id} onClick={() => handleSelectChat(chat.id)}>
                <ListItemIcon>
                    <Avatar alt={chat.name}/>
                </ListItemIcon>
                <ListItemText primary={chat.name}>{chat.name}</ListItemText>
                </ListItem>
                ))}
            </List>
        </Grid>
        <Grid item xs={12} md={8} lg={9.8}>
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
                    selectedServer = {selectedServer}
                />
            )}
        </Grid>
    </Grid>
    );
};

export default GroupChatList;
