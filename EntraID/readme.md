# Entra ID OAuth / OIDC Configuration & Testing

This app provides the ability to configure Entra OAuth 2.0 authentication parameters and test the authentication flow.

1. Configurable OAuth / OIDC authentication parameters, e.g. Client ID, Scope permission etc.
2. Quick & easy testing of Entra OAuth authentication.
3. MSAL (Microsoft Authentication Library) function test.

Microsoft Entra ID is a cloud-based identity and access management service that your employees can use to access external resources. Example resources include Microsoft 365, the Azure portal, and thousands of other SaaS applications.  
https://learn.microsoft.com/en-us/entra/identity/

## Getting Started

Procedure to start one or all three SPA apps, for Entra ID, CIAM (External ID), Azure B2C.
   ```bash
   cd EntraID/SPA
   npm install
   npm run start-ce
   ```

*Note: By default App run at http://localhost:3001. Apps URL should be configured in authConfig.js to support menu navigation through three apps.*

In Entra admin center, setup an App Registration with SPA platform, and add the redirect URI: http://localhost:3001/.  
https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app  

![Screenshot](../ReadmeFiles/EntraOauth.png)

