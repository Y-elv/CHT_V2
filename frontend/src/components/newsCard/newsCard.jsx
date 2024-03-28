import dating from "../../assets/dating.png"
import "./newsCard.css"
const NewsCard = ({img,text}) => {
    const isSmallDevice = window.innerWidth <= 768;
    return (
      <>
        <div className="whole-card-mobile">
          {isSmallDevice ? (
            <div className="mobile-arr">
              <div className="news-pics-mobile">
                <img src={img} />
              </div>
              <div className="mobile-texts">{text}</div>
            </div>
          ) : (
            <>
              <div className="texts">{text}</div>
              <div className="news-pics">
                <img src={img} />
              </div>
            </>
          )}
        </div>
      </>
    );
}
 
export default NewsCard;