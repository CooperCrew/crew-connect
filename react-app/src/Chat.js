import React from 'react';

const Chat = ({ chat, setSelectedChatId }) => {
    const handleBack = () => {
        // Set the selected chat to null to go back to the group chat screen
        setSelectedChatId(null);
    };
    
    return (
        <div className='page'>
            <h1>{chat.name}</h1>
            {chat.users.map((user) => (
               <h4>{user}</h4>
            ))}
            <ul>
                {chat.messages.map((message) => (
                    <li key={message.id}>{message.text}</li>
                ))}
            </ul>
            <button onClick={handleBack}>Back</button>
        </div>
    );
};

export default Chat;
