import React, {MouseEvent, useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import gameManager from '../gameManager';
import * as querystring from 'querystring';
import LoadingPage from './LoadingPage';
import ConnectionStatus from '../interfaces/ConnectionStatus';

function Matchmaking(): JSX.Element {
    const [status, setStatus] = useState<string>('Finding Match...');
    const [code, setCode] = useState<string | undefined>(undefined);
    const params = querystring.parse(useLocation().search.substring(1));
    
    const clickHandler = (_event: MouseEvent<HTMLAnchorElement>) => {
        if (code) {
            gameManager.stopMatchmaking(code);
        }
    };
    
    useEffect(() => {
        async function main() {
            let name = params.name;
            if (name === undefined) {
                window.location.href = '/';
                return;
            }
            if (typeof name !== 'string') {
                name = name.join(' ');
            }
            const resp = await gameManager.matchmake(name);
            if (resp.userID === undefined) {
                window.location.href = `/join/${resp.code}?name=${name}`;
                return;
            }
            setStatus(resp ? `Game Code: ${resp.code} - Waiting for Opponent...` : 'Matchmaking Failed. Please try again later');
            setCode(resp.code);
            gameManager.sock.onclose = (event) => {
                if (event.code === 1002) {
                    console.error(`Websocket error observed: ${JSON.stringify(event)}`);
                    alert(`Websocket error observed: ${event.reason}`);
                } else if (!event.wasClean) {
                    console.error(`Unexpected disconnect from server: ${JSON.stringify(event)}`);
                }
                if (gameManager.setConnection) {
                    gameManager.setConnection(ConnectionStatus.disconnected);
                }
                window.location.href = '/';
            };
            const gameData = await gameManager.waitForMatchStarted(resp.code);
            if (gameData.resp.code) {
                window.location.href = `/match/${gameData.resp.code}`;
            } else {
                throw new Error('No code recieved from waitForMatchStarted');
            }
        }
        main();
    }, []);
    return (
        <LoadingPage clickHandler={clickHandler} status={status} code={code} header='Matchmaking'/>
    );
}

export default Matchmaking;