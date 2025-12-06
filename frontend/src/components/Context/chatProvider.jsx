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

  // Listen for localStorage changes to update user state immediately after login
  useEffect(() => {
    console.log("ChatProvider useEffect triggered");
    const fetchData = async () => {
      try {
        // Try new format first (cht_user)
        let userInfo = null;
        const chtUser = localStorage.getItem("cht_user");
        
        if (chtUser) {
          try {
            userInfo = JSON.parse(chtUser);
          } catch (e) {
            console.error("Error parsing cht_user:", e);
          }
        }
        
        // Fallback to old format (userInfo)
        if (!userInfo) {
          const userInfoStr = localStorage.getItem("userInfo");
          if (userInfoStr) {
            try {
              userInfo = JSON.parse(userInfoStr);
            } catch (e) {
              console.error("Error parsing userInfo:", e);
            }
          }
        }
        
        if (!userInfo) {
          setUser(null);
        } else {
          setUser(userInfo);
          setProfile(userInfo);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error parsing user information", error);
        setUser(null);
      }
    };

    fetchData();
    
    // Listen for storage events (when localStorage changes in other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === "userInfo" || e.key === "cht_user" || e.key === "cht_token") {
        fetchData();
      }
    };
    
    // Listen for custom event when user logs in (same tab)
    const handleUserUpdate = () => {
      fetchData();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserUpdate);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserUpdate);
    };
  }, [setProfile, setIsLoggedIn]);

  const updateUser = (newUser) => {
    setUser(newUser);
  };


    const logoutHandler = () => {
      // Remove all auth-related data
      localStorage.removeItem("userInfo");
      localStorage.removeItem("cht_user");
      localStorage.removeItem("cht_token");
      setUser(null);
      setProfile(null);
      setIsLoggedIn(false);
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
