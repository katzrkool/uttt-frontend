import React, {useEffect, useState} from 'react';
import LocalBoard from '../../interfaces/LocalBoard';
import Space from './space/Space';
import Status from '../../interfaces/Status';
import Position from '../../interfaces/Position';
import Square from '../../interfaces/Square';
import WinStatus from '../../interfaces/WinStatus';

import X from './space/X.svg';
import O from './space/O.svg';

function MiniBoard(props: {BoardData: LocalBoard; status: Status; boardLocation: Position; isX: boolean, makeMove: (boardPosition: Position, squarePosition: Position) => void, winStatus: WinStatus}): JSX.Element {
    const [active, setActive] = useState<boolean>(false);
    const [winChar, setWinChar] = useState<Square>(Square.Empty);

    useEffect(() => {
        setActive((props.status.activeBoard === props.boardLocation || props.status.activeBoard === Position.any) && props.status.turnEnabled);
        
        if (props.boardLocation !== Position.any) {
            if (props.winStatus?.status !== undefined) {
                setWinChar(props.winStatus?.status[props.boardLocation] ?? Square.Empty);
                
            }
        }
    }, [props]);

    const makeMove = (position: Position) => {
        if (position !== Position.any) {
            props.makeMove(props.boardLocation, position);
        } else {
            console.error('Position.any was passed to makeMove');
        }
    };
    
    return (
        <div className='miniBoardContainer'>
            {(winChar !== Square.Empty && winChar !== Square.Tie) &&
                <img className='overlay' src={winChar === Square.X ? X : O} />
            }
            <div className={`miniBoard${props.status.activeBoard === props.boardLocation && props.winStatus.winChar === Square.Empty? ' highlight' : ''}`}>
                <div>
                    <Space active={active} isX={props.isX} square={props.BoardData.topLeft} makeMove={makeMove} position={Position.topLeft}/>
                    <Space active={active} isX={props.isX} square={props.BoardData.topCenter} makeMove={makeMove} position={Position.topCenter}/>
                    <Space active={active} isX={props.isX} square={props.BoardData.topRight} makeMove={makeMove} position={Position.topRight} />
                </div>
                <div>
                    <Space active={active} isX={props.isX} square={props.BoardData.centerLeft} makeMove={makeMove} position={Position.centerLeft}/>
                    <Space active={active} isX={props.isX} square={props.BoardData.centerCenter} makeMove={makeMove} position={Position.centerCenter}/>
                    <Space active={active} isX={props.isX} square={props.BoardData.centerRight} makeMove={makeMove} position={Position.centerRight}/>
                </div>
                <div>
                    <Space active={active} isX={props.isX} square={props.BoardData.bottomLeft} makeMove={makeMove} position={Position.bottomLeft} />
                    <Space active={active} isX={props.isX} square={props.BoardData.bottomCenter} makeMove={makeMove} position={Position.bottomCenter}/>
                    <Space active={active} isX={props.isX} square={props.BoardData.bottomRight} makeMove={makeMove} position={Position.bottomRight}/>
                </div>
            </div>
        </div>
    );
}

export default MiniBoard;