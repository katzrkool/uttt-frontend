import Square from './Square';
import LocalBoard from './LocalBoard';

interface WinStatus {
    winChar: Square;
    status: LocalBoard;
}

export default WinStatus;