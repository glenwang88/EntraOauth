/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MsalProvider, AuthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Container } from 'react-bootstrap';
import { PageLayout } from './components/PageLayout';

import { Configurations } from './components/Configurations';
import TokenList from './components/TokenList';
import Welcome from './components/Welcome';
import Profile from './components/Profile';
//import { NavigationBar } from './components/NavigationBar.jsx';

import './styles/App.css';

const MainContent = () => {
    /**
     * useMsal is a hook that returns the PublicClientApplication instance.
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
     * only render their children if a user is authenticated or unauthenticated, respectively. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
     */
    return (
        <div className="App">

            <AuthenticatedTemplate>
                {activeAccount ? (
                    <Container>
                        <TokenList/>
                    </Container>
                ) : null}
                {activeAccount ? (
                    <Container>
                        <Profile/>
                    </Container>
                ) : null}
            </AuthenticatedTemplate>
            <Container>
                <Configurations/>
            </Container>
            <Container>
                <Welcome/>
            </Container>
            
        </div>
    );
};

/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const App = ({ instance }) => {
    return (
        <MsalProvider instance={instance}>
            <PageLayout>
                <MainContent />
            </PageLayout>
        </MsalProvider>
    );
};

export default App;
