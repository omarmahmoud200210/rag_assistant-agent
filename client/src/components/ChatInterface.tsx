import React, { useState, useEffect, useRef } from "react";
import { Send, User, Bot, Sparkles, Loader2 } from "lucide-react";
import { Card } from "./ui/Card";
import { toast } from "sonner";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/health");
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        content:
          data.content || data.message || "I'm sorry, I couldn't process that.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="flex flex-col h-[600px] max-w-4xl mx-auto p-0 overflow-hidden"
      glass
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-400" />
          </div>
          <div>
            <h4 className="text-white font-medium text-sm">RAG Assistant</h4>
            <div className="flex items-center gap-1.5">
              <span 
                className={`w-1.5 h-1.5 rounded-full ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                }`} 
              />
              <span 
                className={`text-[10px] uppercase tracking-wider font-bold ${
                  isOnline ? "text-emerald-500" : "text-slate-500"
                }`}
              >
                {isOnline ? "Online" : "Offline / Unreachable"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.role === "user"
                  ? "bg-primary-600"
                  : "bg-slate-800 border border-slate-700"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-primary-400" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                message.role === "user"
                  ? "bg-primary-600 text-white rounded-tr-none"
                  : "bg-slate-800/50 text-slate-200 border border-slate-700/50 rounded-tl-none"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-800 border border-slate-700">
              <Bot className="w-4 h-4 text-primary-400" />
            </div>
            <div className="bg-slate-800/50 text-slate-200 border border-slate-700/50 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
              <span className="text-xs text-slate-400 italic">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-slate-900/50 border-t border-slate-800"
      >
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || !isOnline}
            placeholder={
              !isOnline 
                ? "Connecting to AI server..." 
                : loading
                ? "Waiting for response..."
                : "Ask a question about the PDF..."
            }
            className="w-full bg-slate-800 border-slate-700 rounded-xl py-3 pl-4 pr-12 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || !isOnline}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:bg-slate-700 disabled:text-slate-500 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </Card>
  );
};
