import React, {useState} from 'react';
import { Grid, TextField, List, Divider, Button, ListItem, ListItemIcon, ListItemText, Avatar} from '@mui/material';
import { styled } from '@mui/system';
import Message from './Message';

const CssTextField = styled(TextField)({
    backgroundColor: "#383840",
    "& .MuiInputLabel-root": {
            color: '#8b8b90'
    }
});

const GroupChat = ({ chat, selectedChatId, setSelectedChatId, id, chats, setChats, stompClient, connect, selectedServer}) => { 
    const [message, setMessage] = useState('');

    const buttonSX = {
        "&:hover": {
            backgroundColor: 'lightblue'
        },
        bgcolor: '#5865F2',
        color: 'white',
        m: 1
    }

    if (!chat) {
        return null;
    }

    const handleSendMessage = async (message) => {
        // Check for empty message
        if (message === "") {
            return;
          }
        try {
          connect();
          let messageToSend = {
            groupChatId: selectedChatId,
            userId: id,
            message: message,
            timeSent: Math.floor(Date.now() / 1000),
            "messageId": 0,
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
                const updatedChats = chats.map((chat) => {
                    if (chat.id === selectedChatId) {
                    return {
                        ...chat,
                        messages: [
                        ...chat.messages,
                        {
                            id: data.messageId,
                            sender: id,
                            senderUsername: data.username,
                            text: message,
                        },
                        ],
                    };
                    }
                    return chat;
                });
                setChats(updatedChats);
                setMessage("");
    
            // Send the message through the WebSocket
            stompClient.send(
                `/app/message/${selectedChatId}`,
                {},
                JSON.stringify(data)
            );
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
        setMessage(event.target.value);
        if (event.target.value.toString() === "") {
            setMessage("");
            return;
        }
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
            let DeleteMessage = {
                groupChatId: selectedChatId,
                userId: id,
                message: "DELETE MESSAGE ID: " + messageId,
                timeSent: 0, //indicates message is deleted
                messageId: messageId,
              };
              stompClient.send(
                `/app/message/${selectedChatId}`,
                {},
                JSON.stringify(DeleteMessage)
            );
            
        } catch (error) {
            console.error("Error deleting message:", error);
        }

    }

    const handleLeave = async () => {
        try {
            await fetch(`/groupchat/gcId/${selectedChatId}/userId/${id}`, {
                method: 'DELETE',
            });
            setChats(chats.filter(chat => chat.id !== selectedChatId));
            setSelectedChatId(null);
        } catch (error) {
            console.error("Error leaving group chat:", error);
        }
    }

    return (
            <Grid container direction = "row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                <Grid item alignContent="left" xs={12} md={8} lg={10}>
                    <Grid item>
                        <Grid container direction = "row" spacing={2}>
                            <Grid item xs alignContent="left">
                                <h3>{chat.name}</h3>
                            </Grid>
                            <Grid item alignContent="right">
                                <Button sx={buttonSX} onClick={handleLeave}>
                                    Leave
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item>
                                {chat.messages.map((message, index) => (
                                <Message message={message} handleDeleteMessage={handleDeleteMessage} id = {id} 
                                    // this is to only display the username if the previous message sender is not the same as the current message sender
                                    shouldDisplayUsername={index === 0 || chat.messages[index - 1].sender !== message.sender}/>
                                ))}
                                <Grid item xs>
                                <CssTextField
                                    type="text"
                                    id="message"
                                    name="message"
                                    label="Type Something"
                                    value={message}
                                    onChange={handleNewMessageChange}
                                    onKeyPress={handleKeyPress}
                                    fullWidth
                                    sx={{ input: { color: '#8b8b90' } }}
                                />
                                </Grid>
                        </Grid>
                </Grid>
                </Grid>
                <Grid item alignContent="right" xs={12} md={4} lg={2}>
                    <List>
                        <h3>Members</h3>
                        {chat.users.map((user) => (
                            <ListItem>
                                <ListItemIcon>
                                    <Avatar/>
                                </ListItemIcon>
                                <ListItemText primary={user}></ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
    );
};

export default GroupChat;
