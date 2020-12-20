import React, {useEffect, useState} from 'react';

function Timer(props: {startTime: number, endTime: number}): JSX.Element {
    const [time, setTime] = useState<string>('0:00');
    
    useEffect(() => {
        const interval = setInterval(() => {
            const diff = Math.floor(((props.endTime === 0 ? Date.now() : props.endTime) - props.startTime) / 1000);
            const hours = String(Math.floor(diff / 3600));
            const minutes = String(Math.floor((diff % 3600) / 60));
            const seconds = String(diff % 60);
            
            setTime(`${hours === '0' ? '' : hours + ':'}${minutes.length === 1 && hours !== '0' ? '0' + minutes : minutes}:${seconds.length === 1 ? '0' + seconds : seconds}`);
        }, 1000);
        return () => clearInterval(interval);
    }, [props.startTime, props.endTime]);
    
    return (
        <p className="timer">{time}</p>
    );
}

export default Timer;