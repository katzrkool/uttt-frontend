import React, {useEffect} from 'react';
import MiniBoard from './components/MiniBoard';
import GlobalBoard from '../interfaces/GlobalBoard';
import Status from '../interfaces/Status';
import Position from '../interfaces/Position';
import WinStatus from '../interfaces/WinStatus';

import './Board.css';

function GameBoard(props: {gameData: GlobalBoard; setGameData: React.Dispatch<React.SetStateAction<GlobalBoard>>; status: Status; isX: boolean, makeMove: (boardPosition: Position, squarePosition: Position) => void, winStatus: WinStatus, boardMsg: string}): JSX.Element {
    return (
        <div className="gameBoard">
            <div className="row">
                <MiniBoard isX={props.isX} BoardData={props.gameData.topLeft} status={props.status} boardLocation={Position.topLeft} makeMove={props.makeMove} winStatus={props.winStatus} />
                <MiniBoard isX={props.isX} BoardData={props.gameData.topCenter} status={props.status} boardLocation={Position.topCenter} makeMove={props.makeMove} winStatus={props.winStatus} />
                <MiniBoard isX={props.isX} BoardData={props.gameData.topRight} status={props.status} boardLocation={Position.topRight} makeMove={props.makeMove} winStatus={props.winStatus} />
            </div>
            <div className="row">
                <MiniBoard isX={props.isX} BoardData={props.gameData.centerLeft} status={props.status} boardLocation={Position.centerLeft} makeMove={props.makeMove} winStatus={props.winStatus} />
                <MiniBoard isX={props.isX} BoardData={props.gameData.centerCenter} status={props.status} boardLocation={Position.centerCenter} makeMove={props.makeMove} winStatus={props.winStatus} />
                <MiniBoard isX={props.isX} BoardData={props.gameData.centerRight} status={props.status} boardLocation={Position.centerRight} makeMove={props.makeMove} winStatus={props.winStatus} />
            </div>
            <div className="row">
                <MiniBoard isX={props.isX} BoardData={props.gameData.bottomLeft} status={props.status} boardLocation={Position.bottomLeft} makeMove={props.makeMove} winStatus={props.winStatus} />
                <MiniBoard isX={props.isX} BoardData={props.gameData.bottomCenter} status={props.status} boardLocation={Position.bottomCenter} makeMove={props.makeMove} winStatus={props.winStatus} />
                <MiniBoard isX={props.isX} BoardData={props.gameData.bottomRight} status={props.status} boardLocation={Position.bottomRight} makeMove={props.makeMove} winStatus={props.winStatus} />
            </div>
            <h3 className='squareStatus'>{props.boardMsg}</h3>
        </div>
    );
}

export default GameBoard;