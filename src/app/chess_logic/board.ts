import { Color, FENChar } from './models';
import { Bishop } from './pieces/Bishop';
import { King } from './pieces/King';
import { Knight } from './pieces/Knight';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/piece';
import { Queen } from './pieces/Queen';
import { Rook } from './pieces/Rook';

export class ChessBoard {
    private chessBoard: (Piece | null)[][];
    private _playerColor = Color.White;
    constructor() {
        this.chessBoard = [
            [
                new Rook(Color.White),
                new Knight(Color.White),
                new Bishop(Color.White),
                new Queen(Color.White),
                new King(Color.White),
                new Bishop(Color.White),
                new Knight(Color.White),
                new Rook(Color.White),
            ], //white pieces
            [
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
                new Pawn(Color.White),
            ], //white pawns

            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null], // empty space

            [
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
                new Pawn(Color.Black),
            ], //Black pawns
            [
                new Rook(Color.Black),
                new Knight(Color.Black),
                new Bishop(Color.Black),
                new Queen(Color.Black),
                new King(Color.Black),
                new Bishop(Color.Black),
                new Knight(Color.Black),
                new Rook(Color.Black),
            ], //Black pieces
        ];
    }

    public get playerColor(): Color {
        return this._playerColor;
    }

    public get chessBoardView(): (FENChar | null)[][] {
        return this.chessBoard.map((row) => {
            return row.map((piece) =>
                piece instanceof Piece ? piece.FENChar : null
            );
        });
    }

    public isSquareDark(x: number, y: number): boolean {
        return (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1);
    }
}
