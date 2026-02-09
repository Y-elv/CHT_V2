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
  
  // Get auth store functions
  const { fetchProfile, logout } = useAuthStore();

  // Initialize user state from auth store
  useEffect(() => {
    console.log("🔄 [CHAT PROVIDER] Initializing user state from auth store");
    
    // Try to fetch user profile if not in store
    const initializeAuth = async () => {
      try {
        const result = await fetchProfile();
        
        if (result.success && result.user) {
          console.log("✅ [CHAT PROVIDER] User authenticated:", result.user);
          setUser(result.user);
        } else {
          console.log("⚠️ [CHAT PROVIDER] User not authenticated");
          setUser(null);
        }
      } catch (error) {
        console.log("❌ [CHAT PROVIDER] Auth initialization failed:", error);
        
        // Handle authentication errors globally
        if (handleAuthError(error, "chat provider initialization")) {
          // Auth error was handled globally
          setUser(null);
          return;
        }
        
        // For other errors, just set user to null
        setUser(null);
      }
    };
    
    initializeAuth();
  }, [fetchProfile]);

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
