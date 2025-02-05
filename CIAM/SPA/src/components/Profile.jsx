
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useMsal } from '@azure/msal-react';
//import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

import { eventEmitter } from '../eventEmitter';
import { callMsGraph } from '../graph';
import { graphConfig } from "../authConfig";


const Profile = () => {

    const { instance, accounts } = useMsal();

    const [graphData, setGraphData] = useState(null);
    const [newProfile, setNewProfile] = useState(false);

    useEffect(() => {
        const handleProfileData = () =>  {

            // Silently acquires an access token which is then attached to a request for MS Graph data
            instance
                .acquireTokenSilent({
                    ...graphConfig.graphMeLoginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    callMsGraph(response.accessToken)
                        .then((response) => {
                            //console.log(response)
                            if(response.error)
                            {
                                console.log(response.error);
                                //alert(JSON.stringify(response.error, null, 2));

                            } else {
                                setGraphData(response)
                                setNewProfile(true);
                                setTimeout(() => setNewProfile(false), 2000); // Reset after 2 seconds
                            }
                        })
                })
                .catch(error => {
                    console.log(error);
                    alert(error.toString());
                });
        };

        eventEmitter.on('handleProfileData', handleProfileData);

        //Clean up the event listener when the component unmounts
        return () => {
            eventEmitter.off('handleProfileData', handleProfileData);
        };
    }, [accounts, instance]);

    return (
        <>
            {graphData ? (
                <div style={{paddingTop: '15px'}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th colSpan="4" className={newProfile ? 'new-data' : ''}><FaUser /> Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(graphData).map(([key, value], index) => (
                            <tr key={index}>
                                <td><strong>{key}</strong></td>
                                <td>{Array.isArray(value) ? value.join(', ') : value}</td>
                                {index % 2 === 0 && Object.entries(graphData)[index + 1] ? (
                                    <>
                                        <td><strong>{Object.entries(graphData)[index + 1][0]}</strong></td>
                                        <td>{Array.isArray(Object.entries(graphData)[index + 1][1]) ? Object.entries(graphData)[index + 1][1].join(', ') : Object.entries(graphData)[index + 1][1]}</td>
                                    </>
                                ) : (
                                    <>
                                        <td></td>
                                        <td></td>
                                    </>
                                )}
                            </tr>
                        )).filter((_, index) => index % 2 === 0)}
                    </tbody>
                </Table>
                </div>
            ) : (
                <></>
            )}
        </>
    );

};

export default Profile;