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
    color: string;
}

app.use(cors());

const roomPlayers: {[key: string]: User[]} = {};

io.on('connection', (socket) => {

    socket.on('joinGame', (roomId) => {
        socket.join(roomId);
        
        const room = io.sockets.adapter.rooms.get(roomId);
        const numberOfClients = room ? room.size : 0;

        if(!roomPlayers[roomId]){
            roomPlayers[roomId] = [];
        }else{
            if(roomPlayers[roomId].length === 2){
                for(let key in roomPlayers){
                    if(key !== roomId){
                        roomPlayers[key] = [];
                    }
                }
                roomPlayers[roomId] = [];
            } 
        }

        const existingPlayer = roomPlayers[roomId].find(player => player.userId === socket.id);

        if(!existingPlayer){
            const color = roomPlayers[roomId].length === 0 ? 'b' : 'w';
            roomPlayers[roomId].push({userId: socket.id, color});
        }

        io.to(roomId).emit('playerCount', numberOfClients);
        io.to(roomId).emit('namePlayers', {roomPlayers: roomPlayers[roomId]});
        socket.emit('player', socket.id);
        
        socket.on('movement', ({from, to, movements}) => {
            console.log(movements);
            debugger;
            
            io.to(roomId).emit('movement', {from, to, movements});
        });

    });
    



    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });

});

server.listen(4000, () => {
    console.log('Se está escuchando el puerto 4000');
});


