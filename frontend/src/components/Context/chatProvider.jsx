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
    if (authUser) {
      setUser(authUser);
      return;
    }
    const initializeAuth = async () => {
      try {
        const result = await fetchProfile();
        if (result.success && result.user) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (handleAuthError(error, "chat provider initialization")) {
          setUser(null);
          return;
        }
        if (error.isNetworkError) return;
        setUser(null);
      }
    };
    initializeAuth();
  }, [authUser, fetchProfile]);

  const logoutHandler = async () => {
    try {
      await logout();
      setUser(null);
      setSelectedChat(null);
      setChats([]);
      navigate("/login");
    } catch (_error) {}
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
