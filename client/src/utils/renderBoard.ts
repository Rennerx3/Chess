import { Chess } from "chess.js";
import { renderSquare } from "../components/RenderSquare";
import { Socket } from "socket.io-client";
import { Gamer } from "../types/types";

export const renderBoard = (game: Chess, setGame: React.Dispatch<React.SetStateAction<Chess>>, socket: Socket, setCheckMate: React.Dispatch<React.SetStateAction<boolean>>, player: string, gamers: Gamer[]) => {
    const squares = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            squares.push(renderSquare({i, j, game, setGame, socket, setCheckMate, player, gamers}));
        }
    }
    return squares;
}