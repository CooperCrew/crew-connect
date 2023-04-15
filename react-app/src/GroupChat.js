import React, {useState, useEffect} from 'react';
import { Grid, TextField, List, Divider } from '@mui/material';
import Message from './Message';

const GroupChat = ({ chat, selectedChatId, id, chats, setChats}) => { 
    const [message, setMessage] = useState('');

    const handleSendMessage = async (message) => {
        try {
            let messageToSend = {
                groupChatId: selectedChatId,
                userId: id,
                message: message,
                timeSent: Math.floor(Date.now() / 1000),
                "messageId": 0
            };
            console.log(messageToSend);
            // Send the message to the server
            const response = await fetch("/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(messageToSend),
            });
            if (response.ok) {
                const data = await response.json();
                const updatedChats = chats.map(chat => {
                    if (chat.id === selectedChatId) {
                        return {
                            ...chat,
                            messages: [...chat.messages, {
                                id: data.messageId,
                                sender: id,
                                text: message
                            }],
                        };
                    }
                    return chat;
                });
                setChats(updatedChats);
                setMessage('');
            } else {
                throw new Error("Error sending message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }


    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSendMessage(message);
        }
    }
    
    const handleNewMessageChange = (event) => {
        if (event.target.value === "") {
            return;
        }
        setMessage(event.target.value);
    }

    const handleDeleteMessage = async (messageId, senderId) => {
        if (id !== senderId){
            alert("That is not your messsage! You can't delete it.");
            return;
        }
        try {
            await fetch(`/message/${messageId}`, {
                method: 'DELETE',
            });
            const updatedChats = chats.map(chat => {
                if (chat.id === selectedChatId) {
                    return {
                        ...chat,
                        messages: chat.messages.filter(message => message.id !== messageId),
                    };
                }
                return chat;
            });
            setChats(updatedChats);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    }

    return (
        <Grid item xs={9}>
            <h3>{chat.name}</h3>
                <List>
                    <Grid container>
                        {chat.messages.map((message, index) => (
                        <Message key={index} message={message} handleDeleteMessage={handleDeleteMessage} />
                        ))}
                        <Grid item xs={11}>
                        <TextField
                            id="outlined-basic-email"
                            label="Type Something"
                            value={message}
                            onChange={handleNewMessageChange}
                            onKeyPress={handleKeyPress}
                            fullWidth
                        />
                        </Grid>
                    </Grid>
                </List>
            <Divider />
        </Grid>
    );
};

export default GroupChat;
