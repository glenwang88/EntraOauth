import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from './authConfig';
import { loginRequest } from './authConfig';
import { eventEmitter } from './eventEmitter';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

const storedLoginRequest = localStorage.getItem('ciamLoginRequest');
if (!storedLoginRequest) {
    localStorage.setItem('ciamLoginRequest', JSON.stringify(loginRequest));
}

let storedMsalConfig = localStorage.getItem('ciamMsalConfig');
if (!storedMsalConfig) {
    storedMsalConfig = JSON.stringify(msalConfig);
    localStorage.setItem('ciamMsalConfig', storedMsalConfig);
}
const ciamMsalConfig = JSON.parse(storedMsalConfig);

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const msalInstance = new PublicClientApplication(ciamMsalConfig);


// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {

    //console.log("=====event.eventType===== " + event.eventType);
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        //console.log("=====event.eventType==LOGIN_SUCCESS=== " + event.eventType);
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
        /* setTimeout(() => {
            eventEmitter.emit('handleProfileData');
        }, 1000); */
        setTimeout(() => {
            eventEmitter.emit('acquireToken');
        }, 1000);
    }

    if (event.eventType === EventType.LOGIN_FAILURE) {
        console.error("Login failed:", event.error);
        // Display the error message to the user
        // You can replace this with your preferred method of displaying errors
        alert(`Login failed: ${event.error.message}`);
    }
  
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App instance={msalInstance}/>
);