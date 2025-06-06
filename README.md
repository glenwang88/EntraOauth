# Entra OAuth / OIDC Configuration & Testing

This app provides the ability to configure Entra (Azure) OAuth / OIDC authentication parameters and test the authentication flow.

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

*Note: By default Apps run at http://localhost:3001, http://localhost:3002, http://localhost:3003. Apps URL should be configured in authConfig.js to support menu navigation through three apps.*

In Entra admin center or Azure portal, setup App Registrations with SPA platform, and add the redirect URI http://localhost:300x/  
Entra ID: https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app  
CIAM: https://learn.microsoft.com/en-us/entra/external-id/customers/how-to-register-ciam-app?tabs=spa  
Azure B2C: https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-spa  

![Screenshot](ReadmeFiles/EntraOauth.png)
