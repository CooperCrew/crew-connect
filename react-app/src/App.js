import React, {useState, useEffect} from 'react';
import Login from './Login';
import ChatList from './ChatList';
import Chat from './Chat';
import NewChat from './NewChat';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import firebase from 'firebase/app';
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

    // use effect hook for login
    // useEffect(() => {
    //     if (!inputUsername || !inputPassword) return;
    
    //     let jsonData = {"username": inputUsername, "password": inputPassword};
    //     console.log(jsonData);
    //     fetch(`/user/login`, {
    //             method: 'POST',
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(jsonData)
    //     }).then(async response => {
    //         const data = await response.json();
    //         console.log(data);
    //         if (!response.ok) {
    //             const error = (data && data.message) || response.statusText;
    //             return console.error(error);
    //         } else {
    //             setLoggedIn(true);
    //             setId(data["userId"]); // Update this line to use setId
    //             console.log(id);
    //         }
    //     });
    
    // }, [inputUsername, inputPassword]);

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
      

    // Showing the selected chat
    if (selectedChatId) {
        const selectedChat = chats.find((chat) => chat.id === selectedChatId);
        return ( <Chat 
            chat={selectedChat} 
            setSelectedChatId={setSelectedChatId} 
            onSendMessage={handleSendMessage}
            />
        );
    }

    // Return main HTML for home page
    return (
        <div className='page'>
            <h1>CrewConnect</h1>
            <NewChat
                show={selectedChatId != null}
                onCreate={handleCreateChat}
            />
            <ChatList
                chats={chats}
                onSelect={chatId => handleSelectChat(chatId)}
            />
            <button onClick={() => { 
                signOut(getAuth()); 
                handleLogout(); 
                }} 
                className="bottom" 
                >Log Out</button>
        </div>
    );
  
};

export default App;