// Imports

import React from 'react';

// When the user wants to view a chat

const Chat = ({chat, setSelectedChatId}) => {

    // A function to go back to the main screen
     
    const handleBack = () => {
        setSelectedChatId(null);
    };

    // Return chat HTML
    
    return (
        <div className='page'>
            <h1>{chat.name}</h1>
            <h4>Members:&ensp;
                {chat.users.map((user) => (
                <span>{user}&emsp;</span>
                ))}
            </h4>
            <ul>
                {chat.messages.map((message) => (
                    <li key={message.id}>{message.user}+": "+{message.text}</li>
                ))}
            </ul>
            <button onClick={handleBack}>Back</button>
        </div>
    );
};

export default Chat;