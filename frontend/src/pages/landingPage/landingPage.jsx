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
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const LandingPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    companyName: "",
    street: "",
    phone: "",
    email: "",
    idea: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    if (
      !formData.companyName ||
      !formData.street ||
      !formData.phone ||
      !formData.email ||
      !formData.idea
    ) {
      toast({
        title: "Please fill in all fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email format",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (!formData.agree) {
      toast({
        title: "Please agree to the terms",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      
      const response = await axios.post(
        " https://chtv2-bn.onrender.com/api/v2/user/getInTouch",
        formData
      );

      
      setFormData({
        companyName: "",
        street: "",
        phone: "",
        email: "",
        idea: "",
        agree: false,
      });

      console.log("response",response)
      toast({
        title: "Form submitted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      
      console.error("Request failed:", error);
      toast({
        title: "Error submitting the form",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
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
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  style={{
                    border: "none",
                    borderBottom: "1px solid #737B7D",
                    width: "60%",
                    padding: "8px",
                    fontSize: "16px",
                    background: "#E4EAFC",
                    marginBottom: "5px",
                  }}
                  placeholder="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
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
                    marginBottom: "5px",
                  }}
                  placeholder="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
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
                    marginBottom: "5px",
                  }}
                  placeholder="Contact Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
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
                    marginBottom: "5px",
                  }}
                  placeholder="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                    marginBottom: "10px",
                  }}
                  placeholder="Let's talk about your idea"
                  name="idea"
                  value={formData.idea}
                  onChange={handleChange}
                />

                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    style={{
                      padding: "10px",
                      marginBottom: "15px",
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
