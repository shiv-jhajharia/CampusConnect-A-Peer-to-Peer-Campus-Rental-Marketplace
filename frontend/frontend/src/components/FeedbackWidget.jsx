import React, { useState } from "react";
import { apiFetch } from "../utils/api";

const Icons = {
  Star: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  MessageCircle: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  X: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  )
};

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/feedbacks/submit", {
        method: "POST",
        body: { rating, comment }
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setRating(0);
        setComment("");
      }, 2000);
    } catch (err) {
      alert(`Failed to submit feedback: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Floating Feedback Button ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-28 md:bottom-8 md:right-32 z-40 w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 group border-4 border-white"
        title="Give Feedback"
      >
        <Icons.MessageCircle className="w-7 h-7 drop-shadow-md group-hover:-translate-y-1 transition-transform duration-300" />
      </button>

      {/* ── Feedback Modal ── */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => !submitting && setIsOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-slideIn">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center transition-all"
            >
              <Icons.X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Star className="w-8 h-8 text-emerald-500 fill-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Thank You!</h3>
                <p className="text-sm font-medium text-slate-500 mt-2">Your feedback helps us improve.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">
                  How are we doing?
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                  Share your experience
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                      Rate your experience
                    </label>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Icons.Star 
                            className={`w-10 h-10 transition-colors ${
                              (hoverRating || rating) >= star 
                                ? "text-amber-400 fill-amber-400 drop-shadow-sm" 
                                : "text-slate-200 fill-slate-50"
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Area */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      Tell us more (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What do you love? What could we improve?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none h-28"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className={`w-full py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all shadow-lg ${
                      submitting || rating === 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-emerald-600 text-white shadow-emerald-500/30 hover:bg-emerald-500 active:scale-95"
                    }`}
                  >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
