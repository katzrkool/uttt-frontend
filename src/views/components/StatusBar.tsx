import React from 'react';
import Player from '../../interfaces/Player';
import ConnectionStatus from '../../interfaces/ConnectionStatus';


import ConnectionBar from '../components/ConnectionBar';
import Timer from './Timer';

function StatusBar(props: {gameStart: number, gameEnd: number, turnStatusMsg: string, playerOne?: Player, playerTwo?: Player, spectating: boolean, sidebar: boolean, connection: ConnectionStatus, reconnect: () => void}): JSX.Element {
    return (
        <aside className={props.sidebar ? 'sidebar' : 'statusfooter' + ' statusbar'}>
            {props.playerOne !== undefined &&
                <h2>{props.playerOne?.name ?? '???'} ({props.playerOne?.isX ? 'X' : 'O'}) vs {props.playerTwo?.name ?? '???'} ({props.playerTwo?.isX ? 'X' : 'O'})</h2>
            }
            {(props.spectating && props.playerOne !== undefined)&&
                <p>You are spectating this match.</p>
            }
            
            {(!props.spectating && props.playerOne !== undefined) && 
                <p>You are {props.playerOne?.name} ({props.playerOne?.isX ? 'X' : 'O'})</p>
            }
            
            {props.gameStart !== 0 &&
                <b><Timer startTime={props.gameStart} endTime={props.gameEnd}/></b>
            }
            
            <ConnectionBar connection={props.connection} reconnect={props.reconnect}/>
        
            {props.playerOne !== undefined &&
                <p id="statusmsg">{props.turnStatusMsg}</p>
            }
        </aside>
    );
}

export default StatusBar;