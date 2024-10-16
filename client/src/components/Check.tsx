export const Check = ({ turn, resetGame }: { turn: boolean, resetGame: () => void }) => {
    return (
        <div className="check">
            <p>{turn ? 'You lose' : 'You win'}</p>
            <button onClick={() => resetGame()}>New Game</button>
        </div>
    )
}