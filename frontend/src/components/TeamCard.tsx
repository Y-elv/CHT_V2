import React from 'react'
import Image from "../assets/alex.png"

function TeamCard() {
  return (
    <div className='flex flex-col relative m-3 tablet:w-[25%]   rounded-md my-5 group hover:scale-[1.01] transition-all'>

        <div className='deatils bg-white p-3 rounded-md flex flex-col gap-4 group-hover:shadow-md'>
        <div className='mt-[-15%] tablet:mt-[-20%] w-full flex items-center justify-center'>
            <img src={Image} alt="" className='object-contain group-hover:transition-transform group-hover:scale-[1.1] transition-all' />
        </div>
            <div className='flex items-center gap-3'>
                <p>Peter Nkusi</p>
            </div>
            <div className='flex flex-col  gap-1'>
                <p className='font-medium '>Contribution</p>
                <p className='text-sm '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit tempore laborum rerum excepturi explicabo magni dolore officia suscipit delectus quidem, non ipsum id eaque adipisci? Id obcaecati repellat laborum officia.</p>
            </div>
            <div className='flex items-center gap-3'>
                <p className='font-medium'>Email</p>
                <p className='font-medium'>myemail@gmail.com</p>
            </div>
        </div>
    </div>
  )
}

export default TeamCard