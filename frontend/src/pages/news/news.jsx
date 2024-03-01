
import NewsCard from "../../components/newsCard/newsCard";
import Footer from "../../layout/footer/footer";
import UserNavbar from "../../layout/userNavbar/userNavbar";
import dating from "../../assets/dating.png"
import love from "../../assets/love.png"
import prodhealth from "../../assets/prodhealth.png"
import "./news.css"
const News = ({
    img,text
}) => {
    return ( 
        <>
        <div className="news-container">
            <div className="news-header">
                <UserNavbar/>
            </div>
            <div className="news-middles">
              <div className="news-titles">DID YOU KNOW?</div> 
              <div className="news-comps">
              <NewsCard
              img={dating}
              text={`shared interests are like glue in a relationship. when you and your date have common hobbies or passions, it creates a strong bond, making your connection more meaningful.Exploring these shared activities together can lead to memorable experiences and deeper understanding between you both`}
              /> 
              <NewsCard
               img={love}
               text={`mental health is as crucial as physical health. it affect our emotions, thoughts, and daily functioning.just like we prioritize our physical well-being.it’s essential to care for our mental health.seeking support, practicing self care, and reducing stigma can lead to better overall well-being and a more fulfilling life.`}
              /> 
              <NewsCard
               img={prodhealth}
               text={`youth face unique reproductive challenges. they may lack comprehensive education, access to contraception, and experience peer pressure. these factors can lead to unintended pregnancies or the spread of sexually transmitted infections.providing accurate information, safe spaces for discussion, and accessible healthcare can empower young people to make informed decisions about their reproductive health.`}
              /> 
              </div>
              

            </div>
            <div className="news-footer">
            <Footer/>
            </div>
        </div>

        </>
     );
}
 
export default News;