import Piece from "./Piece";

interface SquareProps {
    column: string;
    row: string;
    position: string;
    piece: {
        type: string;
        color: string;
    }
    onMove: ( from: string, to: string ) => void;
}

const Square = ({ column, row, position, piece, onMove }: SquareProps) => {

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const from = e.dataTransfer.getData('from');
        onMove(from, position);
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('from', position);
    }

    const styleSquare = (column: string, row: number) => {
        if((column === 'a' || column === 'c' || column === 'e' || column === 'g') && row % 2 === 0 ){
            return {backgroundColor: '#f0d9b5'};
        } else if((column === 'b' || column === 'd' || column === 'f' || column === 'h') && row % 2 !== 0){
            return {backgroundColor: '#f0d9b5'};
        }else{
            return {backgroundColor: '#b58863'};
        }
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