import React, { useState } from 'react';
import Popup from './Popup';
import './style.css'

const NewChat = ({onCreate}) => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("My Chat");
    const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(users, name);
    setIsOpen(!isOpen);
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className = "popup-form">
        <button type="button" onClick={togglePopup}>New Chat</button>
        {isOpen && <Popup
            content={<>
                <h1>Create New Chat</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="name"
                        placeholder="Chat Name"
                        size="15"
                        // value={name} 
                        onChange={(event) => {setName(event.target.value);}}
                    />
                    <input 
                        type="text" 
                        id="users" 
                        placeholder="Users"
                        size="90"
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
