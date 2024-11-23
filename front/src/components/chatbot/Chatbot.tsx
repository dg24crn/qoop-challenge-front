import React, { useState, useEffect } from "react";
import faq from "../../helpers/chatbot.helper";

const Chatbot: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [displayedAnswer, setDisplayedAnswer] = useState<string>("");
  const [fullAnswer, setFullAnswer] = useState<string>("");

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    const answer = faq.find((item) => item.question === question)?.answer || "";
    setFullAnswer(answer);
    setDisplayedAnswer("");
  };

  const handleBackClick = () => {
    setSelectedQuestion(null);
    setDisplayedAnswer("");
    setFullAnswer("");
  };

  useEffect(() => {
    if (fullAnswer) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < fullAnswer.length) {
          setDisplayedAnswer((prev) => prev + (fullAnswer[index] || ""));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 10);

      return () => clearInterval(interval);
    }
  }, [fullAnswer]);

  return (
    <div
      className="shadow-md rounded-lg p-6 w-full max-w-md mx-auto"
      style={{
        backgroundColor: "#1c2a3b",
        color: "#e1e3e6",
        paddingTop: "8px",
      }}
    >
      {/* Título principal "Managé" */}
      <div
        className="text-center"
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#e1e3e6",
          marginTop: "0px",
          marginBottom: "8px",
        }}
      >
        Managé
      </div>

      {/* Subtítulo "Chatbot" */}
      <h1
        className="text-lg font-semibold mb-4 text-center"
        style={{
          fontSize: "16px",
          color: "#e1e3e6",
        }}
      >
        Chatbot
      </h1>

      {selectedQuestion === null ? (
        <div>
          {faq.map((item, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(item.question)}
              className="w-full text-left p-3 my-2 rounded-md"
              style={{
                backgroundColor: "#35425e",
                color: "#e1e3e6",
              }}
            >
              {item.question}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <p className="mb-4">{displayedAnswer}</p>
          <button
            onClick={handleBackClick}
            className="p-2 rounded-md"
            style={{
              backgroundColor: "#586984",
              color: "#e1e3e6",
            }}
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
