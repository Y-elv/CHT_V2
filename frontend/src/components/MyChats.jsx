import React, { useState } from "react";
import { ChatState } from "./Context/chatProvider";
const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  return <div>my chats</div>;
  
};

export default MyChats;
