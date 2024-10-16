import { Chess } from "chess.js";
import { Gamer } from "../types/types";
import { Socket } from "socket.io-client";


export const handleMove = (from: string, to: string, game: Chess, setGame: React.Dispatch<React.SetStateAction<Chess>>, socket: Socket, setCheckMate: React.Dispatch<React.SetStateAction<boolean>>, player: string, gamers: Gamer[]) => {

    if (gamers.some(gamer => gamer.color === game.turn() && gamer.userId === player)) {

        const move = game.move({ from, to });

        if (move) {
            setGame(new Chess(game.fen()));
            socket.emit('movement', { from, to });

            if (game.isGameOver()) {
                socket.emit('checkMate', game.isGameOver());
                setCheckMate(true);
            }
        }

    }

};