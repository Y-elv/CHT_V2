import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./components/Context/chatProvider.jsx";

// ============================================
// [APP INIT] Global App Initialization
// ============================================
console.log("============================================");
console.log("[APP INIT] Application Starting");
console.log("[APP INIT] Timestamp:", new Date().toISOString());
console.log("[APP INIT] Environment:", import.meta.env.MODE || "development");
console.log("[APP INIT] Current URL:", window.location.href);
console.log("[APP INIT] Current Pathname:", window.location.pathname);
console.log("============================================");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>
);
