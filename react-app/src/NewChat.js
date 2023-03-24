// Imports

import React, {useState} from 'react';
import './index.css'
import { newChatId } from './App.js';

// Prop for popup

const Popup = props => {
    return (
      <div className="popup-box">
        <div className="box">
          <span className="close-icon" onClick={props.handleClose}>x</span>
          {props.content}
        </div>
      </div>
    );
};

// When the user wants to create a new chat

const NewChat = ({onCreate}) => {

    // Variable declarations

    const [users, setUsers] = useState([]);
    const [name, setName] = useState("My Chat " + (newChatId));
    const [isOpen, setIsOpen] = useState(false);

    // Function for toggling the popup

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    // Handler for when the form to create the chat is submitted

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreate(users, name);
        togglePopup();
    };

    // HTML for popup

    return (
        <div>
            <button type="button" onClick={togglePopup}>New Chat</button>
            {isOpen && <Popup class="popup-form"
                content={<>
                    <h1>Create New Chat</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="name"
                            placeholder="Chat Name"
                            size="15"
                            onChange={(event) => {setName(event.target.value);}}
                        />
                        <input 
                            type="text" 
                            id="users" 
                            placeholder="Users"
                            size="85"
                            required
                            value={users} 
                            onChange={(event) => setUsers(event.target.value.split(","))} 
                        />
                        <button type="submit">Create</button>
                    </form>
                </>}
                handleClose={togglePopup}
            />}
        </div>
    );
};

export default NewChat;