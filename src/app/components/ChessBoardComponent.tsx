import Image from 'next/image';
import { ChessBoard } from '../chess_logic/board';
import { Color, FENChar, pieceImagePaths } from '../chess_logic/models';

const ChessBoardComponent = () => {
    const chessBoard = new ChessBoard();
    const chessBoardView: (FENChar | null)[][] = chessBoard.chessBoardView;
    const playerColor: Color = chessBoard.playerColor;
    return (
        <section className="flex flex-col-reverse">
            {chessBoardView.map((row, x) => {
                // let x: number;
                let y: number;
                return (
                    <div key={x} className="flex flex-row ">
                        {row.map((square, y) => {
                            return (
                                <div
                                    className={`square ${
                                        chessBoard.isSquareDark(x, y)
                                            ? `bg-slate-500`
                                            : `bg-slate-100`
                                    }`}
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
                            {
                                /* square */
                            }
                        })}
                    </div>
                );
                {
                    /* row} */
                }
            })}
            <div id="chess-board"></div>
        </section>
    );
};

export default ChessBoardComponent;
