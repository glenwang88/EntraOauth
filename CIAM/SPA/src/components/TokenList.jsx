// TokenList.jsx
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useMsal } from '@azure/msal-react';

import { eventEmitter } from '../eventEmitter';

import '../styles/TokenList.css'; 

const TokenList = () => {

    const { instance } = useMsal();

    const [tokens, setTokens] = useState([]);
    const [newToken, setNewToken] = useState(false);

    useEffect(() => {
        const handleAcquireToken = () =>  {
            const storedLoginRequest = localStorage.getItem('ciamLoginRequest');
            const ciamloginRequest = JSON.parse(storedLoginRequest);
            //instance.acquireTokenSilent(ciamloginRequest)
            instance.acquireTokenSilent({
                ...ciamloginRequest,
                forceRefresh: true
            })
                .then(response => {
                    const currentTime = new Date().toLocaleString();
                    setTokens(prevTokens => [{
                        time: currentTime,
                        idToken: response.idToken,
                        accessToken: response.accessToken
                    }, ...prevTokens]);
                    setNewToken(true);
                    setTimeout(() => setNewToken(false), 2000); // Reset after 2 seconds
                })
                .catch(error => {
                    console.log(error);
                    alert(error.toString());
                });
        };

        eventEmitter.on('acquireToken', handleAcquireToken);

        // Clean up the event listener when the component unmounts
        return () => {
            eventEmitter.off('acquireToken', handleAcquireToken);
        };
    }, [instance]);

    return (
        <>
            {tokens.length > 0 && (
                <Table striped bordered hover style={{ marginTop: '50px', marginBottom: '30px' }}>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>ID Token</th>
                            <th>Access Token</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((token, index) => (
                            <tr key={index} className={newToken && index === 0 ? 'new-data' : ''}>
                                <td className={newToken && index === 0 ? 'new-data' : ''}>{token.time}</td>
                                <td className={newToken && index === 0 ? 'new-data' : ''}>
                                    {token.idToken 
                                        ? <>
                                            {`${token.idToken.slice(0, 35)}...`}
                                            <a href={`https://jwt.ms/#id_token=${token.idToken}`} target="_blank" rel="noopener noreferrer">View & Decode</a>
                                        </>
                                        : ''}
                                </td>
                                <td className={newToken && index === 0 ? 'new-data' : ''}>
                                    {token.accessToken 
                                        ? <>
                                            {`${token.accessToken.slice(0, 35)}...`}
                                            <a href={`https://jwt.ms/#access_token=${token.accessToken}`} target="_blank" rel="noopener noreferrer">View & Decode</a>
                                        </>
                                        : ''}
                                </td>
                                {/* <td>{token.idToken.slice(0, 35)}... <a href={`https://jwt.ms/#id_token=${token.idToken}`} target="_blank" rel="noopener noreferrer">View & Decode</a></td>
                                <td>{token.accessToken.slice(0, 35)}... <a href={`https://jwt.ms/#access_token=${token.accessToken}`} target="_blank" rel="noopener noreferrer">View & Decode</a></td> */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default TokenList;