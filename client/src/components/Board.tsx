import { Chess, Square as ChessSquare } from "chess.js";
import Square from "./Square";
import { io } from 'socket.io-client';
import { useEffect, useState } from "react";
import Link from "./Link";

const socket = io('http://localhost:4000');

interface BoardProps {
    game: Chess;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
}

interface Gamer {
    userId: string;
    color: 'w' | 'b';
}

const Board = ({ game, setGame }: BoardProps) => {
    const [players, setPlayers] = useState(1);
    const [gamers, setGamers] = useState<Gamer[]>([]);
    const [player, setPlayer] = useState('');
    const [checkMate, setCheckMate] = useState(false);

    const currentGamer = gamers.find(gamer => gamer.userId === player);
    const turn = currentGamer ? currentGamer.color === game.turn() : false;

    useEffect(() => {

        const url = new URLSearchParams(window.location.search);
        let roomId = url.get('roomId');

        if (!roomId) {
            roomId = prompt('Ingrese el nombre de la sala:');
            if (roomId) {
                window.location.search = `roomId=${roomId}`;
            }
        }

        if (roomId) {

            socket.emit('joinGame', roomId);

            socket.on('playerCount', (numberOfClients: number) => {
                setPlayers(numberOfClients);
            })

            socket.on('namePlayers', ({ roomPlayers }: { roomPlayers: { userId: string, color: string }[] }) => {
                console.log(roomPlayers);

                setGamers(roomPlayers.map(player => ({
                    userId: player.userId,
                    color: player.color as 'w' | 'b'
                })));
            })

            socket.on('player', (playerId: string) => {
                setPlayer(playerId);
            })

            socket.on('movement', ({ from, to }: { from: string, to: string }) => {
                console.log(from, to);

                const move = game.move({ from, to });

                console.log(move);


                if (move) {
                    setGame(new Chess(game.fen()));
                }
            });

            socket.on('resetGame', () => {
                setGame(new Chess());
                setCheckMate(false);
            });

        }

        return () => {
            socket.off('playerCount');
            socket.off('namePlayers');
            socket.off('player');
            socket.off('movement');
            socket.off('resetGame');
        }
    }, [game, setGame]);

    const handleMove = (from: string, to: string) => {

        if (gamers.some(gamer => gamer.color === game.turn() && gamer.userId === player)) {

            const move = game.move({ from, to });

            if (move) {
                setGame(new Chess(game.fen()));
                socket.emit('movement', { from, to });

                if(game.isGameOver()){
                    setCheckMate(true);
                }
            }

        }

    }

    const resetGame = () => {
        socket.emit('resetGame');
    }

    const renderSquare = (i: number, rank: number) => {

        const col = 'abcdefgh'[i];
        const row = (8 - rank).toString();
        const position = `${col}${row}` as ChessSquare;
        const piece = game.get(position);

        return (
            <Square
                key={position}
                column={col}
                row={row}
                position={position}
                piece={piece}
                onMove={handleMove}
            />
        )
    }

    const renderBoard = () => {
        const squares = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                squares.push(renderSquare(j, i));
            }
        }
        return squares;
    }


    return (
        <>
            {players === 1 ? (
                <Link />
            ) : (
                <div className="main">
                    <div className="board">
                        {renderBoard()}
                        {checkMate && (
                            <div className="check">
                                <p>{checkMate ? "JAQUE MATE" : ""}</p>
                                <button onClick={() => resetGame()}>New Game</button>
                            </div>
                        )}
                    </div>
                    <div className="turn">
                        <p className={currentGamer?.color === 'w' ? 'white size' : 'black size'}>{currentGamer ? (currentGamer.color === 'w' ? '♜' : '♜') : 'Spectator'}</p>
                        <p className={currentGamer?.color === 'w' ? 'white' : 'black'}>{turn ? "It's your turn" : "Turn of the opponent"}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Board;