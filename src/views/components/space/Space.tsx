import React, {MouseEvent} from 'react';
import Square from '../../../interfaces/Square';
import X from './X.svg';
import O from './O.svg';
import Empty from './Empty.svg';
import Position from '../../../interfaces/Position';

function Space(props: {square: Square; active: boolean; isX: boolean, position: Position, makeMove: (position: Position) => void}): JSX.Element {
    const clickHandler = (_event: MouseEvent<HTMLImageElement>) => {
        if (props.active) {
            props.makeMove(props.position);
        }
    };

    if (props.square === Square.X) {
        return (
            <img src={X} alt="" className="space xSquare"/>  
        );
    } else if (props.square === Square.O) {
        return (
            <img src={Empty} alt="" className="space oSquare"/> 
        );
    } else {
        return (
            <img src={Empty} alt="" onClick={clickHandler} className={`space ${props.active ? ' active' : ''}${props.isX ? ' xCandidate' : ' yCandidate'}`}/>
        );
    }
}

export default Space;