const Link = () => {

    return (
        <div className="i">
            <h2>¡PASALE ESTE LINK A TU AMIGO!</h2>
            <input type="text" value={window.location.href} style={{width: '300px', height:'50px'}}/>
        </div>
     );
}

export default Link;