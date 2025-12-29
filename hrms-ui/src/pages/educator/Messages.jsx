import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaUserGraduate,
  FaUsers,
  FaPaperPlane,
  FaSearch,
} from "react-icons/fa";

/* ===============================
   MESSAGES – EDUCATOR
================================ */

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);

  /* ===== INIT (API READY) ===== */
  useEffect(() => {
    // Replace with API / WebSocket
    setConversations([
      {
        id: 1,
        type: "student",
        name: "Ravi Kumar",
        messages: [
          { from: "student", text: "Sir, is today's class recorded?" },
          { from: "educator", text: "Yes, I will share the link." },
        ],
      },
      {
        id: 2,
        type: "student",
        name: "Sneha Reddy",
        messages: [
          { from: "student", text: "Can you explain React hooks again?" },
        ],
      },
      {
        id: 3,
        type: "batch",
        name: "Full Stack Jan 2025",
        messages: [
          {
            from: "educator",
            text: "Assignment 2 deadline is Friday.",
          },
        ],
      },
    ]);
  }, []);

  /* ===== Auto Scroll ===== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                { from: "educator", text: message },
              ],
            }
          : c
      )
    );

    setMessage("");
  };

  const currentChat = useMemo(
    () => conversations.find((c) => c.id === activeChat?.id),
    [conversations, activeChat]
  );

  /* ===============================
     UI
  ================================ */

  return (
    <div className="max-w-7xl mx-auto h-[75vh] grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* ===== Conversations ===== */}
      <div
        className="md:col-span-1 rounded-2xl
        bg-white/60 backdrop-blur-xl border shadow-lg
        flex flex-col"
      >
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-2">Messages</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 rounded-xl
                bg-white/70 border focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChat(c)}
              className={`w-full text-left px-4 py-3 border-b
                hover:bg-white/70 transition
                ${
                  activeChat?.id === c.id
                    ? "bg-white/80"
                    : ""
                }`}
            >
              <div className="flex items-center gap-3">
                {c.type === "batch" ? (
                  <FaUsers className="text-purple-600" />
                ) : (
                  <FaUserGraduate className="text-purple-600" />
                )}
                <span className="font-medium">{c.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Chat Area ===== */}
      <div
        className="md:col-span-3 rounded-2xl
        bg-white/60 backdrop-blur-xl border shadow-lg
        flex flex-col"
      >
        {currentChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b font-semibold">
              {currentChat.name}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentChat.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[75%] px-4 py-2 rounded-xl text-sm
                    ${
                      m.from === "educator"
                        ? "ml-auto bg-purple-600 text-white"
                        : "bg-white border"
                    }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full
                  bg-white/70 border focus:outline-none"
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
              />
              <button
                onClick={sendMessage}
                className="px-5 py-2 rounded-full
                  bg-purple-600 text-white hover:bg-purple-700"
              >
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
