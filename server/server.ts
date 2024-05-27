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

app.use(cors());

io.on('connection', (socket) => {

    console.log('Un cliente se ha conectado');
    

    socket.on('movement', ({from, to}) => {
        io.emit('movement', {from, to});
    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
        
    });

});

server.listen(4000, () => {
    console.log('Se está escuchando el puerto 4000');
});


