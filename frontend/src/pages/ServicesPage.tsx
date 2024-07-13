import React from "react";
import Navbar from "../components/navbar/navbar";
import TeamCard from "../components/TeamCard";
import Footer from "../layout/footer/footer";
import Muhima from "../assets/muhima.png";
import Kipharma from "../assets/kipharma.png";
import Health from "../assets/reproductive.png";

function ServicesPage() {
  return (
    <div className="bg-blue-100 min-h-[100vh] w-[100vw]">
      <Navbar active="ourTeam" />

      <div className="content p-10 w-full min-h-[100vh] ">

        <div className="w-full my-3">
            <h3 className="text-center font-semibold text-lg ">WE GOT YOU</h3>
        </div>
        
        <div className="container flex flex-row items-start bg-white my-3 w-full tablet:w-[70%] border border-red-700 gap-5 rounded">
          <div className="ml-[-10px] w-[30%]  h-[200px] tablet:h-[200px]">
            <img src={Muhima} alt="" className="object-fill h-full" />
          </div>

          <div className="w-[65%]">
            <p className="my-3 leading-6 self-start text-sm tablet:text-base">
              shared interests are like glue in a relationship. when you and
              your date have common hobbies or passions, it creates a strong
              bond, making your connection more meaningful.Exploring these
              shared activities together can lead to memorable experiences and
              deeper understanding between you both
            </p>
          </div>
        </div>

        <div className="container flex flex-row-reverse items-start bg-white my-3 tablet:w-[70%] border border-red-700 gap-5 rounded">
        <div className="ml-[-10px] w-[30%]  h-[200px] tablet:h-[200px]">
            <img src={Kipharma} alt="" className="object-fill h-full" />
          </div>

          <div className="w-[65%]">
            <p className="my-3 leading-6 self-start text-sm tablet:text-base">
            mental health is as crucial as physical health. it affect our emotions, thoughts, and daily functioning.just like we prioritize our physical well-being.it’s essential to care for our mental health.seeking support, practicing self care, and reducing stigma can lead to better overall well-being and a more fulfilling life.
            </p>
          </div>
        </div>

        <div className="container flex flex-row items-start bg-white my-3 tablet:w-[70%] border border-red-700 gap-5 rounded">
        <div className="ml-[-10px] w-[30%]  h-[200px] tablet:h-[200px]">
            <img src={Health} alt="" className="object-fill h-full" />
          </div>

          <div className="w-[65%]">
            <p className="my-3 leading-6 self-start text-sm tablet:text-base">
            youth face unique reproductive challenges. they may lack comprehensive education, access to contraception, and experience peer pressure. these factors can lead to unintended pregnancies or the spread of sexually transmitted infections.providing accurate information, safe spaces for discussion, and accessible healthcare can empower young people to make informed decisions about their reproductive health.
            </p>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default ServicesPage;
