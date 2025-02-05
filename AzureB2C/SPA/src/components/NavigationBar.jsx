import { Nav, Navbar, Dropdown, DropdownButton, Container, Alert } from 'react-bootstrap';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import React, { useState } from 'react';
import { InteractionStatus } from '@azure/msal-browser';
//import { loginRequest, b2cPolicies } from '../authConfig';
import { eventEmitter } from '../eventEmitter';
//import { ReactComponent as appIcon } from '../../public/favicon.svg';
import { appURI_EntraID, appURI_CIAM } from '../authConfig';

export const NavigationBar = () => {
    const { instance, inProgress } = useMsal();
    let activeAccount;

    if (instance) {
        activeAccount = instance.getActiveAccount();
    }

    const [notification, setNotification] = useState({visible: false, variant: 'success', message: ''});
    const appIcon = process.env.PUBLIC_URL + '/favicon.svg';
    const storedB2cPolicis = localStorage.getItem('b2cPolicies');
    const b2cPolicies = JSON.parse(storedB2cPolicis);
    const storedLoginRequest = localStorage.getItem('b2cLoginRequest');
    const b2cLoginRequest = JSON.parse(storedLoginRequest);
    const storedMsalConfig = localStorage.getItem('b2cMsalConfig');
    const b2cMsalConfig = JSON.parse(storedMsalConfig);

    const displayNotification = (variant, message) => {
        // Display the notification
        setNotification({ visible: true, variant, message });
    
        // Hide the notification after 6 seconds
        setTimeout(() => {
            setNotification({visible: false, variant: 'success', message: ''});
        }, 6000);
    };
    
    function validateMandatoryParams() {
        const clientId = b2cMsalConfig.auth.clientId || '';
        //const authority = b2cMsalConfig.auth.authority || '';
        const tenantName = b2cPolicies.tenantName || '';
        const signUpSignInPolicy = b2cPolicies.names.signUpSignIn || '';

        if (!(clientId && clientId.trim()) || !(tenantName && tenantName.trim()) || !(signUpSignInPolicy && signUpSignInPolicy.trim())) {
            displayNotification('warning', 'Please set Tenant Name, Client ID, signUpSignIn Policy and Save them.');
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
        instance
            .loginPopup({
                ...b2cLoginRequest,
                redirectUri: '/redirect',
            })
            .catch((error) => console.log(error));
    };

    const handleLoginRedirect = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        instance.loginRedirect(b2cLoginRequest).catch((error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        instance.logoutRedirect().catch((error) => console.log(error));
    };

    const handleLogoutPopup = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        instance.logoutPopup({
            mainWindowRedirectUri: '/', // redirects the top level app after logout
        })
        .catch((error) => console.log(error));;
    };

    const handleProfileEdit = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        const signUpSignInPolicy = b2cPolicies.names.editProfile || '';
        if (!signUpSignInPolicy) {
            displayNotification('warning', 'Please set EditProfile Policy and Save it.');
            return;   
        }
        if (inProgress === InteractionStatus.None) {
            instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
        }
    };

    const handleAcquireToken = () => {
        if (!validateMandatoryParams()) {
            return;
        }
        eventEmitter.emit('acquireToken');
    };

    /* const handleProfileData = () => {
        eventEmitter.emit('handleProfileData');
    }; */

    const handleCheckSession = () => { 
        if (!validateMandatoryParams()) {
            return;
        }
        instance.ssoSilent(b2cLoginRequest)
        .then((response) => {
            // Display user account information on successful response
            const username = response.account.username;
            displayNotification('success', `User Session: \nUsername: ${username}`);
            console.log(response.account);
        })
        .catch((error) => {
            if (error.message.includes('interaction_required') || error.message.includes('login_required')) {
                displayNotification('warning', 'interaction_required: Session information is not sufficient for single-sign-on.');
            } else {
                alert(error.message);
            }
            console.log(error);
        });
    };

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
                        //title="B2C"
                        title={<><img src={appIcon} alt="icon" /> B2C</>}
                        drop=""
                    >
                        <Dropdown.Item as="button" onClick={() => window.location.href = appURI_EntraID}>
                            Entra ID
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => window.location.href = appURI_CIAM}>
                            CIAM
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
                <Nav.Link className="navbarButton" onClick={handleLoginRedirect}>
                        Login Redirect
                </Nav.Link>
                <Nav.Link className="navbarButton" onClick={handleCheckSession}>
                        Check Session
                </Nav.Link>
                <AuthenticatedTemplate>
                    <Nav.Link className="navbarButton" onClick={handleAcquireToken}>
                        Acquire Token
                    </Nav.Link>
                    {/* <Nav.Link className="navbarButton" onClick={handleProfileData}>
                        Get Profile
                    </Nav.Link> */}
                    <Nav.Link className="navbarButton" onClick={handleProfileEdit}>
                        Edit Profile
                    </Nav.Link>
                    <Nav.Link className="navbarButton" onClick={handleLogoutRedirect}>
                        Logout Redirect
                    </Nav.Link>
                    <div className="collapse navbar-collapse justify-content-end">
                        <DropdownButton
                            variant="warning"
                            drop="start"
                            title={activeAccount && activeAccount.username ? activeAccount.username : 'Unknown'}
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
