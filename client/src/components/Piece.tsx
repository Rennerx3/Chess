interface PieceProps {
    piece: {
        type: string;
        color: string;
    }
    onDragStart: (Event: React.DragEvent<HTMLDivElement>) => void;
}

const Piece = ( { piece, onDragStart }: PieceProps ) => {

    const pieceSymbol = piece.type;
    const pieceColor = piece.color === 'w' ? 'white' : 'black';
    const pieceClass = `${pieceSymbol}-${pieceColor}`;

    return ( 
        <div
            className={`piece ${pieceClass}`}
            draggable
            onDragStart={onDragStart}
        >
        </div>
     );
}
 
export default Piece;