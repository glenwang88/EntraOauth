# Entra OAuth / OIDC Configuration & Testing

This app provides the ability to configure Entra OAuth / OIDC authentication parameters and test the authentication flow.

1. Configurable OAuth / OIDC authentication parameters, e.g. Client ID, Scope permission etc.
2. Support for Entra ID / CIAM / Azure B2C.
3. Quick & easy testing of Entra OAuth authentication.
4. MSAL (Microsoft Authentication Library) function test.


## Getting Started

Procedure to start one or all three SPA apps, for Entra ID, CIAM (External ID), Azure B2C.
   ```bash
   cd EntraID/SPA
   npm install
   npm run start-ce

   cd CIAM/SPA 
   npm install
   npm run start-ce

   cd AzureB2C/SPA 
   npm install
   npm run start-ce
   ```

Note: By default Apps run at http://localhost:3001, http://localhost:3002, http://localhost:3003. Apps URL should be configured in authConfig.js to support menu navigation through three apps.

In Entra admin center or Azure portal, setup an App Registrations with SPA platform, and add the redirect URI http://localhost:300x/

![Screenshot](ReadmeFiles/EntraOauth.png)
