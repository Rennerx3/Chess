import { Chess, Square as ChessSquare } from "chess.js";
import Square from "./Square";


interface BoardProps {
    game: Chess;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
}

const Board = ({ game, setGame }: BoardProps) => {

    const handleMove = ( from: string, to: string ) => {

        const move = game.move({from, to});

        if(move){
            setGame( new Chess(game.fen()) );
        }

    }

    const renderSquare = ( i: number, rank: number ) => {

        const col = 'abcdefgh'[i];
        const row = ( 8 - rank ).toString();
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
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                squares.push(renderSquare(j, i));
            }
        }
        return squares;
    }


    return <div className="board">{renderBoard()}</div>;
}
 
export default Board;