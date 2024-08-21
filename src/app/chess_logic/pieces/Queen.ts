import { FENChar, Coords, Color } from '../models';
import { Piece } from './piece';

export class Queen extends Piece {
    protected _FENChar: FENChar;
    protected _directions: Coords[] = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
    ];

    constructor(private pieceColor: Color) {
        super(pieceColor);
        this._FENChar =
            pieceColor === Color.White
                ? FENChar.WhiteQueen
                : FENChar.BlackQueen;
    }
}
