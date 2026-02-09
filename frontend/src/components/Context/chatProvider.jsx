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
    // ============================================
    // [AUTH][RENDER] ChatProvider Mount
    // ============================================
    console.log("[AUTH][RENDER] ChatProvider component mounted");
    console.log("[AUTH][RENDER] Timestamp:", new Date().toISOString());
    
    const fetchData = async () => {
      try {
        console.log("[AUTH][STORAGE READ] ChatProvider: Reading user data from localStorage...");
        // Try new format first (cht_user)
        let userInfo = null;
        console.log("[AUTH][STORAGE READ] Reading 'cht_user'...");
        const chtUser = localStorage.getItem("cht_user");
        console.log("[AUTH][STORAGE READ] cht_user exists:", !!chtUser);
        
        if (chtUser) {
          try {
            userInfo = JSON.parse(chtUser);
            console.log("[AUTH][STORAGE READ] cht_user parsed successfully");
          } catch (e) {
            console.error("[AUTH][STORAGE READ] Error parsing cht_user:", e);
          }
        }
        
        // Fallback to old format (userInfo)
        if (!userInfo) {
          console.log("[AUTH][STORAGE READ] Reading 'userInfo' (fallback)...");
          const userInfoStr = localStorage.getItem("userInfo");
          console.log("[AUTH][STORAGE READ] userInfo exists:", !!userInfoStr);
          if (userInfoStr) {
            try {
              userInfo = JSON.parse(userInfoStr);
              console.log("[AUTH][STORAGE READ] userInfo parsed successfully");
            } catch (e) {
              console.error("[AUTH][STORAGE READ] Error parsing userInfo:", e);
            }
          }
        }
        
        if (!userInfo) {
          console.log("[AUTH][RENDER] ChatProvider: No user info found, setting user to null");
          setUser(null);
        } else {
          console.log("[AUTH][RENDER] ChatProvider: User info found, updating state");
          console.log("[AUTH][RENDER] ChatProvider: User email:", userInfo.email);
          console.log("[AUTH][RENDER] ChatProvider: User role:", userInfo.role);
          setUser(userInfo);
          setProfile(userInfo);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("[AUTH][RENDER] ChatProvider: Error parsing user information", error);
        setUser(null);
      }
    };

    fetchData();
    
    // Listen for storage events (when localStorage changes in other tabs/windows)
    const handleStorageChange = (e) => {
      console.log("[AUTH][STORAGE EVENT] Storage change detected");
      console.log("[AUTH][STORAGE EVENT] Key:", e.key);
      console.log("[AUTH][STORAGE EVENT] New value exists:", !!e.newValue);
      if (e.key === "userInfo" || e.key === "cht_user" || e.key === "cht_token" || e.key === "token") {
        console.log("[AUTH][STORAGE EVENT] Relevant key changed, fetching data...");
        fetchData();
      }
    };
    
    // Listen for custom event when user logs in (same tab)
    const handleUserUpdate = () => {
      console.log("[AUTH][STORAGE EVENT] 'userLoggedIn' event received");
      console.log("[AUTH][STORAGE EVENT] Fetching user data...");
      fetchData();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserUpdate);
    
    return () => {
      console.log("[AUTH][RENDER] ChatProvider component unmounting");
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserUpdate);
    };
  }, [setProfile, setIsLoggedIn]);

  const updateUser = (newUser) => {
    setUser(newUser);
  };


    const logoutHandler = () => {
      // ============================================
      // [AUTH][STORE] ChatProvider Logout
      // ============================================
      console.log("[AUTH][STORE] ChatProvider logoutHandler() called");
      console.log("[AUTH][STORAGE WRITE] Removing auth data...");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("cht_user");
      localStorage.removeItem("cht_token");
      localStorage.removeItem("token");
      setUser(null);
      setProfile(null);
      setIsLoggedIn(false);
      console.log("[AUTH][STORE] ChatProvider: Navigating to /login");
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
