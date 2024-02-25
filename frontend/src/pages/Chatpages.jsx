import React, { useEffect } from 'react'
import axios from "axios"

const Chatpages = () => {
 const FetchChats =async()=>{
    const data = await axios.get(
      "http://localhost:9000/api/chat"
    );
    console.log(data);
    
 }

 useEffect(()=>{
FetchChats();
 },[])
  return (
    <div>
      chatpage
    </div>
  )
}

export default Chatpages
