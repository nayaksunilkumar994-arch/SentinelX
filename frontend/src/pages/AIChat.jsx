import { useEffect, useRef, useState } from "react";
import axios from "axios";

// ==========================================================
// SENTINELX AI CHAT API
// ==========================================================

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================================
// ATTACH JWT AUTHENTICATION
// ==========================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "sentinelx_access_token"
    );

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================================
// AI CHAT COMPONENT
// ==========================================================

function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm SentinelX AI Security Assistant. Ask me any cybersecurity-related question.",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const chatEndRef = useRef(null);

  // ========================================================
  // AUTO-SCROLL TO NEWEST MESSAGE
  // ========================================================

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ========================================================
  // SEND MESSAGE
  // ========================================================

  const sendMessage = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      text: trimmedQuestion,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await API.post(
        "/chat/ask",
        {
          question: trimmedQuestion,
        }
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          text: response.data.answer,
        },
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "error",
          text:
            "Unable to connect to SentinelX AI. Please make sure the backend server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // ENTER KEY HANDLER
  // ========================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ========================================================
  // CLEAR CHAT
  // ========================================================

  const clearChat = () => {
    setMessages([
      {
        role: "ai",
        text:
          "Chat cleared. How can I help you with cybersecurity?",
      },
    ]);

    setCopiedIndex(null);
  };

  // ========================================================
  // COPY MESSAGE
  // ========================================================

  const copyMessage = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedIndex(index);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)",
        minHeight: "500px",
        color: "#ffffff",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
          gap: "15px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #2563eb, #06b6d4)",
                fontSize: "21px",
              }}
            >
              🛡️
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "27px",
                  fontWeight: "700",
                }}
              >
                SentinelX AI Chat
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  marginTop: "5px",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />

                AI Security Assistant Online
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={clearChat}
          style={{
            background: "#0f172a",
            color: "#cbd5e1",
            border: "1px solid #263449",
            borderRadius: "9px",
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          🗑 Clear Chat
        </button>
      </div>

      {/* Chat Container */}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background:
            "linear-gradient(180deg, #080d1d 0%, #050816 100%)",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "22px",
          boxShadow:
            "0 10px 35px rgba(0,0,0,0.25)",
        }}
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          const isError = message.role === "error";

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isUser
                  ? "flex-end"
                  : "flex-start",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  maxWidth: "78%",
                  flexDirection: isUser
                    ? "row-reverse"
                    : "row",
                }}
              >
                {/* Avatar */}

                <div
                  style={{
                    minWidth: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isUser
                      ? "#2563eb"
                      : isError
                      ? "#7f1d1d"
                      : "#0e7490",
                    fontSize: "15px",
                  }}
                >
                  {isUser
                    ? "👤"
                    : isError
                    ? "⚠️"
                    : "🤖"}
                </div>

                {/* Message */}

                <div>
                  <div
                    style={{
                      background: isUser
                        ? "#2563eb"
                        : isError
                        ? "#3f1010"
                        : "#0f172a",
                      border: isUser
                        ? "none"
                        : `1px solid ${
                            isError
                              ? "#7f1d1d"
                              : "#1e293b"
                          }`,
                      borderRadius: "13px",
                      padding: "13px 16px",
                      lineHeight: "1.65",
                      color: "#e2e8f0",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                        color: isUser
                          ? "#dbeafe"
                          : isError
                          ? "#fca5a5"
                          : "#22d3ee",
                      }}
                    >
                      {isUser
                        ? "YOU"
                        : isError
                        ? "SYSTEM"
                        : "SENTINELX AI"}
                    </div>

                    {message.text}
                  </div>

                  {/* Copy button */}

                  {!isUser && !isError && (
                    <button
                      onClick={() =>
                        copyMessage(
                          message.text,
                          index
                        )
                      }
                      style={{
                        marginTop: "6px",
                        background: "transparent",
                        border: "none",
                        color:
                          copiedIndex === index
                            ? "#22c55e"
                            : "#64748b",
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "2px 5px",
                      }}
                    >
                      {copiedIndex === index
                        ? "✓ Copied"
                        : "📋 Copy"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading */}

        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#22d3ee",
              fontSize: "13px",
              padding: "8px 0",
            }}
          >
            <span>🤖</span>

            <span>
              SentinelX AI is analyzing your question...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}

      <div
        style={{
          marginTop: "14px",
          display: "flex",
          gap: "10px",
          padding: "8px",
          background: "#080d1d",
          border: "1px solid #1e293b",
          borderRadius: "13px",
        }}
      >
        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask a cybersecurity question..."
          rows={2}
          style={{
            flex: 1,
            resize: "none",
            background: "transparent",
            color: "#ffffff",
            border: "none",
            padding: "10px",
            outline: "none",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={
            loading || !question.trim()
          }
          style={{
            alignSelf: "stretch",
            minWidth: "90px",
            border: "none",
            borderRadius: "9px",
            background:
              loading || !question.trim()
                ? "#1e293b"
                : "linear-gradient(135deg, #2563eb, #0891b2)",
            color: "#ffffff",
            cursor:
              loading || !question.trim()
                ? "not-allowed"
                : "pointer",
            fontWeight: "700",
          }}
        >
          {loading ? "..." : "Send ➤"}
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#475569",
          fontSize: "11px",
          marginTop: "8px",
        }}
      >
        SentinelX AI is designed for
        cybersecurity-related questions and
        authorized security research.
      </div>
    </div>
  );
}

export default AIChat;