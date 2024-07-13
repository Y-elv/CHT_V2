import React from 'react'

function NewsCard(props) {
  return (
    <div className="p-1 tablet:p-3 flex flex-row  mt-[20%] items-start bg-white my-3 w-full tablet:w-[70%] border tablet:gap-5 rounded">
    <div className="w-[35%] tablet:w-[30%] translate-x-[-25%] translate-y-[-25%]  h-[200px] tablet:h-[200px]">
        <img src={props.Image} alt="" className="object-fill h-full" />
      </div>

      <div className="w-[90%] tablet:w-[85%]">
        <p className="my-3 leading:5 tablet:leading-6 self-start text-xs tablet:text-sm ">
         {props.paragraph}
        </p>
      </div>
    </div>
  )
}

export default NewsCard