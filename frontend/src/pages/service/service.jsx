import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import "./service.css";
import juru from "../../assets/juru.png";
import remera from "../../assets/remera.png";
import gashora from "../../assets/gashora.png";
import UserNavbar from "../../layout/userNavbar/userNavbar";
import { AiFillHome } from "react-icons/ai";
import { ImLocation2 } from "react-icons/im";
import { BsFillTelephoneFill } from "react-icons/bs";
import karambo from "../../assets/karambo.png";
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
                Rugarama Health Center in Northern Rwanda's Burera District
                offers vital sexual and reproductive health services tailored
                for youth. Our dedicated team provides comprehensive care,
                including counseling, screenings, and education on family
                planning, STIs, and reproductive rights. We prioritize
                confidentiality, respect, and accessibility to ensure every
                young person receives the support they need for a healthy future
                .
              </p>
              <div className="icons-service">
                <div className="icon-wrapper">
                  <ImLocation2 className="icon" />
                  Current Location: Burera district{" "}
                </div>
                <div className="icon-wrapper">
                  <AiFillHome className="icon" />
                  butaro.hospital@moh.gov.rw
                </div>
                <div className="icon-wrapper">
                  <BsFillTelephoneFill className="icon" />
                  0788331114
                </div>
              </div>
            </div>
            <div className="part2">
              <img src={karambo} />
            </div>
            <div className="part3">
              <p>
                Kiziguro Health Center, nestled in Eastern Province's Gatsibo
                District, Kiziguro Sector, specializes in empowering youth
                through comprehensive sexual and reproductive health services.
                Our dedicated team offers confidential consultations,
                screenings, and education on family planning, STIs, and
                reproductive health rights. We prioritize youth-friendly
                services, ensuring a supportive and inclusive environment where
                every young person can access the care they need for a healthy
                and fulfilling life
              </p>
              <div className="icons-service">
                <div className="icon-wrapper">
                  <ImLocation2 className="icon" />
                  Current Location: Gatsibo district{" "}
                </div>
                <div className="icon-wrapper">
                  <AiFillHome className="icon" />
                  kiziguro.hospital.hospital@moh.gov.rw
                </div>
                <div className="icon-wrapper">
                  <BsFillTelephoneFill className="icon" />
                  0788329851
                </div>
              </div>
            </div>
          </div>
          <div className="service-middle-right">
            <div className="part1">
              <img src={remera} />
            </div>
            <div className="part2">
              <p>
                Kabarore Health Center, situated in Eastern Province's Gatsibo
                District, Kabarore Sector, is dedicated to delivering essential
                sexual and reproductive health services tailored for youth. Our
                compassionate team provides a wide range of services including
                counseling, screenings, and education on family planning, STIs,
                and reproductive rights. We prioritize confidentiality, respect,
                and youth-friendly care to ensure every young person receives
                the support they need for a healthy and empowered life.
              </p>
              <div className="icons-service">
                <div className="icon-wrapper">
                  <ImLocation2 className="icon" />
                  Current Location: Gatsibo district{" "}
                </div>
                <div>
                  <AiFillHome className="icon" />
                  kiziguro.hospital.hospital@moh.gov.rw
                </div>
                <div className="icon-wrapper">
                  <BsFillTelephoneFill className="icon" />
                  0788329851
                </div>
              </div>
            </div>
            <div className="part3">
              <img src={juru} />
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
