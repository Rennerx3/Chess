import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import Board from './components/Board';
import Interface from './components/Interface';


function App() {
  const [game, setGame] = useState(new Chess());
  const [validation, setValidation] = useState(true);

  useEffect( () => {
    const url = new URLSearchParams(window.location.search);
    let room = url.get('roomId');
    if(room){
      setValidation(false);
    }else{
      setValidation(true);
    }
  }, []);

  return (
    <>
      {validation ? <Interface setValidation={setValidation} /> : <Board game={game} setGame={setGame}/>}
       
    </>
  )
}

export default App