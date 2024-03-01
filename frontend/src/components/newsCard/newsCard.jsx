import dating from "../../assets/dating.png"
import "./newsCard.css"
const NewsCard = ({img,text}) => {
    return (  
        <>
    <div className="whole-card">
        <div className="texts">
       {text}
        </div>
        <div className="news-pics">
            <img src={img}/>
        </div>
    </div>
        </>
    );
}
 
export default NewsCard;