import { useEffect } from "react";
import { Chess } from "chess.js";
import { SocketHandlers } from "../types/types";

export const handleSockets = ({socket, setPlayers, setPlayer, setGamers, game, setGame, setCheckMate}: SocketHandlers) => {
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

            socket.on('checkMate', (gameOver: boolean) => {
                setCheckMate(gameOver);
            })

        }

        return () => {
            socket.off('playerCount');
            socket.off('namePlayers');
            socket.off('player');
            socket.off('movement');
            socket.off('resetGame');
        }
    }, [game, setGame]);
}