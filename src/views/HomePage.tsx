import React, {useState, useEffect} from 'react';
import Header from './components/header/Header';
import './HomePage.css';
import demoBoard from '../img/demoBoard.svg';
import {Link} from 'react-router-dom';
import CodeInput from './components/CodeInput';
import GameInfoBubble from './components/GameInfoBubble';
import Footer from './components/Footer';

function HomePage(): JSX.Element {
    const [name, setName] = useState('');
    const [visible, setVisible] = useState<boolean>(true);
    const [code, setCode] = useState<string>('');
    const [validCode, setValidCode] = useState<boolean>(false);
    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVisible(e.target.checked);
    };
    const [recentGames, setRecentGames] = useState<string[]>([]);
    
    useEffect(() => { 
        // Get 5 most recently visited games from local storage
        setRecentGames(Object.keys(JSON.parse(JSON.stringify(localStorage))).filter((key) => {
            try {
                const keys = Object.keys(JSON.parse(localStorage.getItem(key) ?? ''));
                return keys.includes('lastVisited') && keys.includes('userID');
            } catch (e) {
                return false;
            }
        }).sort((a, b) => {
            return JSON.parse(localStorage.getItem(b) ?? '').lastVisited - JSON.parse(localStorage.getItem(a) ?? '').lastVisited;
        }).splice(0,5));
    }, []);
    return (
        <div>
            <Header />
            <main id="homemain">
                <Link id='homeheaderlink' to='/'>
                    <h1>Ultimate Tic Tac Toe</h1>
                </Link>
                <div>
                    <div id="startgame">
                        <p id="rulesHeader">Start a match below, or <a id="ruleslink" href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe#Rules" target="_blank" rel="noopener noreferrer">read up on the rules.</a></p>
                        
                        <h2>Online Multiplayer</h2>
                        <label>
                            <div className="labelInfo">Name:</div>
                            <input placeholder="Lucas" type="text" value={name} autoComplete="given-name" onChange={((event) => {
                                setName(event?.currentTarget.value);
                            })}/>
                        </label>
                        <label>
                            <div className="labelInfo">Game Code:<br />
                                <span className="subtitle">(Optional)</span></div>
                            <CodeInput code={code} setCode={setCode} valid={validCode} setValid={setValidCode} />
                        </label>
                        
                        {(name.length > 0 && validCode) &&
                            <div id='onlineModes'>
                                <div id='joinMatchContainer'>
                                    <h3>Join Match</h3>
                                    <Link to={`/join/${code}?name=${name}`}>
                                        <button className="roundButton" style={{backgroundColor: '#0091ff'}}>Launch</button>
                                    </Link>
                                </div>
                            </div>
                        }
                        
                        {(name.length > 0 && !validCode) &&
                            <div id="onlineModes">
                                <div>
                                    <h3>Matchmaking</h3>
                                    <Link to={`/matchmaking?name=${name}`}>
                                        <button className="roundButton" style={{backgroundColor: '#218371'}}>Launch</button>
                                    </Link>
                                </div>
                                <div>
                                    <h3 id="privateHeader">Private Match</h3>
                                    {/*<label id="visibleCheckLabel"><input type="checkbox" checked={visible} onChange={onCheckboxChange}/>Visible to Others</label> */}
                                    <Link to={`/private?name=${name}&visible=${visible}`}>
                                        <button className="roundButton" style={{backgroundColor: '#e95f5f'}}>Launch</button>
                                    </Link>
                                </div>
                            
                            </div>
                        }
                        {recentGames.length > 0 &&
                            <div id='recentGames'>
                                <h2>Recent Matches</h2>
                                {recentGames.map((code) => {
                                    return (
                                        <Link to={`/match/${code}`} key={code}>
                                            <GameInfoBubble code={code}/>
                                        </Link>
                                    );
                                })}
                            </div>
                        }
                    </div>
                    <img height="500px" width="500px" id="demoBoard" src={demoBoard} alt="Example of Playing Board"/>
                </div>
            </main>
            <Footer />
        </div>
    );	
}

export default HomePage;