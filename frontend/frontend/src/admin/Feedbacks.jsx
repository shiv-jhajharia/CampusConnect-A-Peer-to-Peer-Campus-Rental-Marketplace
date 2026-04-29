import React, { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

const Star = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
       className={`w-4 h-4 ${active ? "text-amber-400 fill-amber-400" : "text-slate-700 fill-transparent"}`}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await apiFetch("/feedbacks/all");
        setFeedbacks(data);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const averageRating = feedbacks.length 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-dark p-8 rounded-3xl">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Customer <span className="text-blue-400">Feedback</span></h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Review insights and ratings from your users.</p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl shadow-lg">
              💬
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Reviews</p>
              <p className="text-2xl font-black text-white">{feedbacks.length}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shadow-lg">
              ⭐
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-white">{averageRating}</p>
                <span className="text-sm font-bold text-slate-500">/ 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Feedback List ── */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="glass-dark p-12 rounded-3xl text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center text-4xl mb-2">📭</div>
          <h3 className="text-xl font-bold text-slate-200">No feedback yet.</h3>
          <p className="text-slate-400 text-sm">When users submit feedback, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((item) => (
            <div key={item.id} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 hover:bg-slate-800/80 hover:border-slate-600 transition-all shadow-xl group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                    {item.user_name?.[0] || "?"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm">{item.user_name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1 bg-slate-900/50 px-2.5 py-1.5 rounded-full border border-slate-700/50">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} active={item.rating >= star} />
                  ))}
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 h-32 overflow-y-auto custom-scrollbar">
                {item.comment ? (
                  <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                    "{item.comment}"
                  </p>
                ) : (
                  <p className="text-sm text-slate-600 italic">No comment provided.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
