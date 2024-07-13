import React from 'react'
import Navbar from '../components/navbar/navbar'
import TeamCard from '../components/TeamCard'
import Footer from '../layout/footer/footer'

function OurTeamPage() {
  return (
    <div className='bg-blue-100 min-h-[100vh]'>
        <Navbar
        active="ourTeam"
        />

        <div className="content p-10 w-full h-full ">

            <div className="team-section">
                         <h2 className='text-xl text-center font-semibold my-5'>MEET THE TEAM</h2>

            <div className="team-members flex flex-wrap mx-auto items-center justify-center gap-3">
                <TeamCard/>
                <TeamCard/>
                <TeamCard/>
                <TeamCard/>
                <TeamCard/>
                <TeamCard/>
            </div>   
            </div>

            <div className="kr-rooms flex flex-col items-center justify-center gap-5 tablet:w-[70%]  mx-auto">
                <div className='border border-black p-2 rounded my-5'>
                <h2 className='text-lg text-center text-indigo-700 font-semibold  '>KH ROOMS</h2>
                </div>

                <div className="about bg-white p-4 rounded flex items-start gap-3 flex-col mb-5">
                <div className='border border-black p-2 rounded'>
                <h2 className=' text-center font-semibold '>ABOUT</h2>
                </div>
                <p className='text-sm'>
                kUNDWA HEALTH is youth-led organization working with young people to decentralize health information and service they need to lead healthier lives through digital health means.it was founded in Gatsibo district by three young health activits,who were driven by the passion of tackling sexual & reproductive health and mental health issues through supporting adolescents and young people to have access to life-saving information and services on sexual and reproductive health,mental health and youth empowerment through mentorship.kUNDWA means “loved” it is name we choose for our organization which reflects how young people should be loved and cared for as the future of the nation. our intervention goal is to provide young people with different health tools including information and services they need in a fun and interactive way while promoting the usage of digital health means.
                </p>
                    </div>
            </div>

        </div>
        <Footer/>
    </div>
  )
}

export default OurTeamPage