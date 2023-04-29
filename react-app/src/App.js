import React, {useState, useEffect, useRef} from 'react';
import Login from './Login';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateEmail, updatePassword} from 'firebase/auth';
import firebase from 'firebase/app';
import GroupChatList from './GroupChatList';
import ServerList from './ServerList';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, AppBar, Toolbar, Typography, Paper, CssBaseline, Divider, TextField, Button, Box, List, ListItem, ListItemIcon, Avatar, ListItemText, Stack, Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import { styled } from '@mui/system';
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';

const CssTextField = styled(TextField)({
    backgroundColor: "#383840",
    "& .MuiInputBase-root": {
        "& input": {
            color: 'white'
        }
    }, 
    "& .MuiInputLabel-root": {
        color: '#8b8b90'
    },
});

// Main application

const App = () => {
    // Variable Declarations
    const [loggedIn, setLoggedIn] = useState(false); // Boolean for logging in
    const [chats, setChats] = useState([]); // List of chats    
    const [inputPassword, setInputPassword] = useState("");
    const [id, setId] = useState(0); // Add this line to manage `id` using useState
    const [inputEmail, setInputEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [chatName, setChatName] = useState("New Chat ");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [userName, setUserName] = useState("");
    const [newError, setNewError] = useState("");
    const [servers, setServers] = useState([]);
    const [serverUsers, setServerUsers] = useState([]);
    const [selectedServer, setSelectedServer] = useState(null);
    const usersSelectRef = useRef();

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
    
    const textSX = {
        color: '#f2f3f5',
        m: 2,
        backgroundColor: "#313338"
    };
    const av_src = "https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg";
    // new useeffect hook for signing in with firebase auth
    // useEffect(() => {
    //     if (!inputEmail || !inputPassword) return;
    
    //     const auth = getAuth();
    //     signInWithEmailAndPassword(auth, inputEmail, inputPassword)
    //       .then(async (userCredential) => {
    //         const user = userCredential.user;
    //         const userEmail = user.email;
    //         // Fetch user data by email from your database
    //         const response = await fetch(
    //           `/user/email/${encodeURIComponent(userEmail)}`
    //         );
    //         const data = await response.json();
    //         setId(data.userId);
    //         setLoggedIn(true);
    //         // why do we need a second fetch??? i dont think I made this or did I????-- Colin.
    //         const response2 = await fetch(`/user/id/${encodeURIComponent(id)}`);
    //         const data2 = await response2.json();
    //         setUserName(data2.username);
    //       })
    //       .catch((error) => {
    //         console.error("Error logging in:", error.message);
    //       })
    //   }, [inputEmail, inputPassword]);   

    // use effect hook for getting groupchats and contents
    useEffect(() => {
        if (!loggedIn) return;
        const fetchServers = async () => {
            console.log("getting servers");
            const response = await fetch(`/servers/userId/${encodeURIComponent(id)}`, {
              method: 'GET',
              headers: {
                "Content-Type": "application/json"
              }
            });
            const data = await response.json();
            console.log(data);
            const newServers = data.map(entry => {
              return {
                id: entry.serverId,
                name: entry.serverName
              };
            });
            setServers(newServers);
            console.log(newServers);
        };
        fetchServers();
    }, [loggedIn, id]);

    // Showing the login page
    if (!loggedIn) {
        return (
          <Login
            onLogin={(userName, email, password, loggedIn, id) => {
              setUserName(userName);
              setInputEmail(email);
              setInputPassword(password);
              setLoggedIn(loggedIn);
              setId(id)
            }}
          />
        );
      }

    // Handler for logging out, just reset all state variables to be sure that user is logged out.
    const handleLogout = () => {
        setLoggedIn(false);
        setInputEmail("");
        setInputPassword("");
        setUserName("");
        setChats([]);
        setId(0);
        setUsers([]);
        setChatName("New Chat ");
        setIsOpen(false);
        setIsOpen2(false);
        setNewError("");
        setServers([]);
        setServerUsers([]);
        setSelectedServer(null);
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

            // add groupchat to server
            await fetch(`/server/${selectedServer.id}/groupchat/${groupChatId}`, {
                method: 'PUT',
                headers: {
                  "Content-Type": "application/json",
                },
              }).catch(error => console.error("Error in adding group chat to server fetch:", error));

            const newChat = { id: groupChatId, users, name, messages: [] };
            setChats([...chats, newChat]);
            setNewError("");
        } catch (error) {
            console.error("Error creating new chat:", error);
        }
        
    };

    // Function for toggling the popup
    const togglePopup = () => {
        console.log(users);
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
    const handlePopup2Create = async (event) => {
        try {
            const userId = id;
            // update username
            await fetch(`/user/updateUsername`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                userId: userId,
                username: userName,
                }),
            });
            // update email and password in Firebase
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                await updateEmail(user, inputEmail);
                await fetch(`/user/updateEmail`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    email: inputEmail,
                }),
                });
                await updatePassword(user, inputPassword);
                await fetch(`/user/updatePassword`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    password: inputPassword,
                }),
                });
            } else {
                throw new Error("User not logged in");
            }
            alert( "New Info: \n" + "Username: " + userName + "\nEmail: " + inputEmail + "\nPassword: " + inputPassword);
            togglePopup2();
            } catch (error) {
                console.error("Error updating account info:", error);
                alert("An error occurred while updating account info. Please try again.");
            }
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
                        {selectedServer && (
                            <Button 
                                onClick={togglePopup}
                                sx={buttonSX}>
                                New Chat
                            </Button>
                        )}
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
                                        value={chatName}
                                        onChange={(event) => {setChatName(event.target.value);}}
                                        error={newError!==""}
                                        sx={{ m: 2, input: { color: '#8b8b90' } }}
                                        key={id+"_create"}
                                    />
                                    <FormControl sx={{ m: 2 }}>
                                    <InputLabel id="users-label">Users</InputLabel>
                                    <Select
                                        labelId="users-label"
                                        id="users"
                                        multiple
                                        value={users}
                                        onChange={(event) => setUsers(event.target.value)}
                                        sx={{ minWidth: 200, input: { color: '#8b8b90' } }}
                                        ref={usersSelectRef}
                                    >
                                        {serverUsers.map((user) => (
                                            <MenuItem key={user.id} value={user.username}>
                                                {user.username}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    </FormControl>
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
                                        value={userName}
                                        onChange={(event) => {setUserName(event.target.value);}}
                                        error={newError!==""}
                                        sx={{ m: 2, input: { color: '#8b8b90' } }}
                                        autoFocus
                                    />
                                    <CssTextField
                                        type="text" 
                                        id="users" 
                                        placeholder="Email"
                                        size="85"
                                        required
                                        value={inputEmail} 
                                        onChange={(event) => {setInputEmail(event.target.value);}} 
                                        error={newError!==""}
                                        helperText={newError}
                                        sx={{ m: 2, input: { color: '#8b8b90' } }}
                                    />
                                    <CssTextField
                                        type="password" 
                                        id="users" 
                                        placeholder="Password"
                                        size="85"
                                        required
                                        value={inputPassword} 
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
                <Stack direction="row" sx={textSX} spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                    <ServerList id={id} loggedIn={loggedIn} servers={servers} setServers={setServers} serverUsers={serverUsers} 
                        setServerUsers={setServerUsers} setChats={setChats} chats={chats} setSelectedServer={setSelectedServer} selectedServer={selectedServer} />
                        {!selectedServer && (
                            <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            style={{ minHeight: '50vh' }}
                            >
                          
                          <Typography variant="h5" className="header-message" sx={{color: 'white', m: 2}}>Welcome to CrewConnect!</Typography>
                          <Typography variant="h7" className="header-message" sx={{color: 'white', m: 2}}>Select a Server to begin connecting.</Typography>
                             
                          </Grid> 
                        )}
                </Stack>
                
                
            </ThemeProvider>
        </div>
      );
    }
    
export default App;