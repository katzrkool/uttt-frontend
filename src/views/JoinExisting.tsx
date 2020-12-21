import React, {useEffect, useState} from 'react';
import Header from './components/header/Header';
import {Link, useParams, useLocation} from 'react-router-dom';
import gameManager from '../gameManager';
import BlankBoard from '../img/blankBoard.svg';
import './JoinExisting.css';
import * as querystring from 'querystring';
import {setTitle} from '../util';

function JoinExisting(): JSX.Element {
    const {code} = useParams();
    const params = querystring.parse(useLocation().search.substring(1));
    const [opponentName, setOpponentName] = useState<string | undefined>(undefined);
    const [searching, setSearching] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    
    useEffect(() => {
        async function main() {
            let localName = params.name;
            if (localName !== undefined) {
                if (typeof localName !== 'string') {
                    localName = localName.join(' ');
                }
                setName(name);
            }
            if (gameManager.fetchUserID(code) !== undefined) {
                window.location.href = `/match/${code}`;
                return;
            }
            const resp = await gameManager.checkStatus(code, false);
            if (resp.started) {
                window.location.href = `/match/${code}`;
                return;
            }
            if (!resp.found) {
                alert(`Match ${code} wasn't found.`);
                window.location.href = '/';
                return;
            }
            
            if (resp.found && localName !== undefined && localName.length > 0) {
                await joinMatch(localName);
                return;
            }
            if ((resp.players as {name: string}[]).length > 0) {
                setOpponentName((resp.players as {name: string}[])[0].name);
            }
            document.title = `Join Match ${code} against ${(resp.players as {name: string}[])[0].name}`;
        }
        const titleCleanup = setTitle(`Join Match ${code}`);
        main();
        return function cleanup() {
            titleCleanup();
        }
    }, []);
    
    const joinMatch = async (localName?: string) => {
        setSearching(true);
        if ((localName ?? name).length === 0) {
            alert('Name must be at least 1 character long');
            return;
        }
        const resp = await gameManager.joinMatch(code, localName ?? name);
        if (resp === undefined) {
            alert(`Match ${code} wasn't found.`);
            window.location.href = '/';
        }
        window.location.href = `/match/${code}`;
    };
    
    return (
        <div>
            <Header />
            <main id="homemain">
                <Link id='homeheaderlink' to='/'>
                    <h1>Ultimate Tic Tac Toe</h1>
                </Link>
                <div>
                    <div id='joingame'>
                        <h2>Join Game {code}{opponentName !== undefined ? ` against ${opponentName}` : ''}</h2>
                        <label>
                            <div className="labelInfo">Name:</div>
                            <input placeholder="Lucas" type="text" autoComplete="given-name" value={name} onChange={((event) => {
                                setName(event?.currentTarget.value);
                            })}/>
                        </label>
                        {(name.length > 0 && !searching) &&
                        <button className="roundButton" style={{backgroundColor: '#e95f5f'}} onClick={() => {joinMatch();}}>Join Match</button>
                        }
                        {searching &&
                            <img className="rotate-center" id="miniBlankboard" src={BlankBoard} alt="Blank Ultimate Tic Tac Toe Board" />
                        }
                    </div>
                </div>
            </main>
        </div>
    );
}

export default JoinExisting;