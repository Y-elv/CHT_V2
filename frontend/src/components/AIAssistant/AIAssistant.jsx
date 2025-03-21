import React, { useState, useEffect, useRef } from "react";
import { RiSendPlaneFill } from "react-icons/ri";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatboxRef = useRef(null);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatHistory([...chatHistory, { sender: "user", text: message }]);

      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `Thanks for your message: "${message}". Our AI is processing your request.`,
          },
        ]);
      }, 1000);

      setMessage("");
    }
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="fixed bottom-6 right-6 z-50 border border-red-500 p-2">
      {!isOpen && (
        <button
          onClick={toggleChatbox}
          className="bg-[#F95700FF] text-black font-bold rounded-full p-2 shadow-lg hover:bg-[#e04e00] transition-all duration-300 flex items-center justify-center h-10 w-10 border border-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.611L5 14.5"
            />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden border border-red-500 flex flex-col h-[400px]">
          <div className="bg-[#F95700FF] text-black p-4 relative border border-red-500">
            <h3 className="font-bold">AI Assistant</h3>
            <p className="text-sm">How can I help you today?</p>
            <button
              onClick={toggleChatbox}
              className="absolute top-3 right-3 text-black hover:text-gray-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div
            ref={chatboxRef}
            className="p-4 flex-1 overflow-y-auto bg-gray-50 border border-red-500"
          >
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 text-center italic text-sm">
                Start a conversation with our AI assistant.
              </p>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[80%] border border-red-500 ${
                    msg.sender === "user"
                      ? "bg-blue-100 ml-auto text-right"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Input field with icon inside */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-200 flex gap-2 border border-red-500"
          >
            <div className="relative flex items-center w-[90%] md:w-[70%] lg:w-[60%]">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-3 py-[3px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F95700FF] text-sm pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 bg-[#F95700FF] text-black p-1 rounded-lg hover:bg-[#e04e00] h-8 w-8 flex items-center justify-center border border-red-500"
              >
                <RiSendPlaneFill className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
