'use client';

import React from 'react';
import { ChessBoard } from '../chess_logic/board';
import {
    Color,
    Coords,
    FENChar,
    pieceImagePaths,
    SafeSquares,
} from '../chess_logic/models';
import Image from 'next/image';
import { SelectedSquare } from '../chess-board/models';

type BoardState = {
    activeTile: SelectedSquare;
    legalMove: Coords[];
};

export default class ChessBoardComponent extends React.Component<BoardState> {
    state: BoardState = {
        activeTile: { piece: null },
        legalMove: [],
    };

    private chessBoard = new ChessBoard();
    public chessBoardView: (FENChar | null)[][] =
        this.chessBoard.chessBoardView;
    public get playerColor(): Color {
        return this.chessBoard.playerColor;
    }
    public get safeSquares(): SafeSquares {
        return this.chessBoard.safeSquares;
    }

    private isSquareDark(x: number, y: number): boolean {
        return (x % 2 === 0 && y % 2 === 0) || (x % 2 === 1 && y % 2 === 1);
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

    public selectingPiece(x: number, y: number): void {
        const piece: FENChar | null = this.chessBoardView[x][y];
        if (!piece) return;
        if (this.isWrongPieceSelected(piece)) return;
        this.selectedSquare = { piece, x, y };
        this.setState((state) => ({ activeTile: this.selectedSquare }));
        this.chessBoard.findSafeSqures();
        this.pieceSafeSquares =
            this.chessBoard.safeSquares.get(`${x},${y}`) || [];
        this.setState({ legalMove: this.pieceSafeSquares });
        // console.log(`in front`);

        // console.log(this.pieceSafeSquares);
    }

    private isWrongPieceSelected(piece: FENChar): boolean {
        const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
        return (
            (isWhitePieceSelected && this.playerColor === Color.Black) ||
            (!isWhitePieceSelected && this.playerColor === Color.White)
        );
    }

    render(): React.ReactNode {
        return (
            <div className="chess-board border-2 border-red-500 w-fit m-4">
                {this.chessBoardView.map((row, x) => {
                    return (
                        <div key={x} className={`flex flex-row`}>
                            {row.map((square, y) => {
                                return (
                                    <div
                                        key={y}
                                        onClick={() =>
                                            this.selectingPiece(x, y)
                                        }
                                        className={`square 
                                            ${
                                                this.isSquareDark(x, y)
                                                    ? `bg-slate-100`
                                                    : `bg-slate-900`
                                            }
                                            ${
                                                this.isSquareSelected(x, y)
                                                    ? `bg-red-600`
                                                    : ``
                                            }
                                            `}
                                    >
                                        {square && (
                                            <Image
                                                src={pieceImagePaths[square]}
                                                width={40}
                                                height={40}
                                                alt="piece"
                                            />
                                        )}
                                        {this.isSquareSafeForSelectedPiece(
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
        );
    }
}

// export default ChessBoardComponent
