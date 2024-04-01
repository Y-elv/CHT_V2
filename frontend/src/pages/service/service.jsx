import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import "./service.css";
import kipharma from "../../assets/kipharma.png";
import reproductive from "../../assets/reproductive.png";
import gate from "../../assets/gate.png";
import UserNavbar from "../../layout/userNavbar/userNavbar";
import { AiFillHome } from "react-icons/ai";
import { ImLocation2 } from "react-icons/im";
import { BsFillTelephoneFill } from "react-icons/bs";
import modern from "../../assets/modernFam.jpg";
import mila from "../../assets/Mila .jpg";
const ServicePage = () => {
  return (
    <>
      <div className="service-container">
        <div className="service-header">
          <UserNavbar />
        </div>
        <div className="service-title">WE GOT YOU !</div>
        <div className="service-middle">
          <div className="service-middle-left">
            <div className="part1">
              <p>
                shared interests are like glue in a relationship. when you and
                your date have common hobbies or passions, it creates a strong
                bond, making your connection more meaningful.Exploring these
                shared activities together can lead to memorable experiences and
                deeper understanding between you both
              </p>
              <div className="icons-service">
                <div>
                  <ImLocation2 className="icon" />
                  Current Location:MILA PHARMACY LTD{" "}
                </div>
                <div>
                  <AiFillHome className="icon" />
                  milapharmacy.org
                </div>
                <div>
                  <BsFillTelephoneFill className="icon" />
                  :+250788786699
                </div>
              </div>
            </div>
            <div className="part2">
              <img src={mila} />
            </div>
            <div className="part3">
              <p>
                youth face unique reproductive challenges. they may lack
                comprehensive education, access to contraception, and experience
                peer pressure. these factors can lead to unintended pregnancies
                or the spread of sexually transmitted infections.providing
                accurate information, safe spaces for discussion, and accessible
                healthcare can empower young people to make informed decisions
                about their reproductive health.
              </p>
              <div className="icons-service">
                <div>
                  <ImLocation2 className="icon" />
                  Current Location:Gatsibo District Eastern province Rwanda{" "}
                </div>
                <div>
                  <AiFillHome className="icon" />
                  info@kundwahealth.org
                </div>
                <div>
                  <BsFillTelephoneFill className="icon" />
                  :+250789287267
                </div>
              </div>
            </div>
          </div>
          <div className="service-middle-right">
            <div className="part1">
              <img src={modern} />
            </div>
            <div className="part2">
              <p>
                mental health is as crucial as physical health. it affect our
                emotions, thoughts, and daily functioning.just like we
                prioritize our physical well-being.it’s essential to care for
                our mental health.seeking support, practicing self care, and
                reducing stigma can lead to better overall well-being and a more
                fulfilling life.
              </p>
              <div className="icons-service">
                <div>
                  <ImLocation2 className="icon" />
                  Current Location:Modern Family Pharmacy{" "}
                </div>
                <div>
                  <AiFillHome className="icon" />
                  modernfamilypharmacy.org
                </div>
                <div>
                  <BsFillTelephoneFill className="icon" />
                  :+250788461069
                </div>
              </div>
            </div>
            <div className="part3">
              <img src={reproductive} />
            </div>
          </div>
        </div>
        <div className="service-footer">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ServicePage;
