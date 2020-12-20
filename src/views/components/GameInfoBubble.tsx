import React, {useState, useEffect} from 'react';
import gameManager from '../../gameManager';
import Square from '../../interfaces/Square';
import WinStatus from '../../interfaces/WinStatus';
import Player from '../../interfaces/Player';
import {emptyLocalBoard} from '../../sampleBoard';
import Timer from './Timer';
import HowLongAgo from './HowLongAgo';

function GameInfoBubble(props: {code: string}): JSX.Element {
    const [xPlayer, setXPlayer] = useState<string>('??');
    const [oPlayer, setOPlayer] = useState<string>('??');
    const [gameStart, setGameStart] = useState<number>(0);
    const [gameEnd, setGameEnd] = useState<number>(0);
    const [winStatus, setWinStatus] = useState<WinStatus>({
        winChar: Square.Empty,
        status: emptyLocalBoard
    });
    const [started, setStarted] = useState<boolean>(false);
    const [iAm, setIAm] = useState<Square>(Square.Empty);
    
    useEffect(() => {
        async function main() {
            const userID = gameManager.fetchUserID(props.code);
            const status = await gameManager.checkStatus(props.code, false, userID);
            
            if (!status.started) {
                setStarted(false);
                return;
            }
            setStarted(true);
            const players = status.players as Player[];
            
            if (userID) {
                if (players.filter((player) => player.isX)[0].userID === userID) {
                    setIAm(Square.X);
                } else if (players.filter((player) => !player.isX)[0].userID === userID) {
                    setIAm(Square.O);
                }
            }
            
            setXPlayer(players.filter((player) => player.isX)[0].name);
            setOPlayer(players.filter((player) => !player.isX)[0].name);
            
            setGameStart(status.gameStart as number);
            setGameEnd(status.gameEnd as number);
            setWinStatus(status.winStatus as WinStatus);
            gameManager.watchMatchChanges(props.code, setWinStatus, setGameEnd);
        }
        main();
    }, []);
    
    return (
        <div>
            {started &&
            <div className='gameInfoBubble'>
                <span>
                    <p><b>{props.code}:</b> {winStatus.winChar === Square.Empty ? 'In Progress' : ('Match Over' +   (winStatus.winChar === Square.Tie ? ' (Tie)' : ''))} - </p>
                    {gameEnd === 0 &&
                        <Timer startTime={gameStart} endTime={gameEnd} />
                    }
                    {gameEnd !== 0 &&
                        <HowLongAgo referenceTime={gameEnd} />
                    }
                </span>
                <p>{xPlayer} (X){iAm === Square.X ? ' (You)' : ''}{winStatus.winChar === Square.X ? ' (Winner)' : ''} v. {oPlayer} (O){iAm === Square.O ? ' (You)' : ''}{winStatus.winChar === Square.O ? ' (Winner)' : ''}</p>
            </div>
            }
        </div>
    );
}

export default GameInfoBubble;