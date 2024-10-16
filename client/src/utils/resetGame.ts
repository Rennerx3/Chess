import { Socket } from "socket.io-client";

export const resetGame = (socket: Socket): void => {
    socket.emit('resetGame');
}