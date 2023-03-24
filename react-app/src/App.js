// Imports

import React, {useState} from 'react';
import Login from './Login';
import ChatList from './ChatList';
import Chat from './Chat';
import NewChat from './NewChat';

// Main application

const App = () => {

    // Variable Declarations

    const [loggedIn, setLoggedIn] = useState(false); // Boolean for logging in
    const [selectedChatId, setSelectedChatId] = useState(null); // Integer for chat selection
    const [chats, setChats] = useState([]); // List of chats

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
        const newChatId = Math.max(...chats.map((chat) => chat.id)) + 1;
        const newChat = { id: newChatId, users, name, messages: [] };
        setChats([...chats, newChat]);
        setSelectedChatId(newChatId);
    };

    // Showing the login page

    if (!loggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    // Showing the selected chat

    if (selectedChatId) {
        const selectedChat = chats.find((chat) => chat.id === selectedChatId);
        return <Chat chat={selectedChat} setSelectedChatId={setSelectedChatId} />;
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
            {selectedChatId && (
                <Chat chat={chats.find((chat) => chat.id === selectedChatId)} setSelectedChatId={setSelectedChatId} />
            )}
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
  
};

export default App;