// Imports

import React from 'react';

// Just fetching the list of chats

const ChatList = ({chats, onSelect}) => {

    // Return chat list HTML

    return (
        <div className='list'>
            <h3>Your Chats</h3>
                {chats.map((chat) => (
                    <button key={chat.id} onClick={() => onSelect(chat.id)}>
                        <b>{chat.name}</b>{chat.users.map((user) => (
                            <span>{user}&emsp;</span>
                            ))}
                    </button>
                    
                ))}
        </div>
    );
};

export default ChatList;