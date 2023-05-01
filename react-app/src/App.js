import React, {useState, useEffect, useRef} from 'react';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import JoinServer from "./JoinServer";
import { getAuth, signOut, updateEmail, updatePassword} from 'firebase/auth';
import ServerList from './ServerList';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Paper, Tooltip, CssBaseline, Divider, Link, TextField, Button, Box, List, ListItem, ListItemIcon, Avatar, ListItemText, Stack, Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import { styled } from '@mui/system';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import logo from './icon.png';

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

const CssSelect = styled(Select)({
    backgroundColor: "#383840",
    "& .MuiInputBase-root": {
        "& input": {
            color: 'white'
        }
    }, 
    "& .MuiInputLabel-root": {
        color: '#8b8b90 !important'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(228, 219, 233, 0.25)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(228, 219, 233, 0.25)',
    },
    '&:hover:not(.Mui-disabled):before': {
        borderColor: 'var(--galaxy-blue)',
    },
    '.MuiSvgIcon-root ': {
    fill: "#8b8b90 !important",
    },
    
});

// Main application
var stompClient = null;
let currentServer = null;
var subscription = null;
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
    const [isOpen3, setIsOpen3] = useState(false);
    const [userName, setUserName] = useState("");
    const [tempUserName, setTempUserName] = useState("");
    const [newError, setNewError] = useState("");
    const [servers, setServers] = useState([]);
    const [serverUsers, setServerUsers] = useState([]);
    const [selectedServer, setSelectedServer] = useState(null);
    const [newServerName, setNewServerName] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const usersSelectRef = useRef();
    const [connectedToSocket, setConnectedToSocket] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [copyFeedback, setCopyFeedback] = React.useState("");

    // whenever selectedServer changes connect
    useEffect(() => {
        if (selectedServer) {
            currentServer = selectedServer.id;
            connect();
        }
    }, [selectedServer]);

    const connect = () => {
        if (!connectedToSocket){
          let Sock = new SockJS('/ws');
          stompClient = Stomp.over(Sock);
          setConnectedToSocket(true);
          stompClient.connect({}, onConnect, onError);
        } else {
          if(subscription) {
            subscription.unsubscribe();
            subscription = stompClient.subscribe(`/server/${selectedServer.id}`, onGroupChatCreated);
          }
        }
    }
    
    const onGroupChatCreated = (payload) => {
        let newGroupchat = JSON.parse(payload.body);
        setChats(prevChats => [...prevChats, newGroupchat]);
    }

    const onConnect = () => {
        subscription = stompClient.subscribe(`/server/${selectedServer.id}`, onGroupChatCreated);
    }

    const onError = () => {
        console.log("Error with server socket");
    }
    
    const theme = createTheme();
    // CSS Specifications
    const buttonSX = {
        "&:hover": {
            backgroundColor: 'lightblue'
        },
        bgcolor: "#5865F2",
        color: 'white',
        m: 1
    }
    
    const textSX = {
        color: '#f2f3f5',
        m: 2,
        backgroundColor: "#313338"
    };
    const av_src = "https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg";

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
                name: entry.serverName,
                inviteCode: entry.inviteCode
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

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyFeedback("Copied!");
            setOpen(true);
          } catch (err) {
            console.log("INSIDE ", { open }, err);
            setCopyFeedback("The browser is mad at us because our site is insecure.");
            setOpen(true);
          }
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
            const groupChatData = await response.json();
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
            // setChats([...chats, newChat]);
            setNewError("");
            stompClient.send(
                `/app/server/${selectedServer.id}`,
                {},
                JSON.stringify(newChat)
            )
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
        setUserName(tempUserName);

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
                username: tempUserName,
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
            alert( "New Info: \n" + "Username: " + tempUserName + "\nEmail: " + inputEmail + "\nPassword: " + inputPassword);
            togglePopup2();
            } catch (error) {
                console.error("Error updating account info:", error);
                alert("An error occurred while updating account info. Please try again.");
            }
        };

    async function fetchServerByInviteCode(inviteCode) {
        const response = await fetch(`/server/invite/${inviteCode}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch server by invite code');
        }
    }

    // Function to create a server with a given name
    async function createServer(serverName) {
        const response = await fetch('/server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ serverName }),
        });
      
        if (response.ok) {
          const inviteCode = await response.text();
          setInviteCode(inviteCode);
      
          // Fetch the server object using the invite code
          const server = await fetchServerByInviteCode(inviteCode);
          return server;
        } else {
          throw new Error('Failed to create server');
        }
    }

    // Function to add a user to a server by invite code
    async function addUserToServerByInviteCode(inviteCode, userId) {
        const response = await fetch(`/server/invite/${inviteCode}`);
        if (response.ok) {
            const server = await response.json();
            const serverId = server.serverId;
            const joinResponse = await fetch(`/server/${serverId}/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!joinResponse.ok) {
                throw new Error("Failed to join server");
            }
        } else {
            throw new Error("Invite code not found");
        }
    }

    const togglePopup3 = () => {
        setIsOpen3(!isOpen3);
      };


    // Return main HTML for home page
    return (
        <div className="App" class="force-gray">
            <ThemeProvider theme={theme}>
                <Grid container direction="row" component={Paper} sx={{backgroundColor: "#313338"}}>
                    <Grid item sx={{ml: 2, mt: 2, mb: 3}}>
                        <img src={logo} style={{width: 50, height: 50}}></img>
                    </Grid>
                    <Grid item sx={{mt: 1}}>
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
                            onClick={togglePopup2}
                            sx={buttonSX}>
                            Manage Account
                        </Button>
                        <Button onClick={togglePopup3} sx={buttonSX}>
                            Create Server
                        </Button>     
                        </Grid>
                        <Divider/>
                        {selectedServer && selectedServer.inviteCode && (
                        <Grid item>
                            <Button 
                                onClick={togglePopup}
                                sx={buttonSX}>
                                New Channel
                            </Button>
                            {/* <Tooltip
                                open={open}
                                onClose={() => setOpen(false)}
                                title={<Typography fontSize={20}>{copyFeedback}</Typography>}
                                leaveDelay={700}
                            >
                                    <Button
                                    onClick={() => copyToClipboard("http://142.93.251.255:3000/join-server/"+selectedServer.inviteCode)}
                                    sx={buttonSX}
                                    >
                                    Copy Server Invite Link to Clipboard
                                    </Button>
                            </Tooltip> */}
                            
                        </Grid>
                        )}
                        {selectedServer && selectedServer.inviteCode && (
                        <Grid item sx={{ml: 5}} xs={12} md={10}>
                            <Typography variant="h6" sx={{color: 'white'}}>Server Invite Link</Typography>
                            <Link href={`http://142.93.251.255:3000/join-server/${selectedServer.inviteCode}`} target="_blank" rel="noopener">
                            http://142.93.251.255:3000/join-server/{selectedServer.inviteCode}
                            </Link> 
                        </Grid>
                        )}
                        </Stack>
                        
                        {isOpen && (<Grid item sx={{minWidth: 400}}><CssBaseline sx={{m: 2, backgroundColor: "#313338"}}>
                                <Typography variant="h5" className="header-message" sx={{color: 'white', m: 2}}>Create New Channel</Typography>
                                    <Grid container direction="row">
                                        <Grid item>
                                        <CssTextField
                                            type="text"
                                            id="name"
                                            placeholder="Chat Name"
                                            size="15"
                                            value={chatName}
                                            onChange={(event) => {setChatName(event.target.value);}}
                                            error={newError!==""}
                                            sx={{ minWidth: 200, m: 2, input: { color: '#8b8b90' } }}
                                            key={id+"_create"}
                                        />
                                    </Grid>
                                    <Grid item>
                                    <FormControl sx={{ m: 2 }}>
                                    <InputLabel id="users-label" sx={{color: '#8b8b90' }}>Users</InputLabel>
                                    <CssSelect
                                        labelId="users-label"
                                        id="users"
                                        placeholder="Users"
                                        multiple
                                        value={users}
                                        onChange={(event) => setUsers(event.target.value)}
                                        sx={{ minWidth: 200, color: '#8b8b90' }}
                                        ref={usersSelectRef}
                                    >
                                        {serverUsers.map((user) => (
                                            <MenuItem key={user.id} value={user.username}>
                                                {user.username}
                                            </MenuItem>
                                        ))}
                                    </CssSelect>
                                    </FormControl>
                                    </Grid>
                                    </Grid>
                                    <Button onClick={handlePopupCreate} sx={buttonSX}>Create</Button> <Button onClick={togglePopup} sx={buttonSX}>CANCEL</Button>
                                </CssBaseline></Grid>
                        )}
                        {isOpen2 && (<Grid item sx={{minWidth: 400}}><CssBaseline sx={{m: 2, backgroundColor: "#313338"}}>
                                <Typography variant="h5" className="header-message" sx={{color: 'white', m: 2}}>Change Account Info</Typography>
                                <Typography variant="p" className="header-message" sx={{color: 'white', m: 2}}>Input new desired account information.</Typography>
                                <Box>
                                    <CssTextField
                                        type="text"
                                        id="name"
                                        placeholder="Username"
                                        size="15"
                                        // value={userName}
                                        onChange={(event) => {setTempUserName(event.target.value);}}
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
                                    <Divider/>
                                    <Button onClick={handlePopup2Create} sx={buttonSX}>Save</Button> <Button onClick={togglePopup2} sx={buttonSX}>CANCEL</Button>
                                </Box></CssBaseline></Grid>
                        )}
                        {isOpen3 && (
                        <Grid item sx={{minWidth: 400}}><CssBaseline sx={{ m: 2, backgroundColor: "#313338" }}>
                            <Typography variant="h5" className="header-message" sx={{ color: "white", m: 2 }}>
                            Create New Server
                            </Typography>
                            <Box>
                            <CssTextField
                                type="text"
                                id="serverName"
                                placeholder="Server Name"
                                size="15"
                                value={newServerName}
                                onChange={(event) => {
                                setNewServerName(event.target.value);
                                }}
                                error={newError !== ""}
                                sx={{ m: 2, input: { color: "#8b8b90" } }}
                                key={id + "_create_server"}
                            />
                            <Divider />
                            <Button
                            onClick={async () => {
                                    try {
                                    const serverName = newServerName;
                                    if (serverName) {
                                        const server = await createServer(serverName);
                                        console.log(`Server created with invite code: ${server.inviteCode}`);
                                        await addUserToServerByInviteCode(server.inviteCode, id);
                                        const newServer = {
                                            id: server.id,
                                            name: serverName,
                                            inviteCode: server.inviteCode
                                        };
                                        setServers((prevServers) => [...prevServers, newServer]);
                                        setSelectedServer(newServer);
                                        togglePopup3();
                                    }
                                    } catch (error) {
                                    console.error(error);
                                    }
                                }}
                                sx={buttonSX}
                            >
                            Create
                            </Button>
                            <Button onClick={togglePopup3} sx={buttonSX}>
                                CANCEL
                            </Button>
                            </Box>
                        </CssBaseline></Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid>
                <Stack direction="row" sx={textSX} spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                    <ServerList id={id} loggedIn={loggedIn} servers={servers} setServers={setServers} serverUsers={serverUsers} inviteCode = {inviteCode}
                        setServerUsers={setServerUsers} setChats={setChats} chats={chats} setSelectedServer={setSelectedServer} selectedServer={selectedServer}/>
                    
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
                </Grid>
            </ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/join-server/:inviteCode" element={<JoinServer id = {id} />} />
                </Routes>
            </Router>
        </div>
      );
    }
    
export default App;