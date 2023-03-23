import React, { useState } from 'react';
import Login from './Login';
import ChatList from './ChatList';
import Chat from './Chat';
import NewChat from './NewChat';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chats, setChats] = useState([]);

  const handleLogin = (username, password) => {
    // Perform login logic here
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleNewChat = () => {
    setShowNewChat(true);
  };

  const handleCreateChat = (users, name) => {
    const newChatId = Math.max(...chats.map((chat) => chat.id)) + 1;
    const newChat = { id: newChatId, users, name, messages: [] };
    setChats([...chats, newChat]);
    setSelectedChatId(newChatId);
  };

  const handleNewChatClose = () => {
    setShowNewChat(false);
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (selectedChatId) {
    const selectedChat = chats.find((chat) => chat.id === selectedChatId);
    return <Chat chat={selectedChat} setSelectedChatId={setSelectedChatId} />;
  }

  return (
    <div className='page'>
      <h1>CrewConnect</h1>
      <NewChat
        show={showNewChat}
        onClose={handleNewChatClose}
        onCreate={handleCreateChat}
      />
      <ChatList
        chats={chats}
        onSelect={handleSelectChat}
        onNewChat={handleNewChat}
      />
      {selectedChatId && (
        <Chat chat={chats.find((chat) => chat.id === selectedChatId)} setSelectedChatId={setSelectedChatId} />
      )}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
  
};

export default App;
