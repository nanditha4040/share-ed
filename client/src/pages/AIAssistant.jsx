import { useState } from "react";
import api from "../api";

export default function AIAssistant() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Ask me anything about your subjects." }
  ]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setMessages(prev => [...prev, userMsg]);

    try {

      const res = await api.post("/ai/chat", {
        message: message
      });

      const aiMsg = {
        role: "ai",
        text: res.data.reply
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {

      setMessages(prev => [
        ...prev,
        { role: "ai", text: "AI error. Try again." }
      ]);

    }

    setMessage("");

  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-[70vh] flex flex-col">

      <h2 className="text-2xl font-semibold mb-4 text-slate-700">
        AI Assistant
      </h2>

      <div className="flex-1 space-y-3 mb-4 overflow-y-auto">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`p-3 rounded-xl max-w-[70%] ${
              msg.role === "user"
                ? "bg-blue-100 ml-auto"
                : "bg-slate-100"
            }`}
          >
            {msg.text}
          </div>

        ))}

      </div>

      <div className="flex gap-3">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Ask something..."
          className="flex-1 border rounded-xl p-3"
        />

        <button
          onClick={sendMessage}
          className="bg-slate-600 text-white px-4 rounded-xl"
        >
          Send
        </button>

      </div>

    </div>
  );
}