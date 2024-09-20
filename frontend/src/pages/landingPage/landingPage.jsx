import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
// import "./landingPage.css";
import "./animate.css";
import africa from "../../assets/africa.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import woman1 from "../../assets/round-woman.svg";
import woman2 from "../../assets/round-woman2.svg";
import Image1 from "../../assets/Background1.svg";
import Image2 from "../../assets/Background2.svg";
import Image3 from "../../assets/Background3.svg";
import Kigali from "../../assets/Kigali city.jpeg";
import star from "../../assets/Star1.svg";
import { MdLocalPharmacy } from "react-icons/md";
import { RiMentalHealthFill } from "react-icons/ri";
import { MdHealthAndSafety } from "react-icons/md";
import { useBadgeStore } from "../../zustandStore/store";
import { motion } from "framer-motion";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
// import HomeSlideShowComponent from "../../components/HomeSlideShowComponent";

const LandingPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const profile = useBadgeStore((state) => state.profile) || null;
  const [background, setBackground] = useState(Image1);
  let ImageArray = [Image1, Image2, Image3];
  const ImageArray2 = [
    {
      url: Image1,
      title: "Welcome to FunHealth",
      text: "Welcome to FunHealth, where we provide comprehensive care and support to keep your mind and body healthy.",
      buttonText: "Learn More",
    },
    {
      url: Image2,
      title: "Mental Wellness",
      text: "Explore our resources and activities designed to boost your mental health and well-being.",
      buttonText: "Explore",
    },
    {
      url: Image3,
      title: "Your Health, Our Priority",
      text: "Discover how we make healthcare simple and accessible, supporting your journey to a healthier life.",
      buttonText: "Get Started",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ImageArray.length);
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [ImageArray.length]);

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

      console.log("response", response);
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
    // const user = JSON.parse(localStorage.getItem("userInfo"));

    if (profile) navigate("/profile");
  }, []);

  return (
    <>
      <div className="landing-sections">
        <div className="section-1">
          <Navbar />
        </div>
        {/* <HomeSlideShowComponent/> */}
        {/* <div
      className="hero-section flex flex-col tablet:flex-row w-full py-3 tablet:h-[100vh] bg-white p-3 tablet:p-10"
      style={{ backgroundImage: `url(${ImageArray[currentImageIndex]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    > */}
        {/* <div className="hero-content flex-col  tablet:w-[50%] p-5  tablet:p-10 tablet:pl-16 flex gap-10 items- justify-center"> */}
        {/* <motion.h1
      initial={{x:-1000}}
      animate={{x:[-1000, 50, 0]}}
      transition={{duration:1.5, delay:1}}
      className="text-4xl tablet:text-6xl font-bold uppercase w-[80%] tablet:w-[70%] text-white">It all begins with <span className="italic text-white underline text-4xl tablet:text-6xl">yourself</span> </motion.h1>
       */}
        {/* <motion.p 
           initial={{x:0}}
           animate={{x:[-1000, 50, 0]}}
           transition={{duration:2.5, delay:1.5}}
      className=" tablet:w-[60%] leading-7 text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus in libero risus semper habitant arcu eget. Et integer facilisi eget diam.</motion.p>
     */}
        {/* <motion.div
             initial={{x:0}}
             animate={{x:[-1000, 50, 0]}}
             transition={{duration:2.5, delay:2}}
    className="flex items-center gap-3 slide-in">
    <motion.button 
    whileHover={{scale:1.1}}
    whileTap={{scale:0.9}}
     className="text-sm bg-blue-400 px-3 py-3 tablet:px-4 tablet:py-3 hover:text-blue-400 hover:border hover:bg-orange-400 transition-all rounded-full  text-white" onClick={()=>{navigate("/about")}}>Read More...</motion.button>
    <motion.button 
       whileHover={{scale:1.1}}
       whileTap={{scale:0.9}}
    className="text-sm border text-white border-orange-400 px-3 py-3 tablet:px-4 tablet:py-3 hover:text-white hover:bg-orange-400 transition-all rounded-full  " onClick={()=>{navigate("/login")}}>Get Started</motion.button>

    </motion.div> */}
        {/* </div> */}

        {/* <div className=" tablet:w-[50%] pb-[15%]  relative flex my-5 tablet:my-2 items-center justify-center"> */}
        {/* <motion.img 
      src={star} className="slide-in tablet:flex object absolute right-10 top-[-10%]  tablet:top-[5] w-24 tablet:w-28 "/>
      <motion.img src={star} className="slide-in fill-neutral-800 tablet:flex object w-16 tablet:w-24 absolute left-[10.5%] tablet:left-[-20%] bottom-2"/>

      <motion.img 
      animate={{y:0, scale:1}}
      transition={{type:"tween",duration:.8}}
        initial={{scale:0, y:0}}
      src={woman1} alt={"woman1"} className="w-[40%] slide-in  transition-all "/>
      <motion.img 
            animate={{y:0, scale:1}}
            transition={{type:"tween",duration:.8}}
            onHoverStart={{}}
              initial={{scale:0, y:0}}
      src={woman2} alt={"woaman1"} className="w-[40%] slide-in mb-[-25%] tablet:mb-[-25%]  transition-all "/> */}

        {/* </div> */}

        {/* </div> */}

        <div
          className="hero-section flex flex-col tablet:flex-row w-full py-3 tablet:h-[100vh] bg-white p-3 tablet:p-10 relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh]"
          style={{
            backgroundImage: `url(${ImageArray2[currentImageIndex].url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="text-overlay flex flex-col justify-center items-center w-full h-full absolute top-0 left-0"
            style={{ backgroundColor: "rgba(245, 241, 241, 0.081)" }}
          >
            <h1
              className="text-white text-3xl tablet:text-4xl laptop:text-5xl font-bold mb-4 animate-slideInUp"
              key={ImageArray2[currentImageIndex].title}
            >
              {ImageArray2[currentImageIndex].title}
            </h1>
            <p
              className="text-white text-lg tablet:text-xl laptop:text-2xl mb-6 animate-slideInUp delay-150 text-center tablet:text-left max-w-[90%] tablet:max-w-[70%] laptop:max-w-[50%]"
              key={ImageArray2[currentImageIndex].text}
            >
              {ImageArray2[currentImageIndex].text}
            </p>
            <button
              onClick={() => {
                const section = document.querySelector(".services-section");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-black text-[#F95700FF] px-4 py-2 tablet:px-6 tablet:py-3 hover:bg-blue-600 hover:text-white transition rounded-full animate-slideInUp delay-300"
              key={ImageArray2[currentImageIndex].buttonText}
            >
              {ImageArray2[currentImageIndex].buttonText}
            </button>
          </div>
        </div>

        <div className="services-section flex flex-col tablet:flex-col w-full tablet:h-[85vh] bg-blue-50 p-3 tablet:p-10">
          <h2 className="title p-5 px-10 font-medium slide-in">
            &#x2022; Our Services
          </h2>

          <div className="flex flex-wrap gap-3 items-center p-5 tablet:p-10 tablet:px-20 w-full">
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileInView={{ x: [-200, 10, 0], opacity: 1 }}
              className="card slide-in border border-gray-400 w-full tablet:w-[30%] flex flex-col justify-start items-start p-5 gap-3"
            >
              <div className="bg-[#FCDFBC] p-3 rounded-full">
                <MdLocalPharmacy className="text-orange-500 text-xl" />
              </div>

              <p className="font-medium">Pharmacy</p>
              <p className="text-sm">
                Access essential medications and expert advice to support your
                health, ensuring you receive the care you need.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileInView={{ y: [70, 10, 0], opacity: 1 }}
              className="card slide-in border border-gray-400 w-full tablet:w-[30%]  flex flex-col justify-start items-start p-5 gap-3"
            >
              <div className="bg-[#B4FFB7] p-3 rounded-full">
                <RiMentalHealthFill className="text-green-500 text-xl" />
              </div>

              <p className="font-medium">Mental Support</p>
              <p className="text-sm">
                We offer resources and guidance to help you achieve mental
                wellness, fostering resilience and emotional balance.
              </p>
            </motion.div>
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileInView={{ x: [200, 10, 0], opacity: 1 }}
              className="card slide-in border border-gray-400 w-full tablet:w-[30%]  flex flex-col justify-start items-start p-5 gap-3"
            >
              <div className="bg-[#FFB4B4] p-3 rounded-full">
                <MdHealthAndSafety className="text-red-500 text-xl" />
              </div>

              <p className="font-medium">Health Care</p>
              <p className="text-sm">
                In FunHealth, we provide personalized care to support your
                overall well-being, helping you achieve balance in mind and
                body.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="about-section flex flex-col tablet:flex-col w-full h-auto tablet:h-[70vh]  bg-white p-3 tablet:p-10">
          <h2 className="title p-5 px-10 font-medium slide-in">
            &#x2022; About Us
          </h2>

          <div className="content flex flex-col w-[85%] tablet:w-[70%] px-3 tablet:px-10 mx-auto">
            <p className="text-sm slide-in">
              Kundwa Health is youth-led organization working with young people
              to decentralize health information and service they need to lead
              healthier lives through digital health means.it was founded in
              Gatsibo district by three young health activits,who were driven by
              the passion of tackling sexual & reproductive health and mental
              health issues through supporting adolescents and young people to
              have access to life-saving information and services on sexual and
              reproductive health,mental health and youth empowerment through
              mentorship.Kundwa means “loved” it is name we choose for our
              organization which reflects how young people should be loved and
              cared for as the future of the nation. our intervention goal is to
              provide young people with different health tools including
              information and services they need in a fun and interactive way
              while promoting the usage of digital health means.
            </p>

            <div className="p-5 ">
              {/* <h2 className="title  font-medium">Goals achieved</h2> */}
              <div className="flex flex-wrap items-start m-2 my-5 gap-3">
                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileInView={{ y: [70, 10, 0], opacity: 1 }}
                  className=" border slide-in  rounded flex p-3 gap-3 items-center"
                >
                  <p className="text-2xl text-green-400">35+</p>
                  <p>People Helped</p>
                </motion.div>

                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.75 }}
                  whileInView={{ y: [70, 10, 0], opacity: 1 }}
                  className=" border slide-in rounded flex p-3 gap-3 items-center"
                >
                  <p className="text-2xl text-green-400">10+</p>
                  <p>Services Provided</p>
                </motion.div>
                <motion.div
                  initial={{ y: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileInView={{ y: [70, 10, 0], opacity: 1 }}
                  className=" border slide-in rounded flex p-3 gap-3 items-center"
                >
                  <p className="text-2xl text-green-400">15+</p>
                  <p>Facilities Partened with</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative flex flex-col tablet:flex-row tablet:h-[110vh] mb-5"
          style={{
            backgroundImage: `url(${Kigali})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-80"></div>

          {/* Centered text overlay */}
          <div className="relative flex flex-col w-full text-white z-10">
            {/* Top center alignment for h1 and p */}
            <div className="flex flex-col justify-start items-center w-full text-center pt-10">
              <h1 className="text-3xl tablet:text-5xl font-bold">
                Get in touch
              </h1>
              <p className="text-lg tablet:text-2xl mt-2">
                Chat with Professionals in Mental, Sexual, Dating
              </p>
            </div>

            {/* Left and right sections below the title */}
            <div className="flex flex-col tablet:flex-row justify-between w-full h-full mt-10 px-10">
              {/* Left section - hidden on small devices */}
              <div className="contact-left hidden tablet:flex flex-col h-[300px] tablet:h-[450px] p-5 mr-5 space-y-10">
                {/* Address */}
                <div className="material flex flex-row items-center space-x-6">
                  <div className="w-16 h-16 rounded-full bg-white flex justify-center items-center mr-2">
                    <IoLocationSharp className="text-2xl text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Address</h2>
                    <p className="text-sm">
                      Gatsibo District Eastern province Rwanda
                    </p>
                  </div>
                </div>
                {/* Phone */}
                <div className="material flex flex-row items-center space-x-6">
                  <div className="w-16 h-16 rounded-full bg-white flex justify-center items-center mr-2">
                    <FaPhoneAlt className="text-2xl text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Phone</h2>
                    <p className="text-sm">+250789287267</p>
                  </div>
                </div>
                {/* Email */}
                <div className="material flex flex-row items-center space-x-6">
                  <div className="w-16 h-16 rounded-full bg-white flex justify-center items-center mr-2">
                    <MdEmail className="text-2xl text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Email</h2>
                    <p className="text-sm">info@kundwahealth.org</p>
                  </div>
                </div>
              </div>

              {/* Right section */}
              <div className="contact-right flex-1 h-[200px] tablet:h-[450px] p-5 ml-5 bg-white">
                <div
                  className="input-contact p-4 tablet:p-10 w-full"
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                  }}
                >
                  <form
                    onSubmit={handleSubmit}
                    className="get-in-touch slide-in w-full"
                  >
                    <input
                      type="text"
                      className="border-none border-b border-[#737B7D] w-full tablet:w-[60%] p-2 text-base bg-white outline-none mb-2"
                      style={{ borderBottom: "1px solid #737B7D" }}
                      placeholder="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      className="border-none border-b border-[#737B7D] w-full tablet:w-[60%] p-2 text-base bg-transparent outline-none mb-2"
                      style={{ borderBottom: "1px solid #737B7D" }}
                      placeholder="Street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      className="border-none border-b border-[#737B7D] w-full tablet:w-[60%] p-2 text-base bg-transparent outline-none mb-2 text-black"
                      style={{ borderBottom: "1px solid #737B7D" }}
                      placeholder="Contact Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      className="border-none border-b border-[#737B7D] w-full tablet:w-[60%] p-2 text-base bg-transparent outline-none mb-2"
                      style={{ borderBottom: "1px solid #737B7D" }}
                      placeholder="E-mail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      className="border-none border-b border-[#737B7D] w-full tablet:w-[60%] p-2 text-base bg-transparent outline-none mb-2"
                      style={{ borderBottom: "1px solid #737B7D" }}
                      placeholder="Let's talk about your idea"
                      name="idea"
                      value={formData.idea}
                      onChange={handleChange}
                    />

                    <label className="flex items-center mb-4 text-black text-xs tablet:text-sm">
                      <input
                        type="checkbox"
                        className="checkbox mr-2"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                      />
                      Agree and Continue
                    </label>

                    <button
                      className="w-full tablet:w-[60%] bg-[#4635AB] hover:bg-indigo-900 text-white rounded py-2 tablet:py-3 px-4 tablet:px-5 transition duration-300"
                      type="submit"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-5">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
