import React, {useState, useEffect} from 'react';
import Login from './Login';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import firebase from 'firebase/app';
import GroupChatList from './GroupChatList';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, AppBar, Toolbar, Typography, Paper, testSX, CssBaseline, Divider, TextField, Button, Box, List, ListItem, ListItemIcon, Avatar, ListItemText} from '@mui/material';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
var stompClient = null;

// Main application
const connect = (groupChatId) => {
    let Sock = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(Sock);
    stompClient.connect({}, onConnect, onError);
        
}
const onConnect= () => {
    console.log("it connected;");
    stompClient.subscribe('/chatroom/1', console.log("hello"));
    let messageToSend = {
    groupChatId: 1,
    userId: 23,
    message: "hello",
    timeSent: Math.floor(Date.now() / 1000),
    "messageId": 0
};

    stompClient.send("/app/message/1", {}, JSON.stringify(messageToSend));
}
const onError = () => {
    console.log("It failed");
}

const App = () => {
    // Variable Declarations
    const [loggedIn, setLoggedIn] = useState(false); // Boolean for logging in
    const [selectedChatId, setSelectedChatId] = useState(null); // Integer for chat selection
    const [chats, setChats] = useState([]); // List of chats    
    const [inputPassword, setInputPassword] = useState("");
    const [id, setId] = useState(0); // Add this line to manage `id` using useState
    const [inputEmail, setInputEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [chatName, setChatName] = useState("My Chat ");
    const [isOpen, setIsOpen] = useState(false);
    
    const theme = createTheme();
    //connect to socket
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
        // if (!loggedIn) return;
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
            return data.map(message => ({
                id: message.messageId,
                sender: message.userId,
                text: message.message
            }));
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


    // Showing the selected chat
    if (selectedChatId) {
        const selectedChat = chats.find((chat) => chat.id === selectedChatId);
    }

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
        <div className="App">
            <ThemeProvider theme={theme}>
                <Grid container component={Paper}>
                    <Grid item xs={12} >
                        <Typography variant="h5" className="header-message" sx={{color: 'purple', m: 2}}>CrewConnect</Typography>
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
                    </Grid>
                </Grid>
                <Grid container>
                    <GroupChatList id ={id} loggedIn = {loggedIn} chats = {chats} setChats = {setChats}/>
                </Grid>
            </ThemeProvider>
        </div>
      );
    }
    
export default App;