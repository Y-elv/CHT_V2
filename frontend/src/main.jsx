import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./components/Context/chatProvider.jsx";
import { AuthProvider } from "./contexts/AuthContext";

// ============================================
// [AUTH][APP INIT] Global App Initialization
// ============================================
console.log("============================================");
console.log("[AUTH][APP INIT] Application Starting");
console.log("[AUTH][APP INIT] Timestamp:", new Date().toISOString());
console.log("[AUTH][APP INIT] Environment:", import.meta.env.MODE || "development");
console.log("[AUTH][APP INIT] Node Environment:", import.meta.env.NODE_ENV || "development");
console.log("[AUTH][APP INIT] Current URL:", window.location.href);
console.log("[AUTH][APP INIT] Current Pathname:", window.location.pathname);

// Check initial auth state in localStorage
const initialToken = localStorage.getItem("token");
const initialChtToken = localStorage.getItem("cht_token");
const initialUserInfo = localStorage.getItem("userInfo");
const initialChtUser = localStorage.getItem("cht_user");
const initialBadgeStore = localStorage.getItem("badge-store");

console.log("[AUTH][APP INIT] Initial localStorage state:");
console.log("[AUTH][APP INIT] - token exists:", !!initialToken);
console.log("[AUTH][APP INIT] - token length:", initialToken?.length || 0);
console.log("[AUTH][APP INIT] - token preview:", initialToken ? `${initialToken.substring(0, 20)}...` : "null");
console.log("[AUTH][APP INIT] - cht_token exists:", !!initialChtToken);
console.log("[AUTH][APP INIT] - userInfo exists:", !!initialUserInfo);
console.log("[AUTH][APP INIT] - cht_user exists:", !!initialChtUser);
console.log("[AUTH][APP INIT] - badge-store exists:", !!initialBadgeStore);

// Check sessionStorage
const lastLoginTime = sessionStorage.getItem("lastLoginTime");
console.log("[AUTH][APP INIT] Initial sessionStorage state:");
console.log("[AUTH][APP INIT] - lastLoginTime:", lastLoginTime ? new Date(parseInt(lastLoginTime)).toISOString() : "null");

console.log("============================================");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
