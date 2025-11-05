import React from 'react'
import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import "./Pharmacy.css";
import kipharma from "../../assets/kipharma.png";
import reproductive from "../../assets/reproductive.png";
import gate from "../../assets/gate.png";
import UserNavbar from "../../layout/userNavbar/userNavbar";
import { AiFillHome } from "react-icons/ai";
import { ImLocation2 } from "react-icons/im";
import { BsFillTelephoneFill } from "react-icons/bs";
import modern from "../../assets/modernFam.jpg";
import mila from "../../assets/Mila .jpg";
import ServicesCard from '../../components/ServicesCard';
const Pharmacy = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-[100vh] w-full overflow-x-hidden">
      <UserNavbar active="ourTeam" />

      <div className="content p-10 w-full min-h-[100vh] ">
        <div className="w-full my-3">
          <h3 className="text-center font-semibold text-lg ">WE GOT YOU</h3>
        </div>

        <div className="flex flex-col gap-5 items-center mx-auto w-full">
          <ServicesCard
            Image={mila}
            paragraph={`Mila Pharmacy is your go-to destination for sexual health needs, offering a discreet and comprehensive range of services. From contraception pills to condoms, we provide access to essential products that promote safe and responsible sexual practices. Our knowledgeable pharmacists offer personalized consultations, ensuring you receive the right guidance and support. At Mila Pharmacy, we prioritize your privacy and well-being, empowering you to make informed choices about your sexual health.`}
              Location=":MILA PHARMACY LTD"
              Email="milapharmacy.org"
              Tel="+250788786699"
          />

          <ServicesCard
            Image={kipharma}
            paragraph={`Modern Family Pharmacy specializes in providing a range of sexual and reproductive health services, including contraception pills and condoms. As a trusted healthcare provider, we offer confidential consultations and personalized guidance to ensure our clients receive the most suitable options for their needs. Our goal is to promote safe and responsible sexual health practices, empowering individuals to make informed decisions about their reproductive well-being.
`}
              Location="Modern Family Pharmacy"
              Email="modernfamilypharmacy.org"
              Tel="+250788461069"
              reverse={true}
          />

          <ServicesCard
            Image={modern}
            paragraph={`youth face unique reproductive challenges. they may lack comprehensive education, access to contraception, and experience peer pressure. these factors can lead to unintended pregnancies or the spread of sexually transmitted infections.providing accurate information, safe spaces for discussion, and accessible healthcare can empower young people to make informed decisions about their reproductive health.`}
              Location="Gatsibo district"
              Email="kiziguro.hospital.hospital@moh.gov.rw"
              Tel="0788329851"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pharmacy
