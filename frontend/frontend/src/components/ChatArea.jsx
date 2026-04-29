import React, { useState, useEffect, useRef } from "react";
import { apiFetch } from "../utils/api";

const Icons = {
  Send: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  ),
  X: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  ),
  ArrowLeft: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  ),
  Hand: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
    </svg>
  )
};

export default function ChatArea({ isOpen, onClose, onBack, partnerId, partnerName, productId, productName }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !partnerId) return;
    const fetchThread = async () => {
      try {
        const data = await apiFetch(`/messages/thread/${partnerId}?product_id=${productId || ""}`);
        setMessages(data);
      } catch (err) {
        console.error("Chat fetch error:", err);
      }
    };
    fetchThread();
    const interval = setInterval(fetchThread, 5000);
    return () => clearInterval(interval);
  }, [isOpen, partnerId, productId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;
    setSending(true);
    try {
      const newMsg = await apiFetch("/messages", {
        method: "POST",
        body: { receiver_id: partnerId, product_id: productId || "general", text: inputText.trim() }
      });
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
    } catch (err) {
      alert("Failed to send message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-[100] border-l border-slate-100 flex flex-col transform transition-transform animate-slideIn">
      <div className="p-5 border-b border-slate-50 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-8 h-8 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all group active:scale-90 mr-1" title="Back to Inbox">
              <Icons.ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100 uppercase tracking-tighter">
            {partnerName?.[0] || "?"}
          </div>
          <div>
            <h3 className="font-black text-slate-800 leading-tight tracking-tight uppercase text-xs">{partnerName}</h3>
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-0.5 opacity-70">Context: {productName || "Inquiry"}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-all group active:scale-90">
          <Icons.X className="w-4 h-4 group-hover:text-slate-900" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <Icons.Hand className="w-12 h-12 mb-4 text-slate-400 stroke-[1.5]" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Start a Secure Conversation</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender_id !== partnerId;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${isMe ? "bg-slate-900 text-white rounded-tr-none" : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"}`}>
                  {m.text}
                  <div className={`text-[8px] mt-1 font-black uppercase opacity-40 ${isMe ? "text-right" : "text-left"}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="p-5 border-t border-slate-50 bg-white">
        <div className="relative flex items-center gap-2">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type your inquiry..." className="flex-1 py-4 px-5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold placeholder-slate-400" />
          <button type="submit" disabled={!inputText.trim() || sending} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${!inputText.trim() || sending ? "bg-slate-100 text-slate-300" : "bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95"}`}>
            {sending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Icons.Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}
