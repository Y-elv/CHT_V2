import gamePic from "../../assets/gamePic.jpg"
import { CiPlay1 } from "react-icons/ci";
import "./game.css"
const Game = () => {
    return (  
        <>
        <div className="game-container">
            <div className="word">
                <h5>PLAY NOW</h5>
                <h5>shutters and ladder game</h5>
                <h5>Available soon !</h5>

            </div>
            <div className="game-img">
                <img src={gamePic}/>
            </div>
            <div className="game-icon">
            <CiPlay1 style={{ 
                fontSize: '2em',
                color:'black'
         }}/>
            </div>
        </div>
        </>
    );
}
 
export default Game;