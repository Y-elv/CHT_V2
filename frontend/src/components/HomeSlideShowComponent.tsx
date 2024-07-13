import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { motion } from "framer-motion"
import woman1 from "../assets/round-woman.svg"
import woman2 from "../assets/round-woman2.svg"
import star from "../assets/Star1.svg"

const HomeSlideShowComponent = () => {
    const images = [
        "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
        "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
        "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    ];

    return (
        <Slide>
            <div className="each-slide-effect">
            <div className="hero-section flex flex-col tablet:flex-row w-full py-3 tablet:h-[100vh] bg-white p-3 tablet:p-10">
    <div className="hero-content flex-col  tablet:w-[50%] p-5  tablet:p-10 tablet:pl-16 flex gap-10 items- justify-center">
      <motion.h1
      initial={{x:-1000}}
      animate={{x:[-1000, 50, 0]}}
      transition={{duration:1.5, delay:1}}
      className="text-4xl tablet:text-6xl font-bold uppercase w-[80%] tablet:w-[65%]">It all begins with <span className="italic  underline text-4xl tablet:text-6xl">yourself</span> </motion.h1>
      
      <motion.p 
           initial={{x:0}}
           animate={{x:[-1000, 50, 0]}}
           transition={{duration:2.5, delay:1.5}}
      className=" tablet:w-[60%] leading-7">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus in libero risus semper habitant arcu eget. Et integer facilisi eget diam.</motion.p>
    
    <motion.div
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
    className="text-sm border border-orange-400 px-3 py-3 tablet:px-4 tablet:py-3 hover:text-white hover:bg-orange-400 transition-all rounded-full  text-black" onClick={()=>{navigate("/login")}}>Get Started</motion.button>

    </motion.div>
    </div>

    <div className=" tablet:w-[50%] pb-[15%]  relative flex my-5 tablet:my-2 items-center justify-center">
      <motion.img 
      src={star} className="slide-in tablet:flex object absolute right-10 top-[-10%]  tablet:top-[5] w-24 tablet:w-28 "/>
      <motion.img src={star} className=" slide-in tablet:flex object w-16 tablet:w-24 absolute left-[10.5%] tablet:left-[-20%] bottom-2"/>

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
      src={woman2} alt={"woaman1"} className="w-[40%] slide-in mb-[-25%] tablet:mb-[-25%]  transition-all "/>

    </div>
   </div>
            </div>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${images[1]})` }}>
                    <span>Slide 2</span>
                </div>
            </div>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${images[2]})` }}>
                    <span>Slide 3</span>
                </div>
            </div>
        </Slide>
    );
};

export default HomeSlideShowComponent;