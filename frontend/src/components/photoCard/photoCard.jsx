import './photoCard.css'
import card1 from "../../assets/card1.png"
const photoCard = ({name,className, classStyle,img}) => {
    return ( 
        <>
       <div className="photo-container">
        <img src={name}
        className={img}
        />
        {/* <div className={className} style={{position:"relative", botton:"30px", width:"100%" , height:"40px"}}></div> */}
        <div className="board"></div>
       </div>
        </>
     );
}
 
export default photoCard;