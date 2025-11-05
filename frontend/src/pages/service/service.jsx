import Navbar from "../../components/navbar/navbar";
import UserNavbar from "../../layout/userNavbar/userNavbar";
import Footer from "../../layout/footer/footer";
import "./service.css";
import juru from "../../assets/juru.png";
import remera from "../../assets/remera.png";
import gashora from "../../assets/gashora.png";
import { AiFillHome } from "react-icons/ai";
import { ImLocation2 } from "react-icons/im";
import { BsFillTelephoneFill } from "react-icons/bs";
import karambo from "../../assets/karambo.png";
// import mila from "../../assets/Mila .jpg";
import React from "react";
import TeamCard from "../../components/TeamCard";
import Muhima from "../../assets/muhima.png";
import Kipharma from "../../assets/kipharma.png";
import Health from "../../assets/reproductive.png";
import ServicesCard from "../../components/ServicesCard";

function ServicesPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-[100vh] w-full overflow-x-hidden">
      <UserNavbar active="ourTeam" />

      <div className="content p-10 w-full min-h-[100vh] ">
        <div className="w-full my-3">
          <h3 className="text-center font-semibold text-lg ">WE GOT YOU</h3>
        </div>

        <div className="flex flex-col gap-5 items-center mx-auto w-full">
          <ServicesCard
            Image={Muhima}
            paragraph={`          Rugarama Health Center in Northern Rwanda's Burera District offers
              vital sexual and reproductive health services tailored for youth.
              Our dedicated team provides comprehensive care, including
              counseling, screenings, and education on family planning, STIs,
              and reproductive rights. We prioritize confidentiality, respect,
              and accessibility to ensure every young person receives the
              support they need for a healthy future .`}
              Location="Burera district"
              Email="butaro.hospital@moh.gov.rw"
              Tel="0788331114"
          />

          <ServicesCard
            Image={Muhima}
            paragraph={` Kabarore Health Center, situated in Eastern Province's Gatsibo District, Kabarore Sector, is dedicated to delivering essential sexual and reproductive health services tailored for youth. Our compassionate team provides a wide range of services including counseling, screenings, and education on family planning, STIs, and reproductive rights. We prioritize confidentiality, respect, and youth-friendly care to ensure every young person receives the support they need for a healthy and empowered life.`}
              Location="Gatsibo district"
              Email="kiziguro.hospital.hospital@moh.gov.rw"
              Tel="0788329851"
              reverse={true}
          />

          <ServicesCard
            Image={Muhima}
            paragraph={`Kiziguro Health Center, nestled in Eastern Province's Gatsibo District, Kiziguro Sector, specializes in empowering youth through comprehensive sexual and reproductive health services. Our dedicated team offers confidential consultations, screenings, and education on family planning, STIs, and reproductive health rights. We prioritize youth-friendly services, ensuring a supportive and inclusive environment where every young person can access the care they need for a healthy and fulfilling life`}
              Location="Gatsibo district"
              Email="kiziguro.hospital.hospital@moh.gov.rw"
              Tel="0788329851"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ServicesPage;
