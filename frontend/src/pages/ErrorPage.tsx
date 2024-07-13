import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import Footer from "../layout/footer/footer";
import { TbError404Off } from "react-icons/tb";

const ErrorPage: React.FC = () => {

    let navigate = useNavigate(); 

    function handleNavigatePrevious() {
      navigate(-1); 
    }

    function handleNavigateHome() {
      navigate('/'); 
    }

  return (
    <div className="">
        <Navbar 
        active=""
        />
         <div className="container m-3 tablet:m-10 flex flex-col space-x-2 items-center  justify-center tablet:min-h-[80vh] px-10 py-10 tablet:py-1">
         <div className="content w-[50%] flex flex-col gap-4 justify-center items-center">
                 
                 <TbError404Off className="text-5xl phone:text-9xl font-thin"/>
                 <p className="text-sm phone:text-base tablet:text-xl py-3">Sorry, we can’t seem to find your page</p>
                 <button className="btn btn-primary" onClick={handleNavigatePrevious}>Go Back</button>
                 <button className="btn btn-primary" onClick={handleNavigateHome}>Go Home</button>
      {/* <Button  value="Go Back" color={"rgb(38 38 38)"} onClick={()=>{handleNavigatePrevious()}}/>
      <Button  value="Home" color={"rgb(38 38 38)"} onClick={()=>{handleNavigateHome()}}/> */}
        </div>
         </div>

 <Footer/>
    </div>
  );
};

export default ErrorPage;
