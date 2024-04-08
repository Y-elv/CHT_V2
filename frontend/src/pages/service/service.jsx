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
          <UserNavbar/>
        </div>
        <div className="service-title">WE GOT YOU !</div>
        <div className="service-middle">
          <div className="service-middle-left">
            <div className="part1">
              <p>
                Mila Pharmacy Ltd prioritizes fostering robust connections among
                colleagues through shared interests. Common passions, like a
                dedication to pharmaceutical advancements or exceptional
                customer service, cultivate profound bonds, enhancing teamwork
                and understanding. Together, exploring mutual activities
                strengthens unity, enriches experiences, and propels collective
                success, fostering a culture of mutual appreciation.
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
                Modern Family Pharmacy, shared interests are valued for their
                ability to fortify connections among colleagues. A mutual
                dedication to innovative healthcare solutions or exceptional
                patient care cultivates unity and a cohesive work environment.
                By engaging in these shared activities, we enhance teamwork,
                enrich experiences, and propel collective success, reflecting
                our commitment to collaboration and mutual appreciation.
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
