import React from 'react'
import Image from "../assets/alex.png"
import { motion } from 'framer-motion'
import './TeamCard.css'

function TeamCard() {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateY: -15,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -10,
      rotateY: 5,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      rotateY: 10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <motion.div 
      className='flex flex-col relative m-3 tablet:w-[25%] rounded-xl my-5 cursor-pointer'
      variants={cardVariants}
      whileHover="hover"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div 
        className='details bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl flex flex-col gap-4 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700'
        variants={hoverVariants}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div 
          className='mt-[-15%] tablet:mt-[-20%] w-full flex items-center justify-center relative z-10'
          style={{
            transformStyle: "preserve-3d",
            backgroundColor: "transparent",
            background: "transparent",
            isolation: "isolate",
          }}
        >
          <motion.div
            className='rounded-full overflow-hidden relative z-20'
            style={{
              border: "4px solid",
              borderColor: "#F7941D",
              backgroundColor: "transparent",
              background: "transparent",
              boxShadow: "0 0 20px rgba(247, 148, 29, 0.3), 0 0 40px rgba(43, 47, 146, 0.2)",
              isolation: "isolate",
            }}
            variants={imageVariants}
            whileHover={{
              boxShadow: "0 0 30px rgba(247, 148, 29, 0.5), 0 0 60px rgba(43, 47, 146, 0.3)",
              backgroundColor: "transparent",
              background: "transparent",
            }}
          >
            <motion.img 
              src={Image} 
              alt="Team Member" 
              className='object-contain rounded-full w-full h-auto block relative z-30'
              style={{
                backgroundColor: "transparent",
                background: "transparent",
                display: "block",
                position: "relative",
                isolation: "isolate",
              }}
            />
          </motion.div>
        </motion.div>
        <div className='flex items-center gap-3 mt-4'>
          <p className='font-bold text-lg text-[#2B2F92] dark:text-[#F7941D]'>Peter Nkusi</p>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='font-semibold text-[#F7941D] dark:text-[#FFA84D]'>Contribution</p>
          <p className='text-sm text-slate-600 dark:text-slate-400 leading-relaxed'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit tempore laborum rerum excepturi explicabo magni dolore officia suscipit delectus quidem, non ipsum id eaque adipisci? Id obcaecati repellat laborum officia.
          </p>
        </div>
        <div className='flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700'>
          <p className='font-semibold text-[#2B2F92] dark:text-[#F7941D]'>Email</p>
          <p className='font-medium text-slate-700 dark:text-slate-300'>myemail@gmail.com</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TeamCard
