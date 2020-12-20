import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import './App.css';
import HomePage from './views/HomePage';
import Matchmaking from './views/Matchmaking';
import GamePage from './views/GamePage';
import PrivateMatch from './views/PrivateMatch';
import JoinExisting from './views/JoinExisting';

function App(): JSX.Element {
    return (
        <Router>
            <Switch>
                <Route path='/join/:code'>
                    <JoinExisting />
                </Route>
                <Route path='/match/:code'>
                    <GamePage />
                </Route>
                <Route path='/private'>
                    <PrivateMatch />
                </Route>
                <Route path='/matchmaking'>
                    <Matchmaking />
                </Route>
                <Route path='/'>
                    <HomePage />
                </Route>
            </Switch>
        </Router>
    );
}
export default App;
