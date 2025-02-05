import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig, b2cPolicies, loginRequest } from './authConfig';
import { eventEmitter } from './eventEmitter';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

const storedLoginRequest = localStorage.getItem('b2cLoginRequest');
if (!storedLoginRequest) {
    localStorage.setItem('b2cLoginRequest', JSON.stringify(loginRequest));
}

const storedB2cPolicis = localStorage.getItem('b2cPolicies');
if (!storedB2cPolicis) {
    localStorage.setItem('b2cPolicies', JSON.stringify(b2cPolicies));
}

let storedMsalConfig = localStorage.getItem('b2cMsalConfig');
if (!storedMsalConfig) {
    storedMsalConfig = JSON.stringify(msalConfig);
    localStorage.setItem('b2cMsalConfig', storedMsalConfig);
}
const b2cMsalConfig = JSON.parse(storedMsalConfig);

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const msalInstance = new PublicClientApplication(b2cMsalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
    if (
        (event.eventType === EventType.LOGIN_SUCCESS ||
            event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
            event.eventType === EventType.SSO_SILENT_SUCCESS) &&
        event.payload.account
    ) {
        msalInstance.setActiveAccount(event.payload.account);
    }

    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        setTimeout(() => {
            eventEmitter.emit('acquireToken');
        }, 1500);
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
    <React.StrictMode>
        <BrowserRouter>
            <App instance={msalInstance} />
        </BrowserRouter>
    </React.StrictMode>
);
