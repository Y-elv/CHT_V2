import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogics";
import { ChatState } from "./Context/chatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const SCrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} style={{ display: "flex" }}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={m.sender.name}
                placeholder="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                background:
                  m.sender._id === user._id
                    ? "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)"
                    : "#ffffff",
                color: m.sender._id === user._id ? "#fff" : "#1a202c",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "8px 16px",
                maxWidth: "75%",
                border:
                  m.sender._id === user._id
                    ? "none"
                    : "1px solid rgba(247,148,29,0.35)",
                boxShadow:
                  m.sender._id === user._id
                    ? "0 2px 8px rgba(247,148,29,0.3)"
                    : "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default SCrollableChat;
