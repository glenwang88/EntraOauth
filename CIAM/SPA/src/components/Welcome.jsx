// Welcome.jsx
import React from 'react';
import { appURI_CIAM } from '../authConfig';

const Welcome = () => {
    return (
        <div style={{ textAlign: 'left', marginTop: '40px', marginBottom: '20px' }}>
            <h5>Instructions</h5>
            <ol style={{ textAlign: 'left', display: 'inline-block', fontSize: '18px' }}>
                <li>
                    In CIAM Azure portal, setup an <b>App registration</b> with <b>SPA</b> platform, and add the redirect URI: <b>{ appURI_CIAM }</b>.
                </li>
                <li>
                    Setup the parameters in the configurations form, e.g. Client ID etc., click on Save button.
                </li>
                <li>
                    Login in the user, perform actions e.g. Acquire tokens. You can change OAuth parameters along with your test.
                </li>
                <li>
                    You can select other platforms you want to test from top left corner: Entra ID / CIAM / B2C.
                </li>
            </ol>
            <h5>Notes</h5>
            <ol>
                <li>This is a SPA app, only front end without backend, using MSAL and Authorization Code with PKCE flow.</li>
            </ol>
        </div>
    );
};

export default Welcome;