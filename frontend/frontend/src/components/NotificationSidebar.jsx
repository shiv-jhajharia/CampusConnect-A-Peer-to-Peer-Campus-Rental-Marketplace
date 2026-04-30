import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const Icons = {
  Bell: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  X: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  ),
  MessageSquare: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Trash: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  )
};

export default function NotificationSidebar({ onOpenChat, isOpen, setIsOpen }) {
  const [inbox, setInbox] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const data = await apiFetch("/messages/inbox");
        setInbox(data);
      } catch (err) {
        console.error("Error fetching inbox:", err);
      }
    };
    
    // Fetch immediately, then every 5 seconds
    fetchInbox();
    const interval = setInterval(fetchInbox, 5000);
    return () => clearInterval(interval);
  }, []);

  const initiateDelete = (e, partnerId) => {
    e.stopPropagation();
    setConfirmDeleteId(partnerId);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  const confirmDelete = async (e, partnerId) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
    setIsDeletingId(partnerId);
    
    // Aesthetic deletion animation delay
    setTimeout(async () => {
      try {
        await apiFetch(`/messages/conversation/${partnerId}?t=${Date.now()}`, { method: "DELETE" });
        setInbox((prev) => prev.filter((item) => item.user_id !== partnerId));
      } catch (err) {
        alert("Failed to delete conversation: " + err.message);
      } finally {
        setIsDeletingId(null);
      }
    }, 400); // Match CSS transition duration
  };

  const totalUnread = inbox.reduce((sum, item) => sum + (item.unread_count || 0), 0);

  return (
    <>
      {/* ── Floating Bell Button ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 group border-4 border-white"
        title="View Messages"
      >
        <Icons.Bell className="w-7 h-7 group-hover:animate-revolve drop-shadow-md" />
        
        {/* Red Unread Badge */}
        {totalUnread > 0 && (
          <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[11px] font-black w-7 h-7 flex items-center justify-center rounded-full border-[3px] border-white shadow-lg animate-pulse">
            {totalUnread > 99 ? '99+' : totalUnread}
          </span>
        )}
      </button>

      {/* ── Sidebar Backdrop ── */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar Panel ── */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white/95 backdrop-blur-3xl shadow-2xl z-[101] border-l border-slate-100 transform transition-transform duration-500 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
              Messages
              {totalUnread > 0 && (
                <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">
                  {totalUnread} New
                </span>
              )}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Customer Chats & Queries
            </p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-all active:scale-90"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Inbox List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {inbox.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-8">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Icons.MessageSquare className="w-8 h-8 text-slate-300 stroke-2" />
              </div>
              <p className="text-sm font-bold text-slate-500">No messages yet.</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-2">
                When customers reach out, queries will appear here.
              </p>
            </div>
          ) : (
            inbox.map((item) => {
              const isUnread = item.unread_count > 0;
              return (
                <div
                  key={item.user_id}
                  className={`transition-all duration-400 ease-in-out overflow-hidden transform ${
                    isDeletingId === item.user_id 
                      ? "opacity-0 scale-90 -translate-x-full h-0 mb-0 border-0 p-0" 
                      : "h-auto mb-3 opacity-100 scale-100 translate-x-0"
                  }`}
                >
                  <div
                    onClick={() => {
                      if (confirmDeleteId === item.user_id) return;
                      setIsOpen(false);
                      onOpenChat({
                        partnerId: item.user_id,
                        partnerName: item.user_name,
                        productId: "",
                        productName: "General Inquiry"
                      });
                    }}
                  className={`group relative border rounded-3xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 ${
                    isUnread
                      ? "bg-white border-blue-200 shadow-lg shadow-blue-500/10 hover:border-blue-400 hover:shadow-blue-500/20"
                      : "bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border uppercase tracking-tighter shrink-0 transition-all ${
                    isUnread
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-600 shadow-inner group-hover:scale-110"
                      : "bg-slate-50 text-slate-600 border-slate-200 group-hover:bg-slate-100 group-hover:text-slate-900 group-hover:scale-110"
                  }`}>
                    {item.user_name?.[0] || "?"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className={`text-sm truncate ${isUnread ? "font-black text-slate-900" : "font-bold text-slate-700"}`}>
                        {item.user_name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-widest shrink-0 ${isUnread ? "text-blue-600" : "text-slate-400"}`}>
                          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        {confirmDeleteId !== item.user_id && (
                          <button
                            onClick={(e) => initiateDelete(e, item.user_id)}
                            className="w-6 h-6 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0"
                            title="Delete Conversation"
                          >
                            <Icons.Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs truncate ${isUnread ? "font-bold text-slate-800" : "text-slate-500 font-medium"}`}>
                      {item.last_message}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {isUnread && (
                    <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shrink-0 shadow-md animate-pulse">
                      <span className="text-[10px] font-black text-white">{item.unread_count}</span>
                    </div>
                  )}

                  {/* Inline Confirmation UI */}
                  {confirmDeleteId === item.user_id && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex items-center justify-center gap-3 z-10 border border-rose-100 transition-opacity duration-300">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-widest hidden sm:block mr-1">Delete?</span>
                      <button 
                        onClick={(e) => cancelDelete(e)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={(e) => confirmDelete(e, item.user_id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all hover:scale-105 active:scale-95"
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
