// Imports

import React, {useState} from 'react';
import Login from './Login';
import ChatList from './ChatList';
import Chat from './Chat';
import NewChat from './NewChat';

// External variable declarations

let newChatId = 3; // ID used for new chats

// Static Data for testing

let test_chats = [
    {
        id: 1,
        users: ["User 1", "User 2"],
        name: 'Group Chat 1',
        messages: [
            { sender: 'User 1', text: 'Hello' },
            { sender: 'User 2', text: 'Hi there' },
        ],
    },
    {
        id: 2,
        users: ["User 1", "User 2"],
        name: 'Group Chat 2',
        messages: [
            { sender: 'User 1', text: 'Hey' },
            { sender: 'User 2', text: 'What\'s up?' },
        ],
    },
];

// Main application

const App = () => {

    // Variable Declarations

    const [loggedIn, setLoggedIn] = useState(false); // Boolean for logging in
    const [selectedChatId, setSelectedChatId] = useState(null); // Integer for chat selection
    const [chats, setChats] = useState(test_chats); // List of chats
    

    // Handler for logging in, pending login logic

    const handleLogin = (username, password) => {
        setLoggedIn(true);
    };

    // Handler for logging out

    const handleLogout = () => {
        setLoggedIn(false);
    };

    // Handler for clicking on a chat to view it

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
    };

    // Handler for creating a new chat

    const handleCreateChat = (users, name) => {
        const newChat = { id: newChatId, users, name, messages: []};
        setChats([...chats, newChat]);
        setSelectedChatId(newChatId++);
    };

    
    const handleSendMessage = (chatId, message) => {
        const newChats = chats.map((chat) => {
            if (chat.id === chatId) {
                return {
                    ...chat,
                    messages: [...chat.messages, { sender: "You", text: message }]
                };
            }
            return chat;
        });
        setChats(newChats);
    };

    // Showing the login page

    if (!loggedIn) {
        return <Login onLogin={handleLogin} />;
    }

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
                onSelect={handleSelectChat}
            />
            <button onClick={handleLogout} className="bottom">Log Out</button>
        </div>
    );
  
};

export default App;
export {newChatId};