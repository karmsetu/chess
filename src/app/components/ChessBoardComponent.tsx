'use client';

import Image from 'next/image';
import { ChessBoard } from '../chess_logic/board';
import { Color, Coords, FENChar, pieceImagePaths } from '../chess_logic/models';
import { SelectedSquare } from '../chess-board/models';
import Tile from './ui/Tile';
import { useState } from 'react';

const ChessBoardComponent = () => {
    const [selectedTile, setSelectedTile] = useState<Coords | null>(null);
    // const [safeSquares, setSafeSquares] = useState<Coords[] | null>();
    const chessBoard = new ChessBoard();
    const chessBoardView: (FENChar | null)[][] = chessBoard.chessBoardView;
    const playerColor: Color = chessBoard.playerColor;
    let selectedSquare: SelectedSquare = { piece: null };
    let pieceSafeSquares: Coords[] = [];

    const selectingPiece = (x: number, y: number) => {
        const piece: FENChar | null = chessBoardView[x][y];
        if (!piece) return;
        selectedSquare = { piece, x, y };
        pieceSafeSquares = chessBoard.safeSquares.get(`${x},${y}`) || [];
        setSelectedTile({ x, y });
    };

    const isSquareSelected = (x: number, y: number): boolean => {
        if (!selectedSquare.piece) return false;
        return selectedSquare.x === x && selectedSquare.y === y;
    };

    const isSquareSafeForSelectedPiece = (x: number, y: number): boolean => {
        return pieceSafeSquares.some(
            (coords) => coords.x === x && coords.y === y
        );
    };

    return (
        <section className="flex flex-col-reverse">
            {chessBoardView.map((row, x) => {
                return (
                    <div key={x} className="flex flex-row ">
                        {row.map((square, y) => {
                            return (
                                <Tile
                                    key={y}
                                    tileColor={chessBoard.isSquareDark(x, y)}
                                    coords={{ x, y }}
                                    selectingPiece={selectingPiece}
                                    selectedTile={selectedTile}
                                >
                                    {square && (
                                        <Image
                                            src={pieceImagePaths[square]}
                                            alt="piece"
                                            width={40}
                                            height={40}
                                            // onClick={() => selectingPiece(x, y)}
                                        />
                                    )}
                                </Tile>
                            );
                        })}
                    </div>
                );
            })}
            <div id="chess-board"></div>
        </section>
    );
};

/*

const Tile = ({
    chessBoard,
    x,
    y,
    square,
}: {
    chessBoard: ChessBoard;
    x: number;
    y: number;
    square: FENChar | null;
}) => {
    return (
        <div
            // onClick={selectingPiece(x,y)}
            className={`square 
                                        ${
                                            chessBoard.isSquareDark(x, y)
                                                ? `bg-slate-500`
                                                : `bg-slate-100`
                                            }
                                        `}
            key={y}
        >
            {square && (
                <Image
                    src={pieceImagePaths[square]}
                    alt="piece"
                    width={40}
                    height={40}
                />
            )}
        </div>
    );
};

*/
export default ChessBoardComponent;
