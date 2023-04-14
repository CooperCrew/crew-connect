import React, {useState, useEffect} from 'react';
import Login from './Login';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import firebase from 'firebase/app';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
 import Link from '@mui/material/Link';


// Main application

const App = () => {

    // Variable Declarations
    const [loggedIn, setLoggedIn] = useState(false); // Boolean for logging in
    const [selectedChatId, setSelectedChatId] = useState(null); // Integer for chat selection
    const [chats, setChats] = useState([]); // List of chats    
    // const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [id, setId] = useState(0); // Add this line to manage `id` using useState
    const [inputEmail, setInputEmail] = useState("");
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [chatName, setChatName] = useState("My Chat ");
    const [isOpen, setIsOpen] = useState(false);
    const [messageText, setMessageText] = useState('');

    const theme = createTheme();

    // new useeffect hook for signing in with firebase auth
    useEffect(() => {
        if (!inputEmail || !inputPassword) return;
    
        const auth = getAuth();
        signInWithEmailAndPassword(auth, inputEmail, inputPassword)
          .then(async (userCredential) => {
            const user = userCredential.user;
            const userEmail = user.email;
    
            // Fetch user data by email from your database
            const response = await fetch(
              `/user/email/${encodeURIComponent(userEmail)}`
            );
            const data = await response.json();
            setId(data.userId);
            setLoggedIn(true);
          })
          .catch((error) => {
            console.error("Error logging in:", error.message);
          });
      }, [inputEmail, inputPassword]);   

    // use effect hook for getting groupchats and contents
    useEffect(() => {
        if (!loggedIn) return;
        const fetchGroupChatUsers = async (groupChatId) => {
            console.log("got here 2");
            const response = await fetch(`/groupchats/` + groupChatId + `/users`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            return data.map(user => user.username);
        };
    
        const fetchGroupChatMessages = async (groupChatId) => {
            const response = await fetch(`/message/groupID/` + groupChatId, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            return data.map(message => ({ sender: message.userId, text: message.message }));
        };
    
        const fetchGroupChats = async () => {
            console.log("got here 3");
            const response = await fetch(`/groupchats/userId/` + id, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            const newChats = await Promise.all(data.map(async entry => {
                const users = await fetchGroupChatUsers(entry["groupChatId"]);
                const messages = await fetchGroupChatMessages(entry["groupChatId"]);
                return {
                    id: entry["groupChatId"],
                    users,
                    name: entry["groupName"],
                    messages,
                };
            }));
            setChats(newChats);
        };
    
        fetchGroupChats();
    }, [loggedIn, id]);

    // Showing the login page
    if (!loggedIn) {
        return (
          <Login
            onLogin={(email, password) => {
              setInputEmail(email);
              setInputPassword(password);
            }}
          />
        );
      }

    // Handler for logging out
    const handleLogout = () => {
        setLoggedIn(false);
        setInputEmail("");
        setInputPassword("");
    };

    // Handler for clicking on a chat to view it
    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
    };

    // Handler for creating a new chat
    const handleCreateChat = async (users, name) => {
        const fetchUserIdByUsername = async (username) => {
            const response = await fetch(`/user/username/${encodeURIComponent(username)}`);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                return data.userId;
            } else {
                return null;
            }
        };

        const fetchUsernameById = async (id) => {
            const response = await fetch(`/user/id/${encodeURIComponent(id)}`);
            const data = await response.json();
            console.log(data);
            return data.username;
        };

        const currentDate = new Date().toISOString().split('T')[0];
        try {
            // Format the users array correctly
            const currentUsername = await fetchUsernameById(id);
            users.push(currentUsername);
            users = users.filter(user => user).map(user => user.trim()).filter(user => user.length > 0);
            users = [...new Set(users)];

            // Create the new group chat
            let jsonData = {"groupName": name, "groupSize": users.length, "dateCreated": currentDate}
            const response = await fetch(`/groupchat`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            }).catch(error => console.error("Error in creating group chat fetch:", error));

            if (!response.ok) {
                throw new Error("Error creating new chat");
            }

            // Get the group chat object by name
            const groupChatResponse = await fetch(`/groupchat/name/${encodeURIComponent(name)}`);
            const groupChatData = await groupChatResponse.json();
            const groupChatId = groupChatData["groupChatId"];
            
            // Add users to the group chat
            for (const user of users) {
                const userId = await fetchUserIdByUsername(user);

                if (userId === null) {
                    alert(`Invalid username or incorrect format: ${user}. Users should be comma delimited, like "User1, User2".`);
                    continue;
                }
                await fetch(`/groupchat/gcId/` + groupChatId + "/userId/" + userId, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).catch(error => console.error("Error in adding users fetch:", error));
            }

            const newChat = { id: groupChatId, users, name, messages: [] };
            setChats([...chats, newChat]);
            setSelectedChatId(groupChatId);
        } catch (error) {
            console.error("Error creating new chat:", error);
        }
    };


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
    } catch (error) {
        console.error("Error sending message:", error);
        }   
        
    };
      
    const handleDeleteMessage = () => {
        console.log("Message Delete!");
    }

    const handleLeave = () => {
        console.log("Bye!");
    }

    // Showing the selected chat
    if (selectedChatId) {
        const selectedChat = chats.find((chat) => chat.id === selectedChatId);
        // return ( <Chat 
        //     chat={selectedChat} 
        //     setSelectedChatId={setSelectedChatId} 
        //     onSendMessage={handleSendMessage}
        //     />
        // );
    }
    

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSendMessage(message);
        }
    };

    const handleNewMessageChange = (event) => {
        if (event.target.value === "") {
            return;
        }
        setMessage(event.target.value);
    };

    // Function for toggling the popup

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    // Handler for when the form to create the chat is submitted

    const handlePopupCreate = (event) => {
        event.preventDefault();
        handleCreateChat(users, chatName);
        togglePopup();
    };


    // Return main HTML for home page
    return (
        <div>
            <ThemeProvider theme={theme}> 
                <Grid container component={Paper}>
                    <Grid item xs={12} >
                        <Typography variant="h5" className="header-message">CrewConnect</Typography>
                    </Grid>
                </Grid>
                <Grid container component={Paper}>
                    <Grid item xs={3}>
                        <Button onClick={() => { 
                            signOut(getAuth()); 
                            handleLogout(); 
                            }} 
                            className="bottom" 
                            >Log Out</Button>
                        <Button onClick={togglePopup}>New Chat</Button>
                        {isOpen && (<>
                                <h3>Create New Chat</h3>
                                <Grid>
                                    <TextField
                                        type="text"
                                        id="name"
                                        placeholder="Chat Name"
                                        size="15"
                                        onChange={(event) => {setChatName(event.target.value);}}
                                    />
                                    <TextField
                                        type="text" 
                                        id="users" 
                                        placeholder="Users"
                                        size="85"
                                        required
                                        value={users} 
                                        onChange={(event) => setUsers(event.target.value.split(","))} 
                                    />
                                    <Button onClick={handlePopupCreate}>Create</Button> <Button onClick={togglePopup}>CANCEL</Button>
                                </Grid></>
                        )}
                
                    <List>
                        <ListItem button key={id}>
                            <ListItemIcon>
                                <Avatar src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.personality-insights.com%2Fdefault-profile-pic%2F&psig=AOvVaw1CZ4o8DO5MP2OWNPx80G7p&ust=1681537567328000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCOCSy-DVqP4CFQAAAAAdAAAAABAR" />
                            </ListItemIcon>
                            <ListItemText primary={id}></ListItemText>
                        </ListItem>
                    </List>
                    <Divider />
                    <Divider />
                    <List>
                    <h3>Your Chats</h3>
                        {chats.map((chat) => (
                            <ListItem button key={chat.id} onClick={() => handleSelectChat(chat.id)}>
                            <ListItemIcon>
                                <Avatar alt={chat.name} src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.personality-insights.com%2Fdefault-profile-pic%2F&psig=AOvVaw1CZ4o8DO5MP2OWNPx80G7p&ust=1681537567328000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCOCSy-DVqP4CFQAAAAAdAAAAABAR" />
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
                    <h3>{chats.find((chat) => chat.id === selectedChatId)?.name}</h3>
                    <List>
                        {selectedChatId && (
                            <Grid container>
                                {chats.find((chat) => chat.id === selectedChatId).messages.map((message, index) => (
                                    <Grid item xs={12}>
                                        <ListItemText align="left" primary={message.text} secondary={message.sender}></ListItemText>
                                        <Link href="#" variant="body2" onClick={handleDeleteMessage}>
                                            {"Delete"}
                                        </Link>
                                    </Grid>
                                ))} 
                                
                                <Grid item xs={11}>
                                    <TextField id="outlined-basic-email" label="Type Something" 
                                        value={message} 
                                        onChange={handleNewMessageChange} 
                                        onKeyPress={handleKeyPress} 
                                    fullWidth />
                                </Grid>
                                {/* <Grid xs={1} align="right">
                                    <Fab color="primary" aria-label="add" onClick={handleSendMessage}><SendIcon /></Fab>
                                </Grid> */}
                            </Grid>
                        )}
                    </List>
                    <Divider/>
                </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
  
};

export default App;