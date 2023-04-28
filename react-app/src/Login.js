// Imports

import React, { useState, useEffect } from 'react';
import './index.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getAuth } from 'firebase/auth';
import { auth } from './index';

import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Paper, Box, Grid, Typography} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

const theme = createTheme();

const CssTextField = styled(TextField)({
  backgroundColor: "#383840",
  "& .MuiInputLabel-root": {
      color: '#8b8b90'
  },
  
});


// Login Screen

const Login = ({onLogin}) => {

    // Variables for logging in and creating an account

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = React.useState("");
    const [createErrorMessage, setCreateErrorMessage] = React.useState("");

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const userCredential = await signInWithEmailAndPassword(auth, username, password);
          onLogin(username, password);
        } catch (error) {
          console.error("Error signing in:", error);
          setLoginErrorMessage("Invalid email and/or password!");
        }
    };
      
    // Account creation handler
    const handleCreateAccount = async (event) => {
      event.preventDefault();
      if (password !== confirmPassword) {
        setCreateErrorMessage('Passwords do not match!');
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
        fetch(`/user/register`, {
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
        setCreateErrorMessage("Error creating account.");
      }
    };

    // Toggle for the screen for creating an account
    const toggleCreateAccount = () => {
        setIsCreatingAccount(!isCreatingAccount);
    };

    const buttonSX = {
      "&:hover": {
          backgroundColor: 'lightblue'
      },
      bgcolor: "#5865F2",
      color: 'white',
      mt: 2, 
      mb: 2
    }

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
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{backgroundColor: '#313338',}}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5" sx={{color: '#f2f2f5'}}>
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, }}>
            <CssTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={loginErrorMessage!==""}
              sx={{ input: { color: '#8b8b90' } }}
            />
            <CssTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={loginErrorMessage!==""}
              helperText={loginErrorMessage}
              sx={{ input: { color: '#8b8b90' } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={buttonSX}
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

      <Grid container component="main" sx={{ height: '100vh' }} >
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
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{backgroundColor: '#313338',}}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AccountCircleOutlined />
          </Avatar> */}
          <Typography component="h1" variant="h5" sx={{color: '#8b8b90'}}>
            Create Account
          </Typography>
          <Box component="form" noValidate onSubmit={handleCreateAccount} onClick={() => {signOut(getAuth())}} sx={{ mt: 1 }}>
          <CssTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              onChange={(event) => setUsername(event.target.value)}
              name="email"
              autoComplete="email"
              error={createErrorMessage!=="" && createErrorMessage!=="Passwords do not match!"}
              autoFocus
              sx={{ input: { color: '#8b8b90' } }}
            />
            <CssTextField
              margin="normal"
              required
              fullWidth
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              label="Email Address"
              name="email"
              autoComplete="email"
              error={createErrorMessage!=="" && createErrorMessage!=="Passwords do not match!"}
              autoFocus
              sx={{ input: { color: '#8b8b90' } }}
            />
            <CssTextField
              margin="normal"
              required
              fullWidth
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
              error={createErrorMessage!==""}
              sx={{ input: { color: '#8b8b90' } }}
              autoFocus
            />
            <CssTextField
              margin="normal"
              required
              fullWidth
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              name="password"
              label="Confirm Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={createErrorMessage!==""}
              helperText={createErrorMessage}
              sx={{ input: { color: '#8b8b90' } }}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={buttonSX}
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