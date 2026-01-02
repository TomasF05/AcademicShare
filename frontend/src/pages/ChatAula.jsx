import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const ChatAula = ({ aulaId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();
  const counterRef = useRef(0);
  const messagesEndRef = useRef(null); 
  const isFirstLoad = useRef(true); // Para controlar o primeiro scroll

  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = import.meta.env.VITE_API_URL;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // 1. Efeito para carregar histórico e configurar Socket
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/aulas/${aulaId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        }
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      }
    };

    fetchHistory();

    socketRef.current = io(BACKEND_URL, {
      query: { aulaId },
      auth: { serverOffset: 0 } 
    });

    socketRef.current.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [aulaId, API_URL, BACKEND_URL]);

  // 2. Efeito para controlar o Scroll Inteligente
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];


      if (isFirstLoad.current) {
        scrollToBottom("auto"); 
        isFirstLoad.current = false;
      } 
      
      else if (lastMessage.user === user.id) {
        scrollToBottom("smooth");
      }
 
    }
  }, [messages, user.id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const sId = socketRef.current?.id || "no-id";
    const clientOffset = `${sId}-${counterRef.current++}-${Date.now()}`;

    const msgData = {
      texto: input,
      userName: user.name,
      userId: user.id,
      aulaId: aulaId
    };

    socketRef.current.emit("chat message", msgData, clientOffset, () => {
      setInput("");
    });
  };

  return (
    <div className="chat-aula-container" style={{ 
        display: "flex", flexDirection: "column", 
        height: "calc(100vh - 350px)", maxWidth: "100%", 
        background: "#ffffff", borderRadius: "8px", border: "1px solid #e0e0e0", overflow: "hidden" 
    }}>
      <div className="chat-messages" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {messages.map((m, index) => {
          const isMe = m.user === user.id;
          return (
            <div key={m._id || index} style={{ 
                display: "flex", padding: "10px 20px", gap: "15px", borderBottom: "1px solid #f5f5f5",
                background: isMe ? "transparent" : "transparent" 
            }}>
              <div style={{ 
                  width: "38px", height: "38px", borderRadius: "4px", 
                  background: isMe ? "#2b4d8f" : "#e0e0e0", 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  color: isMe ? "white" : "#666", fontWeight: "bold", flexShrink: 0 
              }}>
                {m.userName?.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "2px" }}>
                  <span style={{ color: isMe ? "#2b4d8f" : "#333", fontWeight: "700", fontSize: "14px" }}>
                    {m.userName} {isMe && "(Eu)"}
                  </span>
                  <span style={{ color: "#999", fontSize: "11px" }}>
                    {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                  </span>
                </div>
                <div style={{ color: "#444", fontSize: "15px", lineHeight: "1.5", wordBreak: "break-word" }}>
                  {m.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ padding: "15px 20px", background: "#fff", borderTop: "1px solid #eee" }}>
        <div style={{ display: "flex", background: "#f9f9f9", borderRadius: "6px", padding: "2px 12px", alignItems: "center", border: "1px solid #ddd" }}>
          <input 
            style={{ flex: 1, background: "transparent", border: "none", color: "#333", padding: "12px 0", outline: "none", fontSize: "15px" }} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Escreve a tua dúvida aqui..." 
          />
          <button type="submit" style={{ background: "none", border: "none", color: "#2b4d8f", fontWeight: "800", cursor: "pointer", fontSize: "13px" }}>
            ENVIAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatAula;