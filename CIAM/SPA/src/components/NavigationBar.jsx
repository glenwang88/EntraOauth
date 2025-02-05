import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Nav, Navbar, Dropdown, DropdownButton, Container, Alert } from 'react-bootstrap';
//import { loginRequest } from '../authConfig';
import React, { useState } from 'react';
import { eventEmitter } from '../eventEmitter';
import { appURI_EntraID, appURI_B2C} from '../authConfig';

export const NavigationBar = () => {

    const { instance } = useMsal();

    let activeAccount;

    if (instance) {
        activeAccount = instance.getActiveAccount();
    }

    const [notification, setNotification] = useState({visible: false, variant: 'success', message: ''});
    const appIcon = process.env.PUBLIC_URL + '/favicon.svg';
    const storedLoginRequest = localStorage.getItem('ciamLoginRequest');
    const ciamLoginRequest = JSON.parse(storedLoginRequest);
    const storedMsalConfig = localStorage.getItem('ciamMsalConfig');
    const ciamMsalConfig = JSON.parse(storedMsalConfig);

    const displayNotification = (variant, message) => {
        // Display the notification
        setNotification({ visible: true, variant, message });
    
        // Hide the notification after 6 seconds
        setTimeout(() => {
            setNotification({visible: false, variant: 'success', message: ''});
        }, 6000);
    };
    
    function validateMandatoryParams() {
        const clientId = ciamMsalConfig.auth.clientId || '';
        const authority = ciamMsalConfig.auth.authority || '';
        if (!(clientId && clientId.trim()) || !(authority && authority.trim())) {
            displayNotification('warning', 'Please set Client ID and Authority and Save them first.');
            return false;   
        }
        else{
            return true;
        }
    }

    const handleLoginPopup = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        /**
         * When using popup and silent APIs, we recommend setting the redirectUri to a blank page or a page
         * that does not implement MSAL. Keep in mind that all redirect routes must be registered with the application
         * For more information, please follow this link: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/login-user.md#redirecturi-considerations
         */
        instance
            .loginPopup({
                ...ciamLoginRequest,
                redirectUri: '/redirect',
            })
            .catch((error) => console.log(error));
    };

    const handleLoginRedirect = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        instance.loginRedirect(ciamLoginRequest).catch((error) => console.log(error));
    };

    const handleLogoutPopup = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        instance
            .logoutPopup({
                mainWindowRedirectUri: '/', // redirects the top level app after logout
                account: instance.getActiveAccount(),
            })
            .catch((error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        instance.logoutRedirect().catch((error) => console.log(error));
    };
    
    const handleAcquireToken = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        eventEmitter.emit('acquireToken');
    };

    const handleProfileData = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        eventEmitter.emit('handleProfileData');
    };

    const handleRegister = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        ciamLoginRequest.prompt = 'create';
        instance.loginRedirect(ciamLoginRequest).catch((error) => console.log(error));
    };

    const handleCheckSession = () => { 
        if (!validateMandatoryParams()) {
            return;
        }
        //instance.ssoSilent(entraIDloginRequest).catch((error) => console.log(error));
        instance.ssoSilent(ciamLoginRequest)
        .then((response) => {
            // Display user account information on successful response
            const username = response.account.username;
            const name = response.account.name;
            //setNotification({visible: true, variant: 'success', message: `User Session: \nName: ${name}, \nUsername: ${username}`});
            displayNotification('success', `User Session: \nName: ${name}, \nUsername: ${username}`);
            console.log(response.account);
        })
        .catch((error) => {
            if (error.message.includes('interaction_required') || error.message.includes('login_required')) {
                //setNotification({visible: true, variant: 'warning', message: 'login_required: Session information is not sufficient for single-sign-on.'});
                displayNotification('warning', 'login_required: Session information is not sufficient for single-sign-on.');
            } else {
                alert(error.message);
            }
            console.log(error);
        });
    };

    /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
     * only render their children if a user is authenticated or unauthenticated, respectively.
     */
    return (
        <>
            <Navbar bg="primary" variant="dark" className="navbarStyle">
                {/* <a className="navbar-brand" href="/">
                    Microsoft identity platform
                </a> */}
                <div className="collapse navbar-collapse">
                    <DropdownButton
                        variant="success"
                        className="ml-auto"
                        //title="CIAM"
                        title={<><img src={appIcon} alt="icon" /> CIAM</>}
                        drop=""
                    >
                        <Dropdown.Item as="button" onClick={() => window.location.href = appURI_EntraID}>
                            Entra ID
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => window.location.href = appURI_B2C}>
                            B2C
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
                <Nav.Link className="navbarButton" onClick={handleLoginRedirect}>
                        Login Redirect
                </Nav.Link>
                <Nav.Link className="navbarButton" onClick={handleCheckSession}>
                        Check Session
                </Nav.Link>
                <UnauthenticatedTemplate>
                    <Nav.Link className="navbarButton" onClick={handleRegister}>
                            Register
                    </Nav.Link>
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                    <Nav.Link className="navbarButton" onClick={handleAcquireToken}>
                        Acquire Token
                    </Nav.Link>
                    <Nav.Link className="navbarButton" onClick={handleProfileData}>
                        Get Profile
                    </Nav.Link>
                    <Nav.Link className="navbarButton" onClick={handleLogoutRedirect}>
                        Logout Redirect
                    </Nav.Link>
                    <div className="collapse navbar-collapse justify-content-end">
                        <DropdownButton
                            variant="warning"
                            drop="start"
                            title={activeAccount ? activeAccount.name : 'Unknown'}
                        >
                            <Dropdown.Item as="button" onClick={handleLogoutPopup}>
                                Sign out using Popup
                            </Dropdown.Item>
                            <Dropdown.Item as="button" onClick={handleLogoutRedirect}>
                                Sign out using Redirect
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <div className="collapse navbar-collapse justify-content-end">
                        <DropdownButton
                            variant="secondary"
                            className="justify-content-end ml-auto"
                            title="Sign In"
                            drop="start"
                        >
                            <Dropdown.Item as="button" onClick={handleLoginPopup}>
                                Sign in using Popup
                            </Dropdown.Item>
                            <Dropdown.Item as="button" onClick={handleLoginRedirect}>
                                Sign in using Redirect
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>
                </UnauthenticatedTemplate>
            </Navbar>

            {notification.visible && 
                <>
                <br/>
                <Container>
                <Alert variant={notification.variant} onClose={() => setNotification({visible: false, variant: 'success', message: ''})} dismissible>
                    {notification.message}
                </Alert>
                </Container>
                </>
            }
        </>
    );
};
