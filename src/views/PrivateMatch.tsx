import React, {MouseEvent, useState, useEffect} from 'react';
import './Matchmaking.css';
import {useLocation} from 'react-router-dom';
import LoadingPage from './LoadingPage';
import * as querystring from 'querystring';

import gameManager from '../gameManager';

function PrivateMatch() {
    const [status, setStatus] = useState<string>('Finding Match...');
    const [code, setCode] = useState<string | undefined>(undefined);
    const params = querystring.parse(useLocation().search.substring(1));
    
    const clickHandler = (_event: MouseEvent<HTMLAnchorElement>) => {
        return;
    };
    
    useEffect(() => {
        async function main() {
            let name = params.name;
            const visible = params.visible === 'true' ? true : false;
            if (name === undefined) {
                window.location.href = '/';
            }
            if (typeof name !== 'string') {
                name = name.join(' ');
            }
            
            const resp = await gameManager.createPrivateMatch(name, visible);
            
            setStatus(resp ? `Game Code: ${resp.code} - Waiting for Opponent...`: 'Creating Private Match failed. Please try again later.');
            setCode(resp.code);
            const gameData = await gameManager.waitForMatchStarted(resp.code);
            if (gameData.resp.code) {
                window.location.href = `/match/${gameData.resp.code}`;
            } else {
                console.error('No code recieved from watchForMatchStarted');
            }
        }
        main();
    }, []);
    return (
        <LoadingPage clickHandler={clickHandler} status={status} code={code} header='Private Match'/>
    );
}

export default PrivateMatch;