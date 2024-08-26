import {
    CheckState,
    Color,
    Coords,
    FENChar,
    LastMove,
    SafeSquares,
} from './models';
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
    private readonly chessBoardSize: number = 8;
    private _safeSquares: SafeSquares;
    private _lastMove: LastMove | undefined;
    private _checkState: CheckState = { isInCheck: false };

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
        this._safeSquares = this.findSafeSqures();
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

    public get safeSquares(): SafeSquares {
        return this._safeSquares;
    }

    public get lastMove(): LastMove | undefined {
        return this._lastMove;
    }

    public get checkState(): CheckState {
        return this._checkState;
    }

    public isSquareDark(x: number, y: number): boolean {
        return (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1);
    }

    private areCoordsValid(x: number, y: number): boolean {
        return (
            x >= 0 &&
            y >= 0 &&
            x < this.chessBoardSize &&
            y < this.chessBoardSize
        );
    }

    public isInCheck(
        playerColor: Color,
        checkingCurrentPosition: boolean
    ): boolean {
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                //looping throght all 64 squares
                const piece: Piece | null = this.chessBoard[x][y];
                if (!piece || piece.color === playerColor) continue; // if it's empty space then continue
                for (const { x: dx, y: dy } of piece.directions) {
                    //? {x,y}: the legal directions assigned with each piece(ie: Queen, King, Rook...) class
                    let newX: number = x + dx;
                    let newY: number = y + dy;
                    if (!this.areCoordsValid(newX, newY)) continue; // checks wether the pieces are out of boundry

                    /**
                     * ? continue
                     * - this keyword means skip all the content below and bring the next iteration of loop, ie: i++
                     */

                    if (
                        piece instanceof Pawn ||
                        piece instanceof Knight ||
                        piece instanceof King
                    ) {
                        if (piece instanceof Pawn && dy === 0) continue; // if pawn is going vertical then skip all the content below
                        const attackedPiece: Piece | null =
                            this.chessBoard[newX][newY];

                        if (
                            attackedPiece instanceof King &&
                            attackedPiece.color === playerColor // returns true if king of currentPlayerColor is being attacked
                        ) {
                            if (checkingCurrentPosition) {
                                this._checkState = {
                                    isInCheck: true,
                                    x: newX,
                                    y: newY,
                                };
                            }
                            return true;
                        }
                    } else {
                        /* this is because Pawn, Knight& King can only move 1 iteration while Queen, Rook& Bishop can have many iterations,
                        for example: king can only move one tile either diagonally or straight where as Queen may move many tile/square.
                        same with knight, it moves in 'L' shape, but that shape is not iterable
                        */
                        while (this.areCoordsValid(newX, newY)) {
                            const attackedPiece: Piece | null =
                                this.chessBoard[newX][newY];

                            if (
                                attackedPiece instanceof King &&
                                attackedPiece.color === playerColor
                            ) {
                                if (checkingCurrentPosition) {
                                    this._checkState = {
                                        isInCheck: true,
                                        x: newX,
                                        y: newY,
                                    };
                                }
                                return true;
                            }

                            if (attackedPiece !== null) {
                                break;
                            } /* this statement helps avoid killing a piece behind another piece which is illegal move
                            for ex: a rook can capture a piece of other color, and behind that piece there is another pieace, this statement helps prevent capture of that piece
                            */

                            newX += dx;
                            newY += dy;
                        }
                    }
                }
            }
        }
        if (checkingCurrentPosition) this._checkState = { isInCheck: false };
        return false;
    }

    private isPositionSafeAfterMove(
        prevX: number,
        prevY: number,
        newX: number,
        newY: number
    ): boolean {
        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if (!piece) return false;
        const newPiece: Piece | null = this.chessBoard[newX][newY];

        // checks if the piece has value(ie is a piece) and the pieace killed is not the same color as currentPlaye
        if (newPiece && newPiece.color === piece.color) {
            return false;
        }

        // simulate position
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        const isPositionSafe: boolean = !this.isInCheck(piece.color, false);

        this.chessBoard[prevX][prevY] = piece;
        this.chessBoard[newX][newY] = newPiece;

        return isPositionSafe;
    }

    public findSafeSqures(): SafeSquares {
        const safeSqures: SafeSquares = new Map<string, Coords[]>();

        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                //looping throght all 64 squares
                const piece: Piece | null = this.chessBoard[x][y];

                if (!piece || piece.color !== this._playerColor) continue;

                const pieceSafeSquares: Coords[] = [];

                for (const { x: dx, y: dy } of piece.directions) {
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    if (!this.areCoordsValid(newX, newY)) continue;

                    let newPiece: Piece | null = this.chessBoard[newX][newY];
                    if (newPiece && newPiece.color === piece.color) continue;

                    if (piece instanceof Pawn) {
                        if (dx === 2 || dx === -2) {
                            if (newPiece) continue;
                            if (
                                this.chessBoard[newX + (dx === 2 ? -1 : 1)][
                                    newY
                                ]
                            )
                                continue;
                        }

                        if ((dx === 1 || dx === -1) && dy === 0 && newPiece)
                            continue;

                        if (
                            (dy === 1 || dy === -1) &&
                            (!newPiece || piece.color === newPiece.color)
                        )
                            continue;
                    }

                    if (
                        piece instanceof Pawn ||
                        piece instanceof Knight ||
                        piece instanceof King
                    ) {
                        if (this.isPositionSafeAfterMove(x, y, newX, newY))
                            pieceSafeSquares.push({ x: newX, y: newY });
                    } else {
                        while (this.areCoordsValid(newX, newY)) {
                            newPiece = this.chessBoard[newX][newY];
                            if (newPiece && newPiece.color === piece.color)
                                break;

                            if (this.isPositionSafeAfterMove(x, y, newX, newY))
                                pieceSafeSquares.push({ x: newX, y: newY });

                            if (newPiece !== null) break;

                            newX += dx;
                            newY += dy;
                        }
                    }
                }

                if (piece instanceof King) {
                    if (this.canCastle(piece, true))
                        pieceSafeSquares.push({ x, y: 6 });

                    if (this.canCastle(piece, false))
                        pieceSafeSquares.push({ x, y: 2 });
                } else if (
                    piece instanceof Pawn &&
                    this.canCaptureEnPassant(piece, x, y)
                ) {
                    pieceSafeSquares.push({
                        x: x + (piece.color === Color.White ? 1 : -1),
                        y: this._lastMove!.prevY,
                    });
                }

                if (pieceSafeSquares.length) {
                    safeSqures.set(`${x},${y}`, pieceSafeSquares);
                }
            }
        }

        // console.log(safeSqures);

        return safeSqures;
    }

    private canCaptureEnPassant(
        pawn: Pawn,
        pawnX: number,
        pawnY: number
    ): boolean {
        if (!this._lastMove) return false;
        const { currX, currY, piece, prevX, prevY } = this._lastMove;

        if (
            !(piece instanceof Pawn) ||
            pawn.color !== this._playerColor ||
            Math.abs(currX - prevX) !== 2 ||
            pawnX !== currX ||
            Math.abs(pawnY - currY) !== 1
        )
            return false;

        const pawnNewPositionX: number =
            pawnX + (pawn.color === Color.White ? 1 : -1);
        const pawnNewPositionY: number = currY;

        this.chessBoard[currX][currY] = null;
        const isPositionSafe: boolean = this.isPositionSafeAfterMove(
            pawnX,
            pawnY,
            pawnNewPositionX,
            pawnNewPositionY
        );
        this.chessBoard[currX][currY] = piece;

        return isPositionSafe;
    }

    private canCastle(king: King, kingSideCastle: boolean): boolean {
        if (king.hasMoved) return false;

        const kingPositionX: number = king.color === Color.White ? 0 : 7;
        const kingPositionY: number = 4;
        const rookPositionX: number = kingPositionX;
        const rookPositionY: number = kingSideCastle ? 7 : 0;
        const rook: Piece | null =
            this.chessBoard[rookPositionX][rookPositionY];

        if (
            !(rook instanceof Rook) ||
            rook.hasMoved ||
            this._checkState.isInCheck
        )
            return false;

        const firstNextKingPositionY: number =
            kingPositionY + (kingSideCastle ? 1 : -1);
        const secondNextKingPositionY: number =
            kingPositionY + (kingSideCastle ? 2 : -2);

        if (
            this.chessBoard[kingPositionX][firstNextKingPositionY] ||
            this.chessBoard[kingPositionX][secondNextKingPositionY]
        )
            return false;

        if (!kingSideCastle && this.chessBoard[kingPositionX][1]) return false;

        return (
            this.isPositionSafeAfterMove(
                kingPositionX,
                kingPositionY,
                kingPositionX,
                firstNextKingPositionY
            ) &&
            this.isPositionSafeAfterMove(
                kingPositionX,
                kingPositionY,
                kingPositionX,
                secondNextKingPositionY
            )
        );
    }

    public move(
        prevX: number,
        prevY: number,
        newX: number,
        newY: number,
        promotedPieceType: FENChar | null
    ): void {
        console.log(`called`);
        console.log(this.chessBoard);

        if (
            !this.areCoordsValid(prevX, prevY) ||
            !this.areCoordsValid(newX, newY)
        )
            return;
        console.log(`what`);

        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if (!piece || piece.color !== this.playerColor) return;
        const pieceSafeSquares = this.safeSquares.get(`${prevX},${prevY}`);
        console.log({ piece, pieceSafeSquares });

        if (
            !pieceSafeSquares ||
            !pieceSafeSquares.find(
                (coords) => coords.x === newX && coords.y === newY
            )
        )
            throw new Error(`Square is not safe`);

        // removing _hasMoved property
        console.log(`moving`);

        if (
            (piece instanceof Pawn ||
                piece instanceof King ||
                piece instanceof Rook) &&
            !piece.hasMoved
        )
            piece.hasMoved = true;

        this.handlingSpecialMoves(piece, prevX, prevY, newX, newY);

        // updating the board
        // console.log({ prevX, prevY, newX, newY });

        if (promotedPieceType) {
            this.chessBoard[newX][newY] = this.promotedPiece(promotedPieceType);
        } else {
            this.chessBoard[newX][newY] = piece;
        }

        this.chessBoard[prevX][prevY] = null;

        this._lastMove = {
            prevX,
            prevY,
            currX: newX,
            currY: newY,
            piece,
        };
        this._playerColor =
            this._playerColor === Color.White ? Color.Black : Color.White;
        this.isInCheck(this._playerColor, true);
        this._safeSquares = this.findSafeSqures();
        // console.log(this.chessBoard, this._playerColor);
    }

    private handlingSpecialMoves(
        piece: Piece,
        prevX: number,
        prevY: number,
        newX: number,
        newY: number
    ): void {
        if (piece instanceof King && Math.abs(newY - prevY) === 2) {
            // newY > prevY  === king side castle

            const rookPositionX: number = prevX;
            const rookPositionY: number = newY > prevY ? 7 : 0;
            const rook = this.chessBoard[rookPositionX][rookPositionY] as Rook;
            const rookNewPositionY: number = newY > prevY ? 5 : 3;
            this.chessBoard[rookPositionX][rookPositionY] = null;
            this.chessBoard[rookPositionX][rookNewPositionY] = rook;
            rook.hasMoved = true;
        } else if (
            piece instanceof Pawn &&
            this._lastMove &&
            this._lastMove.piece instanceof Pawn &&
            Math.abs(this._lastMove.currX - this._lastMove.prevX) === 2 &&
            prevX === this._lastMove.currX &&
            newY === this._lastMove.currY
        ) {
            console.log(`lastMove:`, this._lastMove);

            this.chessBoard[this._lastMove.currX][this._lastMove.currY] = null;
        }
    }

    private promotedPiece(
        promotedPiece: FENChar
    ): Knight | Bishop | Rook | Queen {
        if (
            promotedPiece === FENChar.WhiteKnight ||
            promotedPiece === FENChar.BlackKnight
        )
            return new Knight(this._playerColor);

        if (
            promotedPiece === FENChar.WhiteBishop ||
            promotedPiece === FENChar.BlackBishop
        )
            return new Bishop(this._playerColor);

        if (
            promotedPiece === FENChar.WhiteRook ||
            promotedPiece === FENChar.BlackRook
        )
            return new Rook(this._playerColor);

        return new Queen(this._playerColor);
    }
}
