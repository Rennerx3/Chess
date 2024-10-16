import Piece from "./Piece";
import { SquareProps } from "../types/types";
import { handleMove as onMove } from "../utils/handleMove";
import { styleSquare } from "../utils/styleSquare";

const Square = ({ column, row, position, piece, game, setGame, socket, setCheckMate, player, gamers  }: SquareProps) => {

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const from = e.dataTransfer.getData('from');
        onMove(from, position, game, setGame, socket, setCheckMate, player, gamers);
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('from', position);
    }

    return ( 
        <div
        className="square"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={styleSquare(column, parseInt(row))}
        >
            {piece && (<Piece 
                piece={piece}
                onDragStart={handleDragStart}
            />)}
        </div>
     );
}

export default Square;