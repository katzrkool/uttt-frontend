import Square from './interfaces/Square';
import GlobalBoard from './interfaces/GlobalBoard';
import LocalBoard from './interfaces/LocalBoard';
import Position from './interfaces/Position';

const sampleLocalBoard: LocalBoard = {
    topLeft: Square.X,
    topCenter: Square.O,
    topRight: Square.Empty,
    centerLeft: Square.O,
    centerCenter: Square.Empty,
    centerRight: Square.X,
    bottomLeft: Square.Empty,
    bottomCenter: Square.X,
    bottomRight: Square.Empty
};

const sampleBoard: GlobalBoard = {
    topLeft: {...sampleLocalBoard},
    topCenter: {...sampleLocalBoard},
    topRight: {...sampleLocalBoard},
    centerLeft: {...sampleLocalBoard},
    centerCenter: {...sampleLocalBoard},
    centerRight: {...sampleLocalBoard},
    bottomLeft: {...sampleLocalBoard},
    bottomCenter: {...sampleLocalBoard},
    bottomRight: {...sampleLocalBoard},
    xTurn: true,
    activeBoard: Position.topLeft
};

const emptyLocalBoard: LocalBoard = {
    topLeft: Square.Empty,
    topCenter: Square.Empty,
    topRight: Square.Empty,
    centerLeft: Square.Empty,
    centerCenter: Square.Empty,
    centerRight: Square.Empty,
    bottomLeft: Square.Empty,
    bottomCenter: Square.Empty,
    bottomRight: Square.Empty
};

const emptyBoard: GlobalBoard = {
    topLeft: {...emptyLocalBoard},
    topCenter: {...emptyLocalBoard},
    topRight: {...emptyLocalBoard},
    centerLeft: {...emptyLocalBoard},
    centerCenter: {...emptyLocalBoard},
    centerRight: {...emptyLocalBoard},
    bottomLeft: {...emptyLocalBoard},
    bottomCenter: {...emptyLocalBoard},
    bottomRight: {...emptyLocalBoard},
    xTurn: true,
    activeBoard: Position.any
};

export {emptyBoard, emptyLocalBoard, sampleBoard};
