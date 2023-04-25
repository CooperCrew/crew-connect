import React, {useState, useEffect} from 'react';
import Login from './Login';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import firebase from 'firebase/app';
import GroupChatList from './GroupChatList';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, AppBar, Toolbar, Typography, Paper, CssBaseline, Divider, TextField, Button, Box, List, ListItem, ListItemIcon, Avatar, ListItemText, Stack} from '@mui/material';
import { styled } from '@mui/system';
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';

// Main application

const App = () => {
    // Variable Declarations
    const [loggedIn, setLoggedIn] = useState(false); // Boolean for logging in
    const [chats, setChats] = useState([]); // List of chats    
    const [inputPassword, setInputPassword] = useState("");
    const [id, setId] = useState(0); // Add this line to manage `id` using useState
    const [inputEmail, setInputEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [chatName, setChatName] = useState("My Chat ");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [userName, setUserName] = useState("");
    const [newError, setNewError] = useState("");
    
    const theme = createTheme();

    // CSS Specifications

    const buttonSX = {
        "&:hover": {
            backgroundColor: 'lightblue'
        },
        bgcolor: "#5865F2",
        color: 'white',
        maxHeight: '50px',
        m: 1
    }
    
    const CssTextField = styled(TextField)({
        backgroundColor: "#383840",
        "& .MuiInputBase-root": {
            "& input": {
                color: 'white'
            }
        }
    });

    const textSX = {
        color: '#f2f3f5',
        m: 2,
        backgroundColor: "#313338"
    };

    const av_src = "https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg";

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
            const response2 = await fetch(`/user/id/${encodeURIComponent(id)}`);
            const data2 = await response2.json();
            console.log("Getting Username");
            console.log(data2.username);
            setUserName(data2.username);
          })
          .catch((error) => {
            console.error("Error logging in:", error.message);
          })
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
                    setNewError(`Invalid username or incorrect format: ${user}. Users should be comma delimited, like "User1, User2".`);
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
            setNewError("");
        } catch (error) {
            console.error("Error creating new chat:", error);
        }
        
    };

    // Function for toggling the popup
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const togglePopup2 = () => {
        setIsOpen2(!isOpen2);
    }

    // Handler for when the form to create the chat is submitted
    const handlePopupCreate = (event) => {
        event.preventDefault();
        handleCreateChat(users, chatName);
        togglePopup();
    };

    // Handler for when the form to change the account info
    const handlePopup2Create = (event) => {
        alert("New Info: \n"+"Username: "+ userName +"\nEmail: "+inputEmail+"\nPassword: "+inputPassword);
        togglePopup2();
    };

    // Return main HTML for home page
    return (
        <div className="App" class="force-gray">
            <ThemeProvider theme={theme}>
                <Grid container component={Paper} sx={{backgroundColor: "#313338"}}>
                    <Grid item xs={12} >
                        <Typography variant="h5" className="header-message" sx={{color: 'white', m: 2}}>CrewConnect</Typography>
                    </Grid>
                </Grid>
                <Grid container component={Paper} sx={{backgroundColor: "#313338"}}>
                    <Grid item xs={3}>
                        <Stack direction="row">
                        <Grid item alignContent="left">
                        <List sx={textSX}>
                            <ListItem key={id}>
                                <ListItemIcon>
                                    <Avatar src={av_src} />
                                </ListItemIcon>
                                <ListItemText primary={userName}></ListItemText>
                            </ListItem>
                        </List>
                        </Grid>
                        <Grid item alignContent="right">
                        <Button onClick={() => { 
                            signOut(getAuth()); 
                            handleLogout(); 
                            }} 
                            className="bottom" 
                            sx={buttonSX}>
                            Log Out
                        </Button>
                        <Button 
                            onClick={togglePopup}
                            sx={buttonSX}>
                            New Chat
                        </Button>
                        <Button 
                            onClick={togglePopup2}
                            sx={buttonSX}>
                            Manage Account
                        </Button>
                        </Grid>
                        </Stack>
                        {isOpen && (<CssBaseline sx={{m: 2, backgroundColor: "#313338"}}>
                                <Typography variant="h5" className="header-message" sx={{color: 'white', m: 2}}>Create New Chat</Typography>
                                <Box>
                                    <Stack direction="row"><CssTextField
                                        type="text"
                                        id="name"
                                        placeholder="Chat Name"
                                        size="15"
                                        onChange={(event) => {setChatName(event.target.value);}}
                                        error={newError!==""}
                                        sx={{ m: 2, input: { color: '#8b8b90' } }}
                                    />
                                    <CssTextField
                                        type="text" 
                                        id="users" 
                                        placeholder="Users"
                                        size="85"
                                        required
                                        value={users} 
                                        onChange={(event) => setUsers(event.target.value.split(","))} 
                                        error={newError!==""}
                                        helperText={newError}
                                        sx={{ m: 2, input: { color: '#8b8b90' } }}
                                    />
                                    </Stack>
                                    <Divider/>
                                    <Button onClick={handlePopupCreate} sx={buttonSX}>Create</Button> <Button onClick={togglePopup} sx={buttonSX}>CANCEL</Button>
                                </Box></CssBaseline>
                        )}
                        {isOpen2 && (<CssBaseline sx={{m: 2, backgroundColor: "#313338"}}>
                                <Typography variant="h5" className="header-message" sx={{color: 'white', m: 2}}>Change Account Info</Typography>
                                <Typography variant="p" className="header-message" sx={{color: 'white', m: 2}}>Input new desired account information.</Typography>
                                <Box>
                                    <Stack direction="column"><CssTextField
                                        type="text"
                                        id="name"
                                        placeholder="Username"
                                        size="15"
                                        onChange={(event) => {setUserName(event.target.value);}}
                                        error={newError!==""}
                                        sx={{ m: 2, input: { color: '#8b8b90' } }}
                                    />
                                    <CssTextField
                                        type="text" 
                                        id="users" 
                                        placeholder="Email"
                                        size="85"
                                        required
                                        value={users} 
                                        onChange={(event) => {setInputEmail(event.target.value);}} 
                                        error={newError!==""}
                                        helperText={newError}
                                        sx={{ m: 2, input: { color: '#8b8b90' } }}
                                    />
                                    <CssTextField
                                        type="text" 
                                        id="users" 
                                        placeholder="Password"
                                        size="85"
                                        required
                                        value={users} 
                                        onChange={(event) => {setInputPassword(event.target.value);}} 
                                        error={newError!==""}
                                        helperText={newError}
                                        sx={{ m: 2, input: { color: '#8b8b90' } }}
                                    />
                                    </Stack>
                                    <Divider/>
                                    <Button onClick={handlePopup2Create} sx={buttonSX}>Save</Button> <Button onClick={togglePopup2} sx={buttonSX}>CANCEL</Button>
                                </Box></CssBaseline>
                        )}
                        
                    </Grid>
                </Grid>
                <Grid sx={textSX}>
                    <GroupChatList id ={id} loggedIn = {loggedIn} chats = {chats} setChats = {setChats}/>
                </Grid>
            </ThemeProvider>
        </div>
      );
    }
    
export default App;