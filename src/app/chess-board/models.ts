import { FENChar } from '../chess_logic/models';

type SquareWithPiece = {
    piece: FENChar;
    x: number;
    y: number;
};

type SquareWithoutPiece = {
    piece: null;
};

export type SelectedSquare = SquareWithPiece | SquareWithoutPiece;
