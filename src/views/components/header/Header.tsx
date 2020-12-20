import React, {useState} from 'react';
import './Header.css';
import Menu from './Menu';

function Header(): JSX.Element {
    const [showVerticalMenu, setShowVerticalMenu] = useState<boolean>(false);
    
    return (
        <nav>
            <ul id='horizontal-nav'>
                <li><a href="https://lkellar.org">lkellar.org</a></li>
                <li><a href="https://crimemap.app">Crime Map</a></li>
                <li><a href="../trips/">Trips</a></li>
                <li><a href="https://ftview.lkellar.org">FTView</a></li>
                <li><a href="../about/">About</a></li>
                <li><a href="/changelog/">Changelog</a></li>
                <Menu showVerticalMenu={showVerticalMenu} setShowVerticalMenu={setShowVerticalMenu}/>
            </ul>
            {showVerticalMenu && 
                <ul id='vertical-nav' className='live-vertical'>
                    <li><a href="https://crimemap.app">Crime Map</a></li>
                    <li><a href="../trips/">Trips</a></li>
                    <li><a href="https://ftview.lkellar.org">FTView</a></li>
                    <li><a href="../about/">About</a></li>
                    <li><a href="/changelog/">Changelog</a></li>
                </ul>
            }
        </nav>
    );
}
export default Header;