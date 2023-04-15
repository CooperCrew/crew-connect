import React, {useState, useEffect} from 'react';
import { ListItem, ListItemIcon, ListItemText, Avatar, Link, List, Grid } from '@mui/material';
import GroupChat from './GroupChat';

const GroupChatList = ({ id, loggedIn, chats, setChats}) => {
    // Variable Declarations
    const [selectedChatId, setSelectedChatId] = useState(null);
    // Handler for clicking on a chat to view it
    const handleSelectChat = (chatId, id) => {
        setSelectedChatId(chatId);
        // connect(selectedChatId);
    };

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
                <Link href="#" variant="body2" onClick={handleLeave}>
                    {"Leave"}
                </Link>
                </ListItem>
                ))}
            </List>
        </Grid>
        <Grid item xs={9}>
            {selectedChatId && (
                <GroupChat
                    chat={chats.find((chat) => chat.id === selectedChatId)}
                    selectedChatId = {selectedChatId}
                    id = {id}
                    chats = {chats}
                    setChats = {setChats}
                />
            )}
        </Grid>
    </Grid>
    );
};

export default GroupChatList;
