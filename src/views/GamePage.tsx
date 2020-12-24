import React, {MouseEvent, useEffect, useState} from 'react';
import GameBoard from './GameBoard';
import {emptyBoard, emptyLocalBoard} from '../sampleBoard';
import Header from './components/header/Header';
import GlobalBoard from '../interfaces/GlobalBoard';
import './GamePage.css';
import Status from '../interfaces/Status';
import Position from '../interfaces/Position';
import {Link, useParams} from 'react-router-dom';
import gameManager from '../gameManager';
import Player from '../interfaces/Player';
import Square from '../interfaces/Square';
import WinStatus from '../interfaces/WinStatus';
import StatusBar from './components/StatusBar';
import ConnectionStatus from '../interfaces/ConnectionStatus';
import LoadingPage from './LoadingPage';
import Footer from './components/Footer';
import {setTitle} from '../util';

function prettifyPosition(position: Position): string {
    switch (position) {
        case Position.topLeft:
            return 'top left';
        case Position.topCenter:
            return 'top center';
        case Position.topRight:
            return 'top right';
        case Position.centerLeft:
            return 'center left';
        case Position.centerCenter:
            return 'center';
        case Position.centerRight:
            return 'center right';
        case Position.bottomLeft:
            return 'bottom left';
        case Position.bottomCenter:
            return 'bottom center';
        case Position.bottomRight:
            return 'bottom right';
        case Position.any:
            return 'any';
    }
}

function GamePage(): JSX.Element {
    const {code} = useParams();
    
    const [board, setBoard] = useState<GlobalBoard>(emptyBoard);
    const [gameStart, setGameStart] = useState<number>(0);
    const [gameEnd, setGameEnd] = useState<number>(0);
    // Also doubles as the opponent if not spectating
    const [playerTwo, setPlayerTwo] = useState<Player | undefined>(undefined);
    // also doubles as the client if not spectating
    const [playerOne, setPlayerOne] = useState<Player | undefined>(undefined);
    
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.connecting);

    // not used for spectating
    const [isX, setIsX] = useState<boolean>(false);
    
    const [statusMsg, setStatusMsg] = useState<string>('??');
    const [boardMsg, setBoardMsg] = useState<string>('Next move is in a square somewhere');
    
    const [winStatus, setWinStatus] = useState<WinStatus>({
        winChar: Square.Empty,
        status: emptyLocalBoard
    });

    const [spectating, setSpectating] = useState<boolean>(true);
    const [started, setStarted] = useState<boolean>(false);
    // This will need to be set to isX later for the initial
    const [status, setStatus] = useState<Status>({
        turnEnabled: false,
        activeBoard: Position.topLeft
    });
    
    const clickHandler = (_event: MouseEvent<HTMLAnchorElement>) => {
        return;
    };
    
    const init = async () => {
        gameManager.setSetConnection(setConnectionStatus);
        const userID = gameManager.fetchUserID(code);
        
        const status = await gameManager.checkStatus(code, true, userID);
        
        if (status.found === false) {
            alert(`Match ${code} not found!`);
            window.location.href = '/';
        }
        
        const players = status.players as Player[];
        
        if (status.started || players.length === 2) {
            const matchingPlayers = players.filter((player: Player) => player.userID !== undefined);
            
            setStarted(true);
            
            // If we are a player
            if (matchingPlayers && matchingPlayers.length > 0) {
                const me = matchingPlayers[0];
                // If a userID was returned, we aren't spectating
                setSpectating(false);
                setPlayerOne(me);
                setPlayerTwo(players.filter((player: Player) => player !== me)[0]);
                setIsX(me.isX);
            } else {
                setPlayerOne(players[0] as Player);
                setPlayerTwo(players[1] as Player);
            }

            setWinStatus(status.winStatus as WinStatus);
            setBoard(status.board as GlobalBoard);
            setGameStart(status.gameStart as number);
            setGameEnd(status.gameEnd as number);
        } else if (players.length === 1 && players[0].userID === userID && (userID?.length ?? 0) > 0) {
            // if one player, and game hasn't started
            setStarted(false);
            gameManager.waitForMatchStarted(code).then((resp) => {
                setStarted(true);
            });
        } else {
            if (players.length === 1 && players[0].userID !== userID && (userID?.length ?? 0) > 0) {
                localStorage.setItem(code, JSON.stringify({
                    userID: '',
                    lastVisited: Date.now()
                }));
            }
            window.location.href = `/join/${code}`;
        }
        
        await gameManager.watchMatchChanges(code, setWinStatus, setGameEnd, setBoard);
    };

    
    useEffect(() => {
        init();
        const titleCleanup = setTitle('Ultimate Tic Tac Toe: ' + code);
        return function cleanup() {
            gameManager.unsetSetConnection();
            titleCleanup();
        };
    }, [started]);
    
    useEffect(() => {
        setStatus({
            turnEnabled: board.xTurn === isX && !spectating && winStatus.winChar === Square.Empty,
            activeBoard: board.activeBoard
        });
        if (winStatus.winChar === Square.Empty) {
            setBoardMsg(`Next move is in ${board.activeBoard === Position.any ? 'any' : `the ${prettifyPosition(board.activeBoard)}`} square.`);
            if (!spectating) {
                setStatusMsg(playerOne?.isX === board.xTurn ? 'Your turn' : `${playerTwo?.name ?? '???'} (${ playerTwo?.isX ? 'X' : 'O'})'s  turn`);
            } else {
                setStatusMsg(playerOne?.isX === board.xTurn ? `${playerOne?.name ?? '???'}'s (${playerOne?.isX ? 'X' : 'O'}) turn` : `${playerTwo?.name ?? '???'}'s (${playerTwo?.isX ? 'X' : 'O'}) turn`);
            }
        } else {
            if (winStatus.winChar === Square.Tie) {
                setStatusMsg('Match Over! No winner');
                setBoardMsg('Match Over! No winner');
            } else {
                const winningPlayerName = winStatus.winChar === Square.X ? playerOne?.isX ? playerOne.name : playerTwo?.name : playerOne?.isX ? playerTwo?.name : playerOne?.name ?? '???';
                if (spectating || ((isX ? Square.O : Square.X) === winStatus.winChar)) {
                    setStatusMsg(`Match Over! ${winningPlayerName} (${winStatus.winChar}) won.`);
                    setBoardMsg(`Match Over! ${winningPlayerName} (${winStatus.winChar}) won.`);
                } else {
                    setStatusMsg(`Match Over! You (${winStatus.winChar}) won.`);
                    setBoardMsg(`Match Over! You (${winStatus.winChar}) won.`);
                }
            }
        }
    }, [board, winStatus]);
    
    const makeMove = (boardPosition: Position, squarePosition: Position) => {
        if (boardPosition !== Position.any && winStatus.status[boardPosition] === Square.Empty) {
            gameManager.makeMove(code, boardPosition, squarePosition).then((resp) => {
                if (resp.status === 'Success') {
                    setBoard(resp.board as GlobalBoard);
                    setWinStatus(resp.winStatus as WinStatus);
                    if (resp.gameEnd !== 0 && !isNaN(Number(resp.gameEnd))) {
                        setGameEnd(Number(resp.gameEnd));
                    }
                } else {
                    alert(`MakeMove failed: ${resp.status}`);
                    console.error(`MakeMove failed: ${resp.status}`);
                }
            });
        }
    };
    
    const reconnect = () => {
        init();
    };
    
    return (
        <div>
        
        {started &&
            <div>
                <Header />
                <main id="gamepagemain">
                    <Link id='homeheaderlink' to='/'>
                        <h1>Ultimate Tic Tac Toe</h1>
                    </Link>
                    
                    <div id="gamefield">
                        <GameBoard gameData={board} setGameData={setBoard} isX={isX} status={status} makeMove={makeMove} winStatus={winStatus} boardMsg={boardMsg}/>
                        
                        <StatusBar gameStart={gameStart} gameEnd={gameEnd} turnStatusMsg={statusMsg} playerOne={playerOne} playerTwo={playerTwo} spectating={spectating} sidebar={true} connection={connectionStatus} reconnect={reconnect}/>
                    </div>
                    <StatusBar gameStart={gameStart} gameEnd={gameEnd} turnStatusMsg={statusMsg} playerOne={playerOne} playerTwo={playerTwo} spectating={spectating} sidebar={false} connection={connectionStatus} reconnect={reconnect} />
                </main>
                <Footer />
            </div>
        }
        {!started &&
            <LoadingPage clickHandler={clickHandler} status={`Game Code: ${code} - Waiting for Opponent...`} code={code} header={'Waiting for Match to Begin'}/>
        }
        </div>
    );
}

export default GamePage;