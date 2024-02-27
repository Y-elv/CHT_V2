import React from "react";
import { ChatState } from "./Context/chatProvider";

const ChatBox = () => {
  const { selectedChat } = ChatState();
  return <div>chat box</div>;
};

export default ChatBox;
