'use client';

import { SelectedSquare } from '@/app/chess-board/models';
import { ChessBoard } from '@/app/chess_logic/board';
import { Color, Coords, FENChar } from '@/app/chess_logic/models';
import { ReactNode, useState } from 'react';

const Tile = ({
    children,
    tileColor,
    coords,
    selectingPiece,
    selectedTile,
}: {
    children: ReactNode;
    tileColor: boolean;
    coords: Coords;
    selectingPiece: (x: number, y: number) => void;
    selectedTile: Coords | null;
}) => {
    console.log({ selectedTile });
    return (
        <div
            className={`square 
                        ${tileColor ? `bg-slate-500` : `bg-slate-100`}
                        ${
                            selectedTile?.x === coords.x &&
                            selectedTile.y === coords.y &&
                            `bg-red-500`
                        }
                        `}
            onClick={() => selectingPiece(coords.x, coords.y)}
        >
            {children}
        </div>
    );
};

export default Tile;
