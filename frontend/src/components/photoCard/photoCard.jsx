import './photoCard.css'
import card1 from "../../assets/card1.png"
const photoCard = ({name,className,img}) => {
    return ( 
        <>
       <div className="photo-container">
        <img src={name}
        className={img}
        />
        {/* <div className={className}></div> */}
       </div>
        </>
     );
}
 
export default photoCard;