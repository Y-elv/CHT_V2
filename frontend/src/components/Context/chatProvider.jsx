import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBadgeStore } from "../../zustandStore/store";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const setIsLoggedIn = useBadgeStore((state) => state.setIsLoggedIn);
  const setProfile = useBadgeStore((state) => state.setProfile);

 useEffect(() => {
    console.log("ChatProvider useEffect triggered");
   const fetchData = async () => {
     try {
       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      

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

  const updateUser = (newUser) => {
    setUser(newUser);
  };


    const logoutHandler = () => {
      localStorage.removeItem("userInfo");
      setUser(null);
      setProfile(null)
      setIsLoggedIn(false)
      navigate("/login");
    };

  const contextValue = {
    user,
    setUser: updateUser,
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
