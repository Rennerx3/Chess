export const Turn = ({ currentGamer, turn }: { currentGamer: { userId: string, color: string } | undefined, turn: boolean }) => {


    return (
        <div className="turn-main">
            <div className="turn">
                <p className={currentGamer?.color === 'w' ? 'white size' : 'black size'}>{currentGamer ? (currentGamer.color === 'w' ? '♜' : '♜') : 'Spectator'}</p>
                <p className={currentGamer?.color === 'w' ? 'white' : 'black'}>{turn ? "It's your turn" : "Turn of the opponent"}</p>
            </div>
        </div>
    )
};