import React, {useEffect, useState} from 'react';
import ConnectionStatus from '../../interfaces/ConnectionStatus';

function ConnectionBar(props: {connection: ConnectionStatus, reconnect: () => void}): JSX.Element {
    const color = props.connection === ConnectionStatus.connecting ? '#ffe000' : props.connection === ConnectionStatus.connected ? '#11ff00' : '#ff0200';
    const statusMsg = props.connection === ConnectionStatus.connecting ? 'Connecting...' : props.connection === ConnectionStatus.connected ? 'Connected' : 'Disconnected from Server';

    return (
        <div className="connectionBar">
            <div>
                <svg width="24px" height="24px" viewBox="0 0 24 24">
                    <g fill={color}>
                        <circle id="Oval" cx="12" cy="12" r="12"></circle>
                    </g>
                </svg>
                <p className="connectionStatus">{statusMsg}</p>
            </div>
            {props.connection === ConnectionStatus.disconnected &&
                <button className="roundButton smallerButton" style={{backgroundColor: '#e95f5f'}} onClick={props.reconnect}>Reconnect</button>
            }
        </div>
    );
}

export default ConnectionBar;