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
    color: string;
}

const Board = ({ game, setGame }: BoardProps) => {
    const [players, setPlayers] = useState(1);
    const [gamers, setGamers] = useState<Gamer[]>([]);
    const [player, setPlayer] = useState('');

    console.log(gamers);
    

    useEffect(() => {

        let roomId;

        const url = new URLSearchParams(window.location.search);

        roomId = url.get('roomId');

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

            socket.on('namePlayers', ({roomPlayers}: {roomPlayers: {userId: string, color: string}[]}) => {
                
                setGamers((prevPlayers) => {
                    
                    if(prevPlayers.length === 0){
                        roomPlayers.forEach((player) => {
                            prevPlayers.push({userId: player.userId, color: player.color});
                        })
                    }

                    return prevPlayers;
                });

            })

            socket.on('player', player => {
                setPlayer(player);
            })

            socket.on('movement', ({ from, to }: { from: string, to: string }) => {

                const move = game.move({ from, to });

                if (move) {
                    setGame(new Chess(game.fen()));
                }
            })

        }


        return () => {
            socket.off('movement');
            socket.off('playerCount');
            socket.off('namePlayers');
            socket.off('player');
        }
    }, []);


    const handleMove = (from: string, to: string) => {

        if (gamers.some(gamer => gamer.color === game.turn() && gamer.userId === player)) {

            const move = game.move({ from, to });

            if (move) {
                socket.emit('movement', { from, to });
                setGame(new Chess(game.fen()));
            }

        }

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
            {players === 1 ? (<Link />) : (<div className="board">{renderBoard()}</div>)}
        </>
    )
}

export default Board;