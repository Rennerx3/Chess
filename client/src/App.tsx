import { useState } from 'react'
import { Chess } from 'chess.js'
import Board from './components/Board';


function App() {
  const [game, setGame] = useState(new Chess());

  return (
    <>
      <Board game={game} setGame={setGame}/>
    </>
  )
}

export default App
