import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import "./Hospital.css";
import muhima from "../../assets/muhima.png";
import kiziguro from "../../assets/kiziguro.png";
import ngarama from "../../assets/ngarama.png";
import UserNavbar from "../../layout/userNavbar/userNavbar";
import { AiFillHome } from "react-icons/ai";
import { ImLocation2 } from "react-icons/im";
import { BsFillTelephoneFill } from "react-icons/bs";

function Hospital() {
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
                Muhima Hospital, a public healthcare facility in Nyarugenge
                District, City of Kigali, offers a wide range of medical
                services, including sexual reproductive health. Established in
                2001 as an extension of the Muhima Health Center, which dates
                back to 1988, the hospital was funded by the World Bank's "Santé
                Population" project. In July 2001, it was entrusted to the
                Ministry of Health, playing a crucial role in providing
                accessible and comprehensive healthcare to the community.
              </p>
              <div className="icons-service">
                <div>
                  <ImLocation2 className="icon" />
                  Address:KIGALI CITY-NYARUGENGE DISTRICT-MUHIMA SECTOR{" "}
                </div>
                <div>
                  <AiFillHome className="icon" />
                  muhima.hospital@moh.gov.rw
                </div>
                <div>
                  <BsFillTelephoneFill className="icon" />
                  0784352617
                </div>
              </div>
            </div>
            <div className="part2">
              <img src={muhima} />
            </div>
            <div className="part3">
              <p>
                NGARAMA District Hospital, situated in Gatsibo district, Eastern
                Province, Rwanda, is a public hospital established in 1982 with
                support from the Dutch state. Located 20 km from the main
                Kigali-Kagitumba road and 172 km from Kigali city, it provides
                comprehensive healthcare services, including sexual reproductive
                health and legally sanctioned abortion. With a capacity of 127
                beds, the hospital offers a range of outpatient and inpatient
                services, as well as supervision for health centers in the
                region.
              </p>
              <div className="icons-service">
                <div>
                  <ImLocation2 className="icon" />
                  Address: Director General: P.Box: 49 Nyagatare{" "}
                </div>
                <div>
                  <AiFillHome className="icon" />
                  ngarama.hospital.moh.gov.rw
                </div>
                <div>
                  <BsFillTelephoneFill className="icon" />
                  0785398394
                </div>
              </div>
            </div>
          </div>
          <div className="service-middle-right">
            <div className="part1">
              <img src={ngarama} />
            </div>
            <div className="part2">
              <p>
                Kiziguro District Hospital, established in 1985 by the Catholic
                Diocese of Byumba, serves as one of the two hospitals in Gatsibo
                district, Rwanda. Located in the Eastern Province, it provides a
                range of services, including sexual reproductive health and
                legally sanctioned abortion. The hospital's 12 departments cater
                to various medical needs, such as surgical, pediatric,
                maternity, and mental health care, serving a catchment area of
                nearly 500,000 people with 158 beds and five ambulances.
              </p>
              <div className="icons-service">
                <div>
                  <ImLocation2 className="icon" />
                  Address: P.Box: 53 RWAMAGANA{" "}
                </div>
                <div>
                  <AiFillHome className="icon" />
                  kiziguro.hospital.hospital@moh.gov.rw
                </div>
                <div>
                  <BsFillTelephoneFill className="icon" />
                  0726903769, 0788329851
                </div>
              </div>
            </div>
            <div className="part3">
              <img src={kiziguro} />
            </div>
          </div>
        </div>
        <div className="service-footer">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Hospital;
