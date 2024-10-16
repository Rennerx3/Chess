import { Square as ChessSquare } from "chess.js";
import  Square from './Square';
import { RenderSquareProps } from "../types/types";

export const renderSquare = ({ i, j, game, setGame, socket, setCheckMate, player, gamers }: RenderSquareProps) => {

    const col = 'abcdefgh'[j];
    const row = (8 - i).toString();
    const position = `${col}${row}` as ChessSquare;
    const piece = game.get(position);

    return (
        <Square
            key={position}
            column={col}
            row={row}
            position={position}
            piece={piece}
            game={game}
            setGame={setGame}
            socket={socket}
            setCheckMate={setCheckMate}
            player={player}
            gamers={gamers}
        />
    )
}