import React, {useEffect, useState} from 'react';

const units = [
    {
        divisor: 31556952000,
        unit: 'year'
    },
    {
        divisor: 2629746000,
        unit: 'month'
    },
    {
        divisor: 604800000,
        unit: 'week',
    },
    {
        divisor: 86400000,
        unit: 'day'
    },
    {
        divisor: 3600000,
        unit: 'hour'
    },
    {
        divisor: 60000,
        unit: 'minute'
    }
];

function HowLongAgo(props: {referenceTime: number}): JSX.Element {
    const [status, setStatus] = useState<string>('');
    let timeout: ReturnType<typeof setTimeout>;
    
    const refresh = () => {
        const diff = Date.now() - props.referenceTime;
        
        let interval: {unit: string, divisor: number} | undefined = undefined;
        for (let index = 0; index < units.length; index++) {
            if ((diff + (units[index].divisor * 0.001)) >= units[index].divisor) {
                interval = units[index];
                break;
            }
        }
        
        if (interval === undefined) {
            interval = {
                divisor: 1000,
                unit: 'second'
            };
        }
        
        const result = Math.floor(diff / interval.divisor);
        // very glad all the units' plural forms are just adding an s.
        setStatus(`${result} ${result !== 1 ? interval.unit + 's' : interval.unit} ${diff > 0 ? 'ago' : 'from now'}`);
        // amount of time until next checkin
        
        const checkInMs = (diff % interval.divisor) - 1;
        timeout = setTimeout(refresh, checkInMs);
    };
    
    useEffect(() => {
        refresh();
        return function cleanup() {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, []);
    
    return (
        <p className="howLongAgo">{status}</p>
    );
}

export default HowLongAgo;