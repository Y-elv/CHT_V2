import React from 'react'
import Navbar from '../components/navbar/navbar'
import TeamCard from '../components/TeamCard'
import Footer from '../layout/footer/footer'
import { motion } from 'framer-motion'

function OurTeamPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <div className='bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-[100vh] overflow-x-hidden'>
        <Navbar
        active="ourTeam"
        />

        <div className="content p-6 sm:p-10 w-full h-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            {/* Team Section */}
            <motion.div 
              className="team-section"
              variants={itemVariants}
            >
              <motion.h2 
                className='text-3xl sm:text-4xl md:text-5xl text-center font-bold my-8 sm:my-12'
                variants={titleVariants}
                style={{
                  background: "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MEET THE TEAM
              </motion.h2>

              <motion.div 
                className="team-members flex flex-wrap mx-auto items-center justify-center gap-4 sm:gap-6"
                variants={cardContainerVariants}
              >
                <TeamCard />
                <TeamCard />
                <TeamCard />
                <TeamCard />
                <TeamCard />
                <TeamCard />
              </motion.div>   
            </motion.div>

            {/* KH Rooms Section */}
            <motion.div 
              className="kr-rooms flex flex-col items-center justify-center gap-5 tablet:w-[70%] mx-auto mt-12 sm:mt-16"
              variants={itemVariants}
            >
              <motion.div 
                className='border-2 border-[#2B2F92] bg-gradient-to-r from-[#2B2F92]/10 to-[#1e2266]/10 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(43, 47, 146, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <h2 className='text-xl sm:text-2xl text-center font-bold' style={{
                  background: "linear-gradient(135deg, #2B2F92 0%, #1e2266 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  KH ROOMS
                </h2>
              </motion.div>

              {/* About Section */}
              <motion.div 
                className="about bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl flex items-start gap-4 sm:gap-6 flex-col mb-5 w-full"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className='border-2 border-[#F7941D] bg-gradient-to-r from-[#F7941D]/10 to-[#FFA84D]/10 p-3 sm:p-4 rounded-xl w-full'
                  initial={{ rotateX: -90, opacity: 0 }}
                  whileInView={{ rotateX: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className='text-lg sm:text-xl text-center font-bold' style={{
                    background: "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    ABOUT
                  </h2>
                </motion.div>
                <motion.p 
                  className='text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <span className="font-semibold text-[#2B2F92] dark:text-[#F7941D]">KUNDWA HEALTH</span> is a youth-led organization working with young people to decentralize health information and services they need to lead healthier lives through digital health means. It was founded in Gatsibo district by three young health activists, who were driven by the passion of tackling sexual & reproductive health and mental health issues through supporting adolescents and young people to have access to life-saving information and services on sexual and reproductive health, mental health and youth empowerment through mentorship.
                  <br /><br />
                  <span className="font-semibold text-[#F7941D]">KUNDWA</span> means <span className="italic text-[#2B2F92] dark:text-[#F7941D]">"loved"</span> - it is the name we chose for our organization which reflects how young people should be loved and cared for as the future of the nation. Our intervention goal is to provide young people with different health tools including information and services they need in a fun and interactive way while promoting the usage of digital health means.
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <Footer/>
    </div>
  )
}

export default OurTeamPage
