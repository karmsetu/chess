'use client';

import React from 'react';
import { ChessBoard } from '../chess_logic/board';
import {
    CheckState,
    Color,
    Coords,
    FENChar,
    LastMove,
    pieceImagePaths,
    SafeSquares,
} from '../chess_logic/models';
import Image from 'next/image';
import { SelectedSquare } from '../chess-board/models';

type BoardState = {
    activeTile: SelectedSquare;
    legalMove: Coords[];
    chessBoardArray: (FENChar | null)[][];
    lastMove: LastMove | undefined;
    checkState: CheckState;
    isPromotionActive: boolean;
    promotionCoords: Coords | null;
    promotedPiece: FENChar | null;
};

export default class ChessBoardComponent extends React.Component<BoardState> {
    private chessBoard = new ChessBoard();
    public chessBoardView: (FENChar | null)[][] =
        this.chessBoard.chessBoardView;
    private lastMove: LastMove | undefined = this.chessBoard.lastMove;
    private checkState: CheckState = this.chessBoard.checkState;
    state: BoardState = {
        activeTile: { piece: null },
        legalMove: [],
        chessBoardArray: this.chessBoardView,
        lastMove: this.lastMove,
        checkState: this.checkState,
        isPromotionActive: false,
        promotionCoords: null,
        promotedPiece: null,
    };

    public get playerColor(): Color {
        return this.chessBoard.playerColor;
    }
    public get safeSquares(): SafeSquares {
        return this.chessBoard.safeSquares;
    }

    private isSquareDark(x: number, y: number): boolean {
        return (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1);
    }

    public promotionPieces(): FENChar[] {
        return this.playerColor === Color.White
            ? [
                  FENChar.WhiteKnight,
                  FENChar.WhiteBishop,
                  FENChar.WhiteRook,
                  FENChar.WhiteQueen,
              ]
            : [
                  FENChar.BlackKnight,
                  FENChar.BlackBishop,
                  FENChar.BlackRook,
                  FENChar.BlackQueen,
              ];
    }

    private selectedSquare: SelectedSquare = { piece: null };
    private pieceSafeSquares: Coords[] = [];

    public isSquareSelected(x: number, y: number): boolean {
        if (!this.state.activeTile.piece) return false;
        const result =
            this.state.activeTile.x === x && this.state.activeTile.y === y;
        // console.log({ result, x, y });

        return result;
    }
    public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
        return this.state.legalMove.some(
            (coords) => coords.x === x && coords.y === y
        );
    }

    public isSquareLastMove(x: number, y: number): boolean {
        if (!this.state.lastMove) return false;
        const { prevX, prevY, currX, currY } = this.state.lastMove;
        return (x === prevX && prevY === y) || (currX === x && currY === y);
    }

    public isSquareChecked(x: number, y: number): boolean {
        return (
            this.state.checkState.isInCheck &&
            this.state.checkState.x === x &&
            this.state.checkState.y === y
        );
    }

    public selectingPiece(x: number, y: number): void {
        const piece: FENChar | null = this.state.chessBoardArray[x][y];
        if (!piece) return;
        if (this.isWrongPieceSelected(piece)) return;
        this.selectedSquare = { piece, x, y };
        this.setState((state) => ({ activeTile: this.selectedSquare }));
        this.chessBoard.findSafeSqures();
        this.pieceSafeSquares =
            this.chessBoard.safeSquares.get(`${x},${y}`) || [];
        this.setState({ legalMove: this.pieceSafeSquares });
        // console.log(`in front`);

        console.log(this.state.activeTile, this.state.legalMove);
    }

    private isWrongPieceSelected(piece: FENChar): boolean {
        const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
        return (
            (isWhitePieceSelected && this.playerColor === Color.Black) ||
            (!isWhitePieceSelected && this.playerColor === Color.White)
        );
    }

    // implementing move
    private placingPiece(newX: number, newY: number): void {
        if (!this.state.activeTile.piece) return;
        if (!this.isSquareSafeForSelectedPiece(newX, newY)) return;

        // handling promotion
        const isPawnSelected: boolean =
            this.state.activeTile.piece === FENChar.WhitePawn ||
            this.state.activeTile.piece === FENChar.BlackPawn;
        const isPawnOnLastRank: boolean =
            isPawnSelected && (newX === 7 || newX === 0);
        const shouldOpenPromotionDialog: boolean =
            !this.state.isPromotionActive && isPawnOnLastRank;
        console.log({ shouldOpenPromotionDialog });

        if (shouldOpenPromotionDialog) {
            this.setState({
                isPromotionActive: true,
                promotionCoords: { x: newX, y: newY },
            });

            return;
        }

        const { x: prevX, y: prevY } = this.state.activeTile;
        this.chessBoard.move(prevX, prevY, newX, newY, null);
        this.chessBoardView = this.chessBoard.chessBoardView;
        // this.state.checkState = this.chessBoard.checkState
        // this.setState({ checkState: this.chessBoard.checkState });
        // console.log(this.chessBoardView, this.state.activeTile);

        this.setState((_) => ({
            chessBoardArray: this.chessBoard.chessBoardView,
            activeTile: { piece: null },
            legalMove: [],
            checkState: this.chessBoard.checkState,
            lastMove: this.chessBoard.lastMove,
        }));
        console.log(this.state.chessBoardArray, this.state.activeTile);
    }

    public move(x: number, y: number) {
        this.selectingPiece(x, y);
        this.placingPiece(x, y);
        // console.log(this.state.chessBoardArray);
    }

    public getStats() {
        console.log(this.state);
    }

    render(): React.ReactNode {
        return (
            <>
                <div className="chess-board border-2 border-red-500 w-fit m-4">
                    {this.chessBoardView.map((row, x) => {
                        return (
                            <div key={x} className={`flex flex-row`}>
                                {row.map((square, y) => {
                                    return (
                                        <div
                                            key={y}
                                            onClick={() => this.move(x, y)}
                                            className={`square 
                                            ${
                                                this.isSquareDark(x, y)
                                                    ? `bg-slate-100`
                                                    : `bg-slate-900`
                                            }
                                            ${
                                                square &&
                                                this.isSquareSafeForSelectedPiece(
                                                    x,
                                                    y
                                                ) &&
                                                `bg-red-500`
                                            }
                                            ${
                                                this.isSquareChecked(x, y) &&
                                                `bg-blue-500`
                                            }
                                            ${
                                                this.isSquareLastMove(x, y) &&
                                                `bg-green-400`
                                            }
                                            $
                                            `}
                                        >
                                            {square && (
                                                <Image
                                                    src={
                                                        pieceImagePaths[square]
                                                    }
                                                    width={40}
                                                    height={40}
                                                    alt="piece"
                                                />
                                            )}
                                            {!square &&
                                                this.isSquareSafeForSelectedPiece(
                                                    x,
                                                    y
                                                ) && (
                                                    <span className="h-2 w-2 bg-white border-2 border-yellow-400 rounded"></span>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <div>
                    {this.state.isPromotionActive && (
                        <>
                            {this.promotionPieces().map((piece, index) => {
                                return (
                                    <span key={index}>
                                        <Image
                                            src={pieceImagePaths[piece]}
                                            alt="promotion choice"
                                            height={40}
                                            width={40}
                                        />
                                    </span>
                                );
                            })}
                            <button>close</button>
                        </>
                    )}
                </div>
                <button onClick={() => this.getStats()}>stat</button>
            </>
        );
    }
}

// export default ChessBoardComponent
