// Welcome.jsx
import React from 'react';
import { appURI_EntraID } from '../authConfig';
//import { FaPen, FaBook } from 'react-icons/fa';

const Welcome = () => {
    return (
        <div style={{ textAlign: 'left', marginTop: '40px', marginBottom: '20px' }}>
            <h5>Instructions</h5>
            <ol style={{ textAlign: 'left', display: 'inline-block', fontSize: '18px' }}>
                <li>
                    In Entra ID Azure portal, setup an <b>App registration</b> with <b>SPA</b> platform, and add the redirect URI: <b>{ appURI_EntraID }</b>.
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
                <li>
                    <b>Authority</b> parameter Format: <b>Cloud_Instance_Id/Tenant_Info</b>
                    <ul>
                        <li>
                            Cloud_Instance: the instance of the Azure cloud. For the main or global Azure cloud, enter https://login.microsoftonline.com.
                        </li>
                        <li>
                            Tenant_info:
                            <ul>
                                <li>If your application supports accounts in any organizational directory and personal Microsoft accounts, replace this value with <b>common</b>. To restrict support to personal Microsoft accounts only, replace this value with <b>consumers</b>.</li>
                                <li>If your application supports accounts in any organizational directory, replace this value with <b>organizations</b>.</li>
                                <li>If your application supports accounts in single organization directory, replace with the <b>Directory (tenant) ID</b> (a GUID) or <b>Tenant name</b> value (for example, contoso.onmicrosoft.com).</li>
                            </ul>
                        </li>
                    </ul>                    
                </li>
            </ol>
        </div>
    );
};

export default Welcome;