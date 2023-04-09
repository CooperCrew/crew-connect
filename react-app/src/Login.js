 // Imports

 import React, { useState, useEffect } from 'react';
 import './index.css';
 import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
 import { auth } from './index';
 // Login Screen
 
 const Login = ({onLogin}) => {
 
     // Variables for logging in and creating an account
 
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [email, setEmail] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [isCreatingAccount, setIsCreatingAccount] = useState(false);
 
     // useEffect(() => {
     //     if (email) {
     //         let jsonData = {"userId" : 0, "password": password, "username": username, "email": email, "status": "Offline"};
     //         fetch(`http://142.93.251.255:8080/user/register`, {
     //                 method: 'POST',
     //                 headers: {
     //                     "Content-Type": "application/json"
     //                 },
     //                 body: JSON.stringify(jsonData)
     //         }).then(async response => {
     //             const data = await response.json();
     //             console.log(data);
     //             if (!response.ok) {
     //                 const error = (data && data.message) || response.statusText;
     //                 return console.error(error);
     //             }
     //         });
     //     } 
     // }, [isCreatingAccount]);
 
     // Login handler
 
     const handleLogin = async (e) => {
         e.preventDefault();
         try {
           const userCredential = await signInWithEmailAndPassword(auth, username, password);
           onLogin(username, password);
         } catch (error) {
           console.error("Error signing in:", error);
         }
     };
       
 
     // Account creation handler
     const handleCreateAccount = async (event) => {
         event.preventDefault();
         if (password !== confirmPassword) {
           alert('Passwords do not match');
           return;
         }
         try {
           const userCredential = await createUserWithEmailAndPassword(auth, email, password);
           let jsonData = {
             password: password,
             username: username,
             email: email,
             status: "Offline",
           };
           fetch(`http://142.93.251.255:8080/user/register`, {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(jsonData),
           }).then(async (response) => {
             const data = await response.json();
             console.log(data);
             if (!response.ok) {
               const error = (data && data.message) || response.statusText;
               return console.error(error);
             }
           });
           setIsCreatingAccount(false);
         } catch (error) {
           console.error("Error creating account:", error);
         }
       };
 
     // Toggle for the screen for creating an account
     const toggleCreateAccount = () => {
         setIsCreatingAccount(!isCreatingAccount);
     };
 
     // HTML for login and account creation screens
 
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
             <p>
                 Back to{' '}
                 <a href="#" onClick={toggleCreateAccount} style ={{"color": "#0f85c1"}}>login</a>
             </p>
             </form>
             )}
         </div>
   );
 };
 
 export default Login;