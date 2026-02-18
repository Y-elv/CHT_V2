import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { handleAuthError } from "../../utils/authErrorHandler";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  
  // Get auth store state + actions
  const { user: authUser, fetchProfile, logout } = useAuthStore();

  // Initialize user state from auth store / backend
  useEffect(() => {
    console.log("🔄 [CHAT PROVIDER] Initializing user state from auth store");
    
    // If auth store already has a user (from login with cookies), trust that first
    if (authUser) {
      console.log("✅ [CHAT PROVIDER] Using user from auth store:", authUser);
      setUser(authUser);
      return;
    }
    
    // Otherwise try to fetch profile from backend
    const initializeAuth = async () => {
      try {
        const result = await fetchProfile();
        
        if (result.success && result.user) {
          console.log("✅ [CHAT PROVIDER] User authenticated via profile:", result.user);
          setUser(result.user);
        } else {
          console.log("⚠️ [CHAT PROVIDER] User not authenticated");
          setUser(null);
        }
      } catch (error) {
        console.log("❌ [CHAT PROVIDER] Auth initialization failed:", error);
        
        // Handle authentication errors globally (401 etc.)
        if (handleAuthError(error, "chat provider initialization")) {
          setUser(null);
          return;
        }
        
        // For pure network issues, don't force logout; just leave user as null
        if (error.isNetworkError) {
          console.log("🌐 [CHAT PROVIDER] Network error while fetching profile; keeping existing auth store state.");
          return;
        }
        
        setUser(null);
      }
    };
    
    initializeAuth();
  }, [authUser, fetchProfile]);

  // Logout handler
  const logoutHandler = async () => {
    console.log("🚪 [CHAT PROVIDER] Logging out...");
    try {
      await logout();
      setUser(null);
      setSelectedChat(null);
      setChats([]);
      navigate("/login");
    } catch (error) {
      console.error("❌ [CHAT PROVIDER] Logout error:", error);
    }
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
