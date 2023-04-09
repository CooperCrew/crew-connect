import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const firebaseConfig = {
  apiKey: "AIzaSyBUFBRyL3hRu2ojr2in1MKBX9dnPq5gAgo",
  authDomain: "crew-connect-3d3f4.firebaseapp.com",
  projectId: "crew-connect-3d3f4",
  storageBucket: "crew-connect-3d3f4.appspot.com",
  messagingSenderId: "568762443032",
  appId: "1:568762443032:web:d85333f499bc7dfdcfea6d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { auth };
