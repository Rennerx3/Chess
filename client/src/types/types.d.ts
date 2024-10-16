export interface BoardProps {
    game: Chess;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
}

export interface Gamer {
    userId: string;
    color: 'w' | 'b';
}

export interface PieceProps {
    piece: {
        type: string;
        color: string;
    }
    onDragStart: (Event: React.DragEvent<HTMLDivElement>) => void;
}

export interface SquareProps {
    column: string;
    row: string;
    position: string;
    piece: {
        type: string;
        color: string;
    },
    game: Chess;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
    socket: Socket;
    setCheckMate: React.Dispatch<React.SetStateAction<boolean>>;
    player: string;
    gamers: Gamer[];
}

export interface SocketHandlers {
    socket: Socket;
    setPlayers: React.Dispatch<React.SetStateAction<number>>;
    setPlayer: React.Dispatch<React.SetStateAction<string>>;
    setGamers: React.Dispatch<React.SetStateAction<Gamer[]>>;
    game: Chess;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
    setCheckMate: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RenderSquareProps {
    i: number;
    j: number;
    game: Chess;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
    socket: Socket;
    setCheckMate: React.Dispatch<React.SetStateAction<boolean>>;
    player: string;
    gamers: Gamer[];
}