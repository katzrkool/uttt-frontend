import React, {MouseEvent, useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import gameManager from '../gameManager';
import * as querystring from 'querystring';
import LoadingPage from './LoadingPage';

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
            }
            if (typeof name !== 'string') {
                name = name.join(' ');
            }
            const resp = await gameManager.matchmake(name);
            setStatus(resp ? `Game Code: ${resp.code} - Waiting for Opponent...` : 'Matchmaking Failed. Please try again later');
            setCode(resp.code);
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