import {randomBytes} from 'crypto';
import SockJS from 'sockjs-client';
import GlobalBoard from './interfaces/GlobalBoard';
import WinStatus from './interfaces/WinStatus';
import Position from './interfaces/Position';
import ConnectionStatus from './interfaces/ConnectionStatus';
import {sendNotification} from './util';
import Square from './interfaces/Square';

class GameManager {
    sock: WebSocket;
    url: string;
    // keep track of how many restarts
    sockIteration: number;
    msgCallbacks: Record<string, Record<string, unknown>> = {};
    // Used to set the most recent matchStartedMessage
    matchStartedMessage: Record<string, Record<string, unknown>> = {};
    // Used to set the most recent moveUpdates
    moveUpdates: Record<string, Record<string, unknown>> = {};
    setConnection: React.Dispatch<React.SetStateAction<ConnectionStatus>> | undefined;
    constructor() {
        const url = process.env.REACT_APP_UTTT_BACKEND_URL;
        if (!url) {
            throw new Error('No backend URL found');
        }
        this.url = url;
        this.sockIteration = -1;
        this.sock = this.setupSock();
    }
    
    generateMsgID(): string {
        return randomBytes(20).toString('hex');
    }
    
    setSetConnection(setConnection: React.Dispatch<React.SetStateAction<ConnectionStatus>>): void {
        this.setConnection = setConnection;
    }
    unsetSetConnection(): void {
        this.setConnection = undefined;
    }
    
    fetchUserID(code: string): string | undefined {
        const storageResp = localStorage.getItem(code);
        if (storageResp === null) {
            return undefined;
        } else {
            if (JSON.parse(storageResp).userID.length === 0) {
                return undefined;
            }
            return JSON.parse(storageResp).userID;
        }
    }
    
    async sendMessage(data: Record<string, unknown>): Promise<Record<string, unknown>> {
        const msgID = this.generateMsgID();
        data.msgID = msgID;
        
        await this.waitForSock();
        this.sock.send(JSON.stringify(data));
        return await this.waitForResponse(msgID);
    }
    
    async stopMatchmaking(code: string): Promise<Record<string, unknown>> {
        const userID = this.fetchUserID(code);
        return await this.sendMessage({
            code,
            userID,
            action: 'stopMatchmake'
        });
    }
    
    async joinMatch(code: string, name: string): Promise<Record<string, unknown> | undefined> {
        const resp = await this.sendMessage({
            code,
            name,
            action: 'joinMatch'
        });
        if (resp.error) {
            alert(`Error joining match ${code}: ${resp.message}`);
            return undefined;
        }
        if (!resp.found) {
            console.error(`Error on joinMatch: Match ${code} not found`);
            return undefined;
        }
        localStorage.setItem(code, JSON.stringify({
            userID: resp.userID as string,
            lastVisited: Date.now()
        }));
        return resp;
    }
    
    setupSock(): WebSocket {
        const sock = new SockJS(this.url);
        sock.onopen = () => {
            if (this.setConnection) {
                this.setConnection(ConnectionStatus.connected);
            }  
        };
        sock.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.msgType === 'matchStarted') {
                this.matchStartedMessage[data.code] = data;
            } else if (data.msgType === 'moveUpdate') {
                this.moveUpdates[data.code] = data;  
            } else {
                this.msgCallbacks[data.msgID] = data;
            }
        };
        sock.onclose = (event) => {
            if (event.code === 1002) {
                console.error(`Websocket error observed: ${JSON.stringify(event)}`);
                alert(`Websocket error observed: ${event.reason}`);
            } else if (!event.wasClean) {
                console.error(`Unexpected disconnect from server: ${JSON.stringify(event)}`);
                alert(`Unexpected disconnect from server ${event.reason}`);
            }
            if (this.setConnection) {
                this.setConnection(ConnectionStatus.disconnected);
            }
        };
        this.sockIteration += 1;
        return sock;
    }
    
    async waitForSock() {
        // If socket is closed
        if (this.sock.readyState > 1) {
            this.sock = this.setupSock();
            
            if (this.setConnection) {
                this.setConnection(ConnectionStatus.connecting);
            }
        }
        while (this.sock.readyState === 0) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        if (this.setConnection) {
            if (this.sock.readyState === 1) {
                this.setConnection(ConnectionStatus.connected);
            } else {
                this.setConnection(ConnectionStatus.disconnected);
            }
        }
    }
    
    async waitForResponse(msgID: string): Promise<Record<string, unknown>> {
        const startingIteration = this.sockIteration;
        let iterations = 0;
        while (this.msgCallbacks[msgID] === undefined && this.sockIteration === startingIteration && iterations < 400) {
            await new Promise(resolve => setTimeout(resolve, 50));
            iterations += 1;
        }
        if (this.sockIteration !== startingIteration || iterations >= 400) {
            console.error(`Resp with ${msgID} was lost due to server disconnection`);
            return {};
        }
        const resp = this.msgCallbacks[msgID];
        delete this.msgCallbacks[msgID];
        if (resp.error) {
            console.error(`Error on wait for resp w/ ${msgID}: ${resp.message}`);
            return {};
        }
        return resp;
    }
    
    async createPrivateMatch(name: string, visible = true): Promise<{code: string, userID: string}> {
        const resp = await this.sendMessage({
            action: 'createPrivate',
            name,
            visible
        });
        if (!resp.code) {
            console.error('Error on createPrivate: No code returned.');
        }
        localStorage.setItem(resp.code as string, JSON.stringify({
            userID: resp.userID as string | undefined ?? '',
            lastVisited: Date.now()
        }));
        return {
            code: resp.code as string,
            userID: resp.userID as string
        };
    }
    
    async matchmake(name: string): Promise<{
        userID: string,
        code: string
    }> {
        
        const resp = await this.sendMessage({
            action: 'matchmake',
            name
        });
        if (!resp.code) {
            console.error('Error on matchmake: No code returned.');
        }
        localStorage.setItem(resp.code as string, JSON.stringify({
            userID: resp.userID as string,
            lastVisited: Date.now()
        }));
        return {
            code: resp.code as string | undefined ?? '',
            userID: resp.userID as string,
        };
    }
    
    async waitForMatchStarted(code: string): Promise<{
        spectator: boolean,
        resp: Record<string, unknown>
    }> {
        while (this.matchStartedMessage[code] === undefined) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        const resp = this.matchStartedMessage[code];
        if (resp.error) {
            console.error(`Error on waitForMatchStarted: ${resp.message}`);
        }
        sendNotification(`Match ${code} has begun`);
        // If we are a player in the match, gameConfig is present
        if (Object.keys(resp).includes('gameConfig')) {
            return {
                spectator: false,
                resp
            };
        }
        localStorage.setItem(resp.code as string, JSON.stringify({
            userID: resp.userID as string | undefined ?? (this.fetchUserID(code) ?? ''),
            lastVisited: Date.now()
        }));
        return {
            spectator: true,
            resp
        };
    }
    
    async watchMatchChanges(code: string, setWinStatus: React.Dispatch<React.SetStateAction<WinStatus>>, setGameEnd: React.Dispatch<React.SetStateAction<number>>, setBoard?:  React.Dispatch<React.SetStateAction<GlobalBoard>>) {
        let matchOver = false;
        let lastNotification = 0;
        let oldMatchChange = JSON.stringify(this.moveUpdates[code]);
        while (!matchOver) {
            if (oldMatchChange !== JSON.stringify(this.moveUpdates[code])) {
                oldMatchChange = JSON.stringify(this.moveUpdates[code]);
                
                if (setBoard) {
                    setBoard(this.moveUpdates[code].board as GlobalBoard);
                }
                
                setWinStatus(this.moveUpdates[code].winStatus as WinStatus);
                setGameEnd(this.moveUpdates[code].gameEnd as number);
                
                const winChar = (this.moveUpdates[code].winStatus as WinStatus).winChar;
                
                matchOver = winChar !== '';
                if (matchOver) {
                    if (winChar === Square.Tie) {
                        sendNotification(`Match ${code} is over. It's all tied up!`);
                    } else {
                        sendNotification(`Match ${code} is over. ${winChar} won!`);
                    }
                } else {
                    if (Date.now() - lastNotification > 500) {
                        sendNotification(`Match ${code} just updated.`);
                        lastNotification = Date.now();
                    }
                }
                this.updateLocalStorage(code);
            }
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    
    async checkStatus(code: string, subscribe: boolean, userID?: string | undefined): Promise<Record<string, unknown>> {
        const resp =  await this.sendMessage({
            action: subscribe ? 'subscribe': 'checkStatus',
            code,
            userID
        });
        
        // If not found, remove from localstorage, so it doesn't show up in recent matches
        if (!resp.found) {
            localStorage.removeItem(code);
            return resp;
        }
        
        // if someone is actually on the page, then update local storage
        if (subscribe) {
            this.updateLocalStorage(code);
        }
        
        return resp;
    }
    
    updateLocalStorage(code: string): void {
        localStorage.setItem(code, JSON.stringify({
            userID: this.fetchUserID(code) ?? '',
            lastVisited: Date.now()
        }));
    }
    
    async makeMove(code: string, boardPosition: Position, squarePosition: Position): Promise<Record<string, unknown>> {
        const resp =  await this.sendMessage({
            action: 'makeMove',
            code,
            userID: this.fetchUserID(code),
            board: boardPosition,
            square: squarePosition
        });
        
        this.updateLocalStorage(code);
        
        return resp;
    }
}

const gameManager = new GameManager();

export default gameManager;
