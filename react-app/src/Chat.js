// Imports

import React, {useState} from 'react';

// Renderer for list of Messages

const MessageList = ({messages}) => {
    return (
        <div>
            {messages.map((message, index) => (
                <Message key={index} sender={message.sender} text={message.text} />
            ))}
        </div>
    );
};

// Renderer for each message

const Message = ({id, sender, text}) => {
    return (
        <div>
            <strong>{sender}: </strong>
            <span>{text}</span>
        </div>
    );
};

// Renderer for the message form

const NewMessageForm = ({newMessage, onNewMessageChange, onSendMessage}) => {

    // Handler if the user presses enter

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            onSendMessage();
        }
    };
  
    // Return message form HTML

    return (
        <div className='send-form'>
            <input
                type="text"
                value={newMessage}
                onChange={onNewMessageChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
            />
            <button onClick={onSendMessage}>Send</button>
        </div>
    );
};

// When the user wants to view a chat

const Chat = ({chat, setSelectedChatId, onSendMessage}) => {

    // Variable Declarations

    const [message, setMessage] = useState('');

    // Function to go back to the main screen
     
    const handleBack = () => {
        setSelectedChatId(null);
    };

    // Function to set the message

    const handleNewMessageChange = (event) => {

        if (event.target.value === "") {
            return;
        }

        setMessage(event.target.value);
    };

    // Function to send the message

    const handleSendMessage = () => {

        if (message === "") {
            return;
        }

        onSendMessage(message);

        const newMessage = {
            sender: "you",
            text: message            
        };

        chat.messages=[...chat.messages, newMessage];
        setMessage("");
    };

    // Return chat HTML
    
    return (
        <div className='page'>
            <h1>{chat.name}</h1>
            <b>Members:&ensp;</b>
            {chat.users.map((user) => (
            <span>{user}&emsp;</span>
            ))}
            <br></br>
            <br></br>
            <MessageList 
                messages={chat.messages} 
            />
            <NewMessageForm
                newMessage={message}
                onNewMessageChange={handleNewMessageChange}
                onSendMessage={handleSendMessage}
            />
            <button onClick={handleBack} className="bottom">Back</button>
        </div>
    );
};

export default Chat;