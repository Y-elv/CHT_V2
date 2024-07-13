/* eslint-disable react/prop-types */
import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { BsTelephoneFill } from "react-icons/bs";

function ServicesCard(props) {
  return (
    <div className={props.reverse ?
       "container min-h-[30%] flex flex-col tablet:flex-row-reverse items-start bg-whiteu my-3 w-full tablet:w-[75%] border-bottom border-white gap-5 py-3":
    "container min-h-[30%] flex flex-col tablet:flex-row items-start bg-whiteu my-3 w-full tablet:w-[70%] border-bottom border-white gap-5 py-3"}>
    <div className="ml-[-10px] h-[200px] w-[200px]  tablet:h-[400px] tablet:w-[400px]">
      <img src={props.Image} alt="" className="object-cover h-full" />
    </div>

    <div className=" w-[85%] tablet:w-[75%]">
      <p className="my-3 tablet:leading-6 self-start text-sm tablet:text-base">
       {props.paragraph}
      </p>

      <div className='flex flex-col my-3 justify-center gap-2'>
        <div className='flex items-center gap-1'>
          <FaLocationDot className='text-xl text-gray-500'/>
          <p className='text-xs'>Curent Location: {props.Location}</p>
        </div>
        <div className='flex items-center gap-1'>
          <IoMdHome className='text-xl text-gray-500'/>
          <p className='text-xs'>{props.Email}</p>
        </div>
        <div className='flex items-center gap-1'>
          <BsTelephoneFill className='text-xl text-gray-500'/>
          <p className='text-xs'>{props.Tel}</p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ServicesCard