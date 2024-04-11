import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import "./Hospital.css";
import kipharma from "../../assets/kipharma.png";
import reproductive from "../../assets/reproductive.png";
import gate from "../../assets/gate.png";
import UserNavbar from "../../layout/userNavbar/userNavbar";
import { AiFillHome } from "react-icons/ai";
import { ImLocation2 } from "react-icons/im";
import { BsFillTelephoneFill } from "react-icons/bs";
import modern from "../../assets/modernFam.jpg";
import mila from "../../assets/Mila .jpg";
function Hospital() {
  return (
    <>
      <div className="service-container">
        <div className="service-header">
          <UserNavbar />
        </div>
        <div className="service-title">WE GOT YOU ! Hospital</div>
        <div className="service-middle">
          <div className="service-middle-left">
            <div className="part1">
              <p>
                Mila Pharmacy is your go-to destination for sexual health needs,
                offering a discreet and comprehensive range of services. From
                contraception pills to condoms, we provide access to essential
                products that promote safe and responsible sexual practices. Our
                knowledgeable pharmacists offer personalized consultations,
                ensuring you receive the right guidance and support. At Mila
                Pharmacy, we prioritize your privacy and well-being, empowering
                you to make informed choices about your sexual health.
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
                Modern Family Pharmacy specializes in providing a range of
                sexual and reproductive health services, including contraception
                pills and condoms. As a trusted healthcare provider, we offer
                confidential consultations and personalized guidance to ensure
                our clients receive the most suitable options for their needs.
                Our goal is to promote safe and responsible sexual health
                practices, empowering individuals to make informed decisions
                about their reproductive well-being.
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
}

export default Hospital;
