import React from 'react';

const ChatList = ({ chats, onSelect, onNewChat }) => {

return (
    <div className='page'>
        <h4>Your Chats</h4>
        <ul>
            {chats.map((chat) => (
                <button key={chat.id} onClick={() => onSelect(chat.id)}>
                    {chat.name}
                </button>
            ))}
        </ul>
    </div>
);
};

export default ChatList;