const Interface = ({ setValidation }: {setValidation: React.Dispatch<React.SetStateAction<boolean>>}) => {
    return ( 
        <div className="i">
            <h1>¡Bienvenido a Renner Chess!</h1>
            <button onClick={() => setValidation(false)} className="btn">JUGAR</button>
            <button className="btn">REGLAS</button>
        </div>
     );
}
 
export default Interface;