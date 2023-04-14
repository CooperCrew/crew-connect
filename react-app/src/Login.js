 // Imports

 import React, { useState, useEffect } from 'react';
 import './index.css';
 import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
 import { auth } from './index';

 import Avatar from '@mui/material/Avatar';
 import Button from '@mui/material/Button';
 import CssBaseline from '@mui/material/CssBaseline';
 import TextField from '@mui/material/TextField';
 import FormControlLabel from '@mui/material/FormControlLabel';
 import Checkbox from '@mui/material/Checkbox';
 import Link from '@mui/material/Link';
 import Paper from '@mui/material/Paper';
 import Box from '@mui/material/Box';
 import Grid from '@mui/material/Grid';
 import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
 import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
 import Typography from '@mui/material/Typography';
 import { createTheme, ThemeProvider } from '@mui/material/styles';
 
 const theme = createTheme();


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
      
      <ThemeProvider theme={theme}>
      {!isCreatingAccount && (
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://media.discordapp.net/attachments/1079537769480724480/1096289155656454254/flat-design-mountain-landscape_23-2149161404.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="#" variant="body2" onClick={toggleCreateAccount}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      )}
      {isCreatingAccount && (

        <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://media.discordapp.net/attachments/1079537769480724480/1096289155656454254/flat-design-mountain-landscape_23-2149161404.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <AccountCircleOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Create Account
            </Typography>
            <Box component="form" noValidate onSubmit={handleCreateAccount} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                onChange={(event) => setUsername(event.target.value)}
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Account
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="#" variant="body2" onClick={toggleCreateAccount}>
                    {"Back to login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        </Grid>
      )}
    </ThemeProvider>
   );
 };
 
 export default Login;