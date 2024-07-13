import React from "react";
import Navbar from "../../components/navbar/navbar";
// import TeamCard from "../../components/";
import Footer from "../../layout/footer/footer";
import Muhima from "../../assets/muhima.png";
import Kipharma from "../../assets/kipharma.png";
import Health from "../../assets/reproductive.png";
import UserNavbar from "../../layout/userNavbar/userNavbar";
import dating from "../../assets/dating.png"
import love from "../../assets/love.png"
import prodhealth from "../../assets/prodhealth.png"
import NewsCard from "../../components/NewsCard";

function News() {
  return (
    <div className="bg-blue-100 min-h-[100vh] w-[100vw]">
      <UserNavbar active="ourTeam" />

      <div className="content p-10 w-full  flex flex-col items-center">
        <div className="w-full my-3">
          <h3 className="text-center font-semibold text-lg my-5">Did You Know?</h3>
        </div>

<div className=" flex flex-col items-center gap-10">
    <NewsCard
    Image={dating}
    paragraph={` shared interests are like glue in a relationship. when you and
              your date have common hobbies or passions, it creates a strong
              bond, making your connection more meaningful.Exploring these
              shared activities together can lead to memorable experiences and
              deeper understanding between you both`}
    />
    <NewsCard
    Image={love}
    paragraph={` mental health is as crucial as physical health. it affect our
              emotions, thoughts, and daily functioning.just like we prioritize
              our physical well-being.it’s essential to care for our mental
              health.seeking support, practicing self care, and reducing stigma
              can lead to better overall well-being and a more fulfilling life.`}
    />
    <NewsCard
    Image={prodhealth}
    paragraph={`      youth face unique reproductive challenges. they may lack
              comprehensive education, access to contraception, and experience
              peer pressure. these factors can lead to unintended pregnancies or
              the spread of sexually transmitted infections.providing accurate
              information, safe spaces for discussion, and accessible healthcare
              can empower young people to make informed decisions about their
              reproductive health.`}
    />


        </div>
      </div>
      <Footer />
    </div>
  );
}

export default News;
