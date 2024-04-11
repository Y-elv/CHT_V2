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
                KARAMBO Health Center, part of the NEMBA District Hospital's
                catchment area, is committed to providing comprehensive
                healthcare services. This includes specialized care in sexual
                reproductive health, ensuring access to legally sanctioned
                abortion services. Located in the vibrant community of NEMBA,
                the health center caters to diverse healthcare needs,
                prioritizing patient well-being and reproductive health.
              </p>
              <div className="icons-service">
                <div className="icon-wrapper">
                  <ImLocation2 className="icon" />
                  Current Location: KARAMBO Health Center{" "}
                </div>
                <div className="icon-wrapper">
                  <AiFillHome className="icon" />
                  nembahc@gmail.com
                </div>
                <div className="icon-wrapper">
                  <BsFillTelephoneFill className="icon" />
                  0788550295
                </div>
              </div>
            </div>
            <div className="part2">
              <img src={karambo} />
            </div>
            <div className="part3">
              <p>
                Remera Mbogo Health Center is a comprehensive healthcare
                facility in Ngoma Sector, Rulindo District, serving residents of
                Ngoma Sector, Cyinzuzi Sector, and surrounding areas. Operating
                24/7, it offers a range of services including curative
                consultations, hospitalization, maternity care, laboratory
                services, family planning, vaccination, ARV treatment, GBV
                prevention, and reproductive health services, including legally
                sanctioned abortion
              </p>
              <div className="icons-service">
                <div className="icon-wrapper">
                  <ImLocation2 className="icon" />
                  Current Location: Remera Mbogo Health Center{" "}
                </div>
                <div className="icon-wrapper">
                  <AiFillHome className="icon" />
                  remerambogohc@rutongohospital.gov.rw
                </div>
                <div className="icon-wrapper">
                  <BsFillTelephoneFill className="icon" />
                  0788587357
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
                Juru Health Center, established in July 2011, is a vital
                healthcare provider in Bugesera District, Southern Rwanda,
                catering to a population of 30,163. Alongside its comprehensive
                medical services, the center is dedicated to sexual reproductive
                health. As of April 2020, Juru Health Center has conducted
                211,737 consultations, facilitated 5,038 deliveries, and
                registered 7,734 new antenatal care cases, emphasizing its
                commitment to holistic healthcare.
              </p>
              <div className="icons-service">
                <div className="icon-wrapper">
                  <ImLocation2 className="icon" />
                  Current Location:Juru Health Center{" "}
                </div>
                {/* <div>
                  <AiFillHome className="icon" />
                  modernfamilypharmacy.org
                </div> */}
                <div className="icon-wrapper">
                  <BsFillTelephoneFill className="icon" />
                  0784 531 581
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
