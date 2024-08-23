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
    const [validation, setValidation] = useState<boolean>();
    const [movements, setMovements] = useState<number>(0);
    const [gamersFlag, setGamersFlag] = useState<boolean>(false);

    console.log(movements);
    console.log(validation);
    console.log(gamers);
    console.log(player);




    var turn = gamers.some(gamer => gamer.userId === player && gamer.color === 'w');

    useEffect(() => {
        setGamersFlag(true);
    }, [gamers])


    useEffect(() => {

        if (movements === 0 && gamersFlag) {
            let check = gamers.some(gamer => gamer.userId === player && gamer.color === 'w');

            setValidation(check);
            debugger;
        } else if (movements > 0 && gamersFlag) {
            setValidation(prevValidation => !prevValidation);
            debugger;

        }
    }, [gamers, player, movements]);



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

            debugger;

            socket.on('playerCount', (numberOfClients: number) => {
                setPlayers(numberOfClients);
            })

            socket.on('namePlayers', ({ roomPlayers }: { roomPlayers: { userId: string, color: string }[] }) => {

                setGamers((prevPlayers) => {

                    if (prevPlayers.length === 0) {
                        roomPlayers.forEach((player) => {
                            prevPlayers.push({ userId: player.userId, color: player.color });
                        })
                    }

                    return prevPlayers;
                });

            })

            socket.on('player', player => {
                setPlayer(player);
            })

            socket.on('movement', ({ from, to, movements }: { from: string, to: string, movements: number }) => {

                const move = game.move({ from, to });

                if (move) {
                    setGame(new Chess(game.fen()));
                    setMovements(movements);
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

            let roomId;

            const url = new URLSearchParams(window.location.search);

            roomId = url.get('roomId');

            const move = game.move({ from, to });

            if (move) {
                
                socket.emit('movement', { from, to, movements: movements + 1 });
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
            {players === 1 ? (<Link />) : (<div className="main"><div className="board">{renderBoard()}</div><div className="turn"><p>You are {turn ? 'White' : 'Black'} </p><p>{validation ? ' It´s your turn' : ' Turn of the opponent'}</p>
            </div></div>)}
        </>
    )
}

export default Board;