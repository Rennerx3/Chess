import express from 'express';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

interface User {
    userId: string;
    color: 'w' | 'b';
}

app.use(cors());

const roomPlayers: { [key: string]: User[] } = {};

io.on('connection', (socket) => {

    console.log('Un cliente se ha conectado');


    socket.on('joinGame', (roomId: string) => {
        socket.join(roomId);
        console.log(`El cliente ${socket.id} se ha unido a la sala ${roomId}`);

        if (!roomPlayers[roomId]) {
            roomPlayers[roomId] = [];
        }

        if (roomPlayers[roomId].length > 2) {
            socket.emit('romeFull', roomId);
            return;
        } 

        const isPlayer = roomPlayers[roomId].some(player => player.userId === socket.id);

        if (!isPlayer) {
            const color: 'w' | 'b' = roomPlayers[roomId].length === 0 ? 'w' : 'b';
            roomPlayers[roomId].push({ userId: socket.id, color });
            io.to(roomId).emit('playerCount', roomPlayers[roomId].length);
            io.to(roomId).emit('namePlayers', { roomPlayers: roomPlayers[roomId] });
            socket.emit('player', socket.id);
        }

        socket.on('movement', ({ from, to }: { from: string, to: string }) => {
            console.log(`El cliente ${socket.id} ha movido de ${from} a ${to}`);
            console.log(roomId);
            
            io.to(roomId).emit('movement', { from, to });
        });

        socket.on('resetGame', () => {
            console.log(`El cliente ${socket.id} ha reseteado el juego`);
            io.to(roomId).emit('resetGame');
        })

        socket.on('disconnect', () => {
            console.log('Un cliente se ha desconectado');
    
            if(roomPlayers[roomId]){
                roomPlayers[roomId] = roomPlayers[roomId].filter(user => user.userId !== socket.id);
                io.to(roomId).emit('playerCount', roomPlayers[roomId].length);
                io.to(roomId).emit('namePlayers', { roomPlayers: roomPlayers[roomId] });
    
                if(roomPlayers[roomId].length === 0){
                    delete roomPlayers[roomId];
                }
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    })


});

server.listen(4000, () => {
    console.log('Se está escuchando el puerto 4000');
});


