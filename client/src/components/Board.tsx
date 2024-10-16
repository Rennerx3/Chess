import { io } from 'socket.io-client';
import { useState } from "react";
import Link from "./Link";
import { BoardProps, Gamer } from "../types/types";
import { Turn } from "./Turn";
import { Check } from "./Check";
import { renderBoard } from "../utils/renderBoard";
import { resetGame } from "../utils/resetGame";
import { handleSockets } from "../utils/handleSockets";

const socket = io('http://localhost:4000');

const Board = ({ game, setGame }: BoardProps) => {
    const [players, setPlayers] = useState(1);
    const [gamers, setGamers] = useState<Gamer[]>([]);
    const [player, setPlayer] = useState('');
    const [checkMate, setCheckMate] = useState(false);

    const currentGamer = gamers.find(gamer => gamer.userId === player);
    const turn = currentGamer ? currentGamer.color === game.turn() : false;

    handleSockets({socket, setPlayers, setPlayer, setGamers, game, setGame, setCheckMate});

    return (
        <>
            {players === 1 ? (
                <Link />
            ) : (
                <div className="main">
                    <div className="board">
                        {renderBoard(game, setGame, socket, setCheckMate, player,gamers)}
                        {checkMate && (
                            <Check turn={turn} resetGame={() => resetGame(socket)} />
                        )}
                    </div>
                    {!checkMate && (<Turn currentGamer={currentGamer} turn={turn} />)}
                </div>
            )}
        </>
    )
}

export default Board;