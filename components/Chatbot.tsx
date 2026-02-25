"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi Welcome to CarHub! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        throw new Error("No reply");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: " Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-125 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200">

          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">CarHub Assistant</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`text-sm px-4 py-2 rounded-xl max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {isLoading && (
              <div className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-xl w-fit">
                Typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cars, booking, filters..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;