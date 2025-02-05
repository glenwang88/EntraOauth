// ConfigurationPage.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
//import { FaCog } from 'react-icons/fa';

// Helper function to convert query string to StringDict
const queryStringToStringDict = (queryString) => {
    return queryString.split('&').reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        acc[key] = value;
        return acc;
    }, {});
};

// Helper function to convert StringDict to query string
const stringDictToQueryString = (stringDict) => {
    return Object.entries(stringDict).map(([key, value]) => `${key}=${value}`).join('&');
};


export const Configurations = () => {
    const [notification, setNotification] = useState({visible: false, variant: 'success', message: ''});
    const [clientId, setClientId] = useState('');
    const [authority, setAuthority] = useState('https://login.microsoftonline.com/common');
    const [scopes, setScopes] = useState('User.Read');
    const [extraQueryParameters, setExtraQueryParameters] = useState('');
    const [tokenQueryParameters, setTokenQueryParameters] = useState('');
    const [cacheLocation, setCacheLocation] = useState('localStorage');
    const [loginHint, setLoginHint] = useState('');
    const [prompt, setPrompt] = useState('');
    const [domainHint, setDomainHint] = useState('');

    const displayNotification = (variant, message) => {
        // Display the notification
        setNotification({ visible: true, variant, message });
    
        // Hide the notification after few seconds
        setTimeout(() => {
            setNotification({visible: false, variant: 'success', message: ''});
        }, 3000);
    };

    useEffect(() => {
        const storedMsalConfig = localStorage.getItem('entraIDMsalConfig');
        if (storedMsalConfig) {
                const { auth: { clientId, authority }, cache: { cacheLocation } }
                    = JSON.parse(storedMsalConfig);
                setClientId(clientId || '');
                setAuthority(authority || '');
                setCacheLocation(cacheLocation || '');
        }

        const storedLoginRequest = localStorage.getItem('entraIDLoginRequest');
        if (storedLoginRequest) {
            const { scopes, extraQueryParameters, loginHint, prompt, domainHint, tokenQueryParameters} 
                = JSON.parse(storedLoginRequest);
            setScopes(scopes ? scopes.join(' ') : '');
            setExtraQueryParameters(extraQueryParameters ? stringDictToQueryString(extraQueryParameters) : '');
            setTokenQueryParameters(tokenQueryParameters ? stringDictToQueryString(tokenQueryParameters) : '');
            setLoginHint(loginHint || '');
            setPrompt(prompt || '');
            setDomainHint(domainHint || '');
        }

        if (localStorage.getItem('configSaveSuccess') === 'true') {
            displayNotification('success', 'Parameters have been saved for authentication!');
            localStorage.removeItem('configSaveSuccess'); // clear the flag from local storage
        }
    }, []);

    const handleSave = (event) => {
        try {
            event.preventDefault();
            localStorage.setItem('entraIDMsalConfig', JSON.stringify({
                auth: {
                    clientId: clientId,
                    authority: authority
                },
                cache: {
                    cacheLocation: cacheLocation
                },
                system: {
                    iframeHashTimeout: 10000
                }
            }));
            localStorage.setItem('entraIDLoginRequest', JSON.stringify({
                    scopes: scopes.split(' '),
                    extraQueryParameters: queryStringToStringDict(extraQueryParameters),
                    tokenQueryParameters: queryStringToStringDict(tokenQueryParameters),
                    loginHint: loginHint,
                    prompt: prompt,
                    domainHint: domainHint
            }));
            localStorage.setItem('configSaveSuccess', 'true');
            window.location.reload();
       } catch (error) {
        console.error('An error occurred:', error);
        // Handle the error as needed
        displayNotification('danger', error.message);
       }
    };


    return (
        
            <Card className="bg-light" style={{ marginTop: '40px', marginBottom: '40px'  }}>
                {notification.visible && 
                    <Alert variant={notification.variant} onClose={() => setNotification({visible: false, variant: 'success', message: ''})} dismissible>
                        {notification.message}
                    </Alert>
                }
                <Card.Header> OAuth Configuration Form - Entra ID</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSave}>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Client ID: <span style={{ color: 'red' }}>*</span> </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={clientId} onChange={(e) => setClientId(e.target.value)} required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Authority: <span style={{ color: 'red' }}>*</span> 
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip id="tooltip-right" className="wide-tooltip">
                                       See explanations in the Notes section under the configuration form.
                                    </Tooltip>
                                }
                            >
                                <span>
                                    <FaInfoCircle style={{ marginLeft: '5px' }} />
                                </span>
                            </OverlayTrigger>
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={authority} onChange={(e) => setAuthority(e.target.value)} required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Scopes:</Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={scopes} onChange={(e) => setScopes(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Cache Location:</Form.Label>
                            <Col sm="10">
                                <Form.Control as="select" value={cacheLocation} onChange={(e) => setCacheLocation(e.target.value)}>
                                    <option>localStorage</option>
                                    <option>sessionStorage</option>
                                    <option>memoryStorage</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Login Hint:</Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={loginHint} onChange={(e) => setLoginHint(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Prompt:</Form.Label>
                            <Col sm="10">
                                <Form.Control as="select" value={prompt} onChange={(e) => setPrompt(e.target.value)}>
                                    <option value="">Select...</option>
                                    <option value="login">login</option>
                                    <option value="none">none</option>
                                    <option value="consent">consent</option>
                                    <option value="select_account">select_account</option>
                                    {/* <option value="create">create</option> */}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Domain Hint:</Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={domainHint} onChange={(e) => setDomainHint(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Extra Authorize Params:</Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={extraQueryParameters} onChange={(e) => setExtraQueryParameters(e.target.value)} placeholder="e.g. param1=value1&param2=value2"/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Extra Token Params:</Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={tokenQueryParameters} onChange={(e) => setTokenQueryParameters(e.target.value)} placeholder="e.g. param1=value1&param2=value2"/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Col sm="5">
                                <Button type="submit">Save for Auth</Button>
                            </Col>
                        </Form.Group>
                        
                    </Form>
                 </Card.Body>
            </Card>
        
    );
};