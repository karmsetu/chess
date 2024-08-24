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

export default class ChessBoardComponent extends React.Component {
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
        if (!this.selectedSquare.piece) return false;
        return this.selectedSquare.x === x && this.selectedSquare.y === y;
    }
    public isSquareSafeForSelectedPiece(x: number, y: number): boolean {
        return this.pieceSafeSquares.some(
            (coords) => coords.x === x && coords.y
        );
    }

    public selectingPiece(x: number, y: number): void {
        const piece: FENChar | null = this.chessBoardView[x][y];
        if (!piece) return;
        this.selectedSquare = { piece, x, y };
        this.chessBoard.findSafeSqures();
        this.pieceSafeSquares =
            this.chessBoard.safeSquares.get(`${x},${y}`) || [];
        console.log(`in front`);

        console.log(this.selectedSquare, this.pieceSafeSquares);
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
                                                this.isSquareSelected(x, y) ??
                                                `bg-red-600`
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
