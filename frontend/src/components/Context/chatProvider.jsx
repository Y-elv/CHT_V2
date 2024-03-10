import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
    console.log("ChatProvider useEffect triggered");
   const fetchData = async () => {
     try {
       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
       console.log("User Info from localStorage:", userInfo);

       if (!userInfo) {
         navigate("/home");
       } else {
         setUser(userInfo);
       }
     } catch (error) {
       console.error("Error parsing user information", error);
       
     }
   };

   fetchData(); 
 }, []);


    const logoutHandler = () => {
      localStorage.removeItem("userInfo");
      setUser(null);
      navigate("/login");
    };

  const contextValue = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    logoutHandler,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
