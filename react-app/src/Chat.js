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
            {chat.users.map((user) => (
               <h4>{user}</h4>
            ))}
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