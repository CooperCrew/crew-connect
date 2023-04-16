import React, {useState, useEffect} from 'react';
import { Grid, TextField, List, Divider, Link} from '@mui/material';
import Message from './Message';

const GroupChat = ({ chat, selectedChatId, setSelectedChatId, id, chats, setChats, stompClient, connect}) => { 
    const [message, setMessage] = useState('');

    const handleSendMessage = async (message) => {
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
                // const updatedChats = chats.map((chat) => {
                //     if (chat.id === selectedChatId) {
                //     return {
                //         ...chat,
                //         messages: [
                //         ...chat.messages,
                //         {
                //             id: data.messageId,
                //             sender: id,
                //             text: message,
                //         },
                //         ],
                //     };
                //     }
                //     return chat;
                // });
                // setChats(updatedChats);
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
         //   const updatedChats = chats.map(chat => {
           //     if (chat.id === selectedChatId) {
           //         return {
            //            ...chat,
              //          messages: chat.messages.filter(message => message.id !== messageId),
               //     };
              //  }
              //  return chat;
           // });
          
           // setChats(updatedChats);
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
        <Grid item xs={9}>
            <h3>{chat.name}</h3>
                <List>
                    <Grid container>
                        <Link href="#" variant="body2" onClick={handleLeave}>
                        {"Leave"}
                        </Link>
                    </Grid>
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
