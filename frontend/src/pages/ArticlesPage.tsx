import React from "react";
import Navbar from "../components/navbar/navbar";
import TeamCard from "../components/TeamCard";
import Footer from "../layout/footer/footer";
import Image from "../assets/modernFam.jpg";


function ArticlesPage() {
  return (
    <div className="bg-blue-100 min-h-[100vh] w-[100vw]">
      <Navbar active="ourTeam" />

      <div className="content p-10 w-full min-h-[100vh] ">
        <div className="w-full my-3">
          <h3 className="text-center font-semibold text-lg ">Explore</h3>
        </div>

        <div className="container p-5 flex flex-col items-start  bg-white my-3 w-full tablet:w-[70%] border border-red-700 gap-5 rounded">
            <div className="upper-part flex items-center justify-between">
            <p className="my-3 leading-6 self-start  tablet:text-base w-[30%] text-xs">
              shared interests are like glue in a relationship. when you and
              your date have common hobbies or passions, it creates a strong
              bond, making your connection more meaningful.Exploring these
              shared activities together can lead to memorable experiences and
              deeper understanding between you both
            </p>
            <div className=" w-[300px]  h-[200px] tablet:h-[200px]">
            <img src={Image} alt="" className="object-fill h-full" />
          </div> 
          <p className="my-3 leading-6 self-start text-xs tablet:text-base w-[30%]">
              shared interests are like glue in a relationship. when you and
              your date have common hobbies or passions, it creates a strong
              bond, making your connection more meaningful.Exploring these
              shared activities together can lead to memorable experiences and
              deeper understanding between you both
            </p>
            </div>

            <div className="lower-part">
       
          <h3 className="text-center font-semibold text-lg my-3">CHANGING LANDSCAPE OF GLOBAL LGBTQ + RIGHTS</h3>

          <div className="content flex gap-5 items-center">
          <p className="my-3 leading-6 self-start text-xs tablet:text-base">
              shared interests are like glue in a relationship. when you and
              your date have common hobbies or passions, it creates a strong
              bond, making your connection more meaningful.Exploring these
              shared activities together can lead to memorable experiences and
              deeper understanding between you both
            </p>

            <p className="my-3 leading-6 self-start text-xs tablet:text-base">
              shared interests are like glue in a relationship. when you and
              your date have common hobbies or passions, it creates a strong
              bond, making your connection more meaningful.Exploring these
              shared activities together can lead to memorable experiences and
              deeper understanding between you both
            </p>
            <p className="my-3 leading-6 self-start text-xs tablet:text-base">
              shared interests are like glue in a relationship. when you and
              your date have common hobbies or passions, it creates a strong
              bond, making your connection more meaningful.Exploring these
              shared activities together can lead to memorable experiences and
              deeper understanding between you both
            </p>
          </div>
        </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}

export default ArticlesPage;
