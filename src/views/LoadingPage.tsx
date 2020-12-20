import React, {MouseEvent} from 'react';
import './Matchmaking.css';
import Header from './components/header/Header';
import BlankBoard from '../img/blankBoard.svg';
import {Link} from 'react-router-dom';
import Share from './components/Share.svg';
import Footer from './components/Footer';

function LoadingPage(props: {clickHandler: (_event: MouseEvent<HTMLAnchorElement>) => void, status: string, code: string | undefined, header: string}): JSX.Element {
    let nav: any;
    
    nav = window.navigator;
    return (
        <div>
            <Header />
            <main id="matchmakingmain">
                {/* using a <a> here instead of <link> so the websocket is dropped and the player is removed from matchmaking */}
                <Link className="hiddenLink" to='/' onClick={props.clickHandler}><h1>Ultimate Tic Tac Toe</h1></Link>
                <p>{props.header}</p>
                <img className="rotate-center" id="blankboard" src={BlankBoard} alt="Blank Ultimate Tic Tac Toe Board" />
                <span id="matchmakingfooter">
                    <h3>{props.status}</h3>
                    {(!!nav.share && !!props.code) &&
                        <img src={Share} onClick={() => {
                            try {
                                nav.share({
                                    title: 'Join Ultimate Tic Tac Toe',
                                    url: `${process.env.REACT_APP_UTTT_FRONTEND_BASE_URL}/join/${props.code}`});
                            } catch {
                                console.error('shraing failed');
                            }
                        }} />
                    }
                </span>
            </main>     
            <Footer /> 
        </div>
    );
}

export default LoadingPage;