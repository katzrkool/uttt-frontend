import React from 'react';

import Words from '../../words.json';

const wordFormat = /^[a-zA-Z]+-[a-zA-Z]+$/;

function CodeInput(props: {code: string, setCode: React.Dispatch<React.SetStateAction<string>>, valid: boolean, setValid: React.Dispatch<React.SetStateAction<boolean>>}): JSX.Element {
    return (
        <input type="text" value={props.code} className={props.code.length > 0 ? props.valid ? 'greenHighlight' : 'redHighlight' : ''} onChange={((event) => {
            try {
                let code = event?.currentTarget.value;
                if (!code) {
                    props.setValid(false);
                }
                code = code.toLowerCase();
                code = code.replace(/ /g, '-');
                props.setCode(code);
                if (!wordFormat.test(code)) {
                    props.setValid(false);
                    return;
                }
                const [word1, word2] = code.split('-');
                if (!Words.includes(word1) || !Words.includes(word2)) {
                    props.setValid(false);
                    return;
                }
                props.setValid(true);
            } catch (e) {
                props.setValid(false);
                props.setCode(event?.currentTarget.value);
            }
        })}/>
    );
}

export default CodeInput;