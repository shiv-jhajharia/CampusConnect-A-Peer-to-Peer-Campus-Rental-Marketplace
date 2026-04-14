import React from "react";

export default function Modal({ isOpen, onClose, onConfirm, title, description, confirmText = "Confirm", type = "danger" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100]">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md relative transform scale-95 animate-[fadeIn_0.2s_ease-out_forwards] shadow-2xl border border-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-4 mb-4">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
             type === "danger" ? "bg-rose-100 text-rose-500" : "bg-blue-100 text-blue-500"
           }`}>
              {type === "danger" ? "⚠️" : "ℹ️"}
           </div>
           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
             {title || "Confirm Action"}
           </h2>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          {description || "Are you sure you want to proceed with this action?"}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border-2 border-slate-200 font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if(onConfirm) onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 font-bold text-white rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 ${
               type === "danger" ? "bg-rose-500 hover:shadow-rose-500/30" : "bg-blue-600 hover:shadow-blue-500/30"
            }`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}