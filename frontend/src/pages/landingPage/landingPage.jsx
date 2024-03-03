import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import "./landingPage.css";
import africa from "../../assets/africa.png";
import card1 from "../../assets/card1.png";
import card2 from "../../assets/card2.png";
import card3 from "../../assets/card3.png";
import card4 from "../../assets/card4.png";
import card5 from "../../assets/card5.png";
import card6 from "../../assets/card6.png";
import PhotoCard from "../../components/photoCard/photoCard";
import Slideshow from "../../components/carouselCard/carouselcard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/profile");
  }, []);

  return (
    <>
      <div className="landing-sections">
        <div className="section-1">
          <Navbar />
        </div>
        <div className="section-2">
          <div className="left-sec-2">
            <h3>IT ALL BEGINS WITH YOURSELF</h3>
            <p>Good health is the foundation of a vibrant life</p>
          </div>
          <div className="right-sec-2">
            <div className="up-photos">
              <PhotoCard name={card1} className="className" />
              <PhotoCard name={card2} className="className" />
              <PhotoCard name={card3} className="className" />
            </div>
            <div className="down-photos">
              <PhotoCard name={card4} className="className" />
              <PhotoCard name={card5} className="className" />
              <PhotoCard name={card6} className="className" />
            </div>
          </div>
        </div>
        <div className="section-3">
          <div className="section-3-title">
            <h3>See what’s around today</h3>
          </div>
          <div className="section-3-contents">
            <Slideshow />
          </div>
        </div>
        <div className="section-4">
          <div className="section-4-left">
            <h3>
              Get in <span>touch</span>{" "}
            </h3>
            <h6>Chat with Professinals in Mental,sexual,Dating </h6>
            <div
              className="input-contact"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
               
                height: "100vh",
              }}
            >
              <form>
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "1px solid #737B7D",
                    width: "60%",
                    padding: "8px",
                    fontSize: "16px",
                    background: "#E4EAFC",
                  }}
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "1px solid #737B7D",
                    width: "60%",
                    padding: "8px",
                    fontSize: "16px",
                    background: "#E4EAFC",
                  }}
                  placeholder="street"
                />
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "1px solid #737B7D",
                    width: "60%",
                    padding: "8px",
                    fontSize: "16px",
                    background: "#E4EAFC",
                  }}
                  placeholder="Contact Phone"
                />
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "1px solid #737B7D",
                    width: "60%",
                    padding: "8px",
                    fontSize: "16px",
                    background: "#E4EAFC",
                  }}
                  placeholder="E-mail"
                />
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "1px solid #737B7D",
                    width: "60%",
                    padding: "8px",
                    fontSize: "16px",
                    background: "#E4EAFC",
                  }}
                  placeholder="Let's talk about your idea"
                />
                
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    style={{
                      padding: "10px",
                    }}
                  />
                  Agree and Continue
                </label>
                
                <button className="btn-contact" type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="section-4-right"></div>
          <img src={africa} className="africa" />
        </div>
        <div className="section-5">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
