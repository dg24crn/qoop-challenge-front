import React, { useState } from "react";
import Chatbot from "../chatbot/Chatbot";

const ChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="fixed bottom-4 right-4"
      style={{ zIndex: 1000 }}
    >
      <button
        onClick={handleToggleChat}
        className="p-3 rounded-full"
        style={{
          backgroundColor: "#35425e",
          color: "#e1e3e6",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "#586984")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "#35425e")
        }
      >
        🤖
      </button>
      {isOpen && (
        <div
          className="fixed bottom-16 right-4 w-80 shadow-lg rounded-lg p-4"
          style={{
            backgroundColor: "#1c2a3b",
            color: "#e1e3e6",
          }}
        >
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default ChatButton;
