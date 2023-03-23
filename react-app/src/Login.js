import React, { useState } from 'react';
import './style.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    const handleLogin = () => {
        onLogin(username, password);
    };

    const handleCreateAccount = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        setIsCreatingAccount(false);
    };
    
    const toggleCreateAccount = () => {
        setIsCreatingAccount(!isCreatingAccount);
    };

    return (
        <div className="container">
            {!isCreatingAccount && (
            <form onSubmit={handleLogin} className="form">
                <h1>CrewConnect</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
                <p>
                    Don't have an account?{' '}
                    <a href="#" onClick={toggleCreateAccount} style ={{"color": "#0f85c1"}}>
                    Create one
                    </a>
                    !
                </p>
            </form>
            )}

            {isCreatingAccount && (
            <form className="form" onSubmit={handleCreateAccount}>

            <h1>Create Account</h1>

            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            />

            <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            />

            <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            />

            <button type="submit">Create Account</button>
            </form>
            )}
        </div>
  );
};

export default Login;
