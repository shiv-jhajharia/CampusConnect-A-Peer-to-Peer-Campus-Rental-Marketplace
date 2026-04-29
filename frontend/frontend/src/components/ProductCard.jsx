import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Icons ──
const Icons = {
  Pencil: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
    </svg>
  ),
  Trash: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  ),
  Message: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Lock: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Star: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Eye: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
};

export default function ProductCard({ product, isOwner = false, onDelete, onEdit, onChat, inSlider = false }) {
  const navigate = useNavigate();
  const isAvailable = product.availability_status;
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0); 

  const imageList = (() => {
    const urls = product.image_urls;
    if (Array.isArray(urls) && urls.length > 0) return urls;
    if (product.image_url) return [product.image_url];
    return ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=500&q=80"];
  })();

  const hasMultipleImages = imageList.length > 1;

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (!confirmOpen) { setConfirmOpen(true); return; }
    setDeleting(true);
    try { await onDelete(product.id || product._id); }
    catch (err) { alert("Failed to delete product"); }
    finally { setDeleting(false); setConfirmOpen(false); }
  };

  const nextImg = (e) => { e.stopPropagation(); setImgIndex((prev) => (prev + 1) % imageList.length); };
  const prevImg = (e) => { e.stopPropagation(); setImgIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1)); };

  return (
    <div 
      className={`group relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden transition-all duration-500 flex ${
        inSlider 
          ? "flex-col md:flex-row w-full h-full shadow-lg border-white/50" 
          : "flex-col h-[480px] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100/30"
      }`}
    >
      {/* ── Visual Section ── */}
      <div className={`relative overflow-hidden bg-slate-50 shrink-0 ${
        inSlider ? "w-full md:w-2/5 h-48 md:h-full border-b md:border-b-0 md:border-r border-slate-50" : "w-full h-60"
      }`}>
        <img
          src={imageList[imgIndex]}
          alt={product.name}
          className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${
            inSlider ? "object-contain p-4 bg-white" : "object-contain p-6 bg-slate-50/50"
          }`}
        />
        
        {/* Navigation Overlays */}
        {hasMultipleImages && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button onClick={prevImg} className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur shadow-xl text-slate-800 flex items-center justify-center hover:bg-white active:scale-90 transition-all">❮</button>
            <button onClick={nextImg} className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur shadow-xl text-slate-800 flex items-center justify-center hover:bg-white active:scale-90 transition-all">❯</button>
          </div>
        )}

        {/* ── UNAVAILABLE Overlay ── */}
        {!isAvailable && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-rose-900/60 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-2xl shadow-xl border border-rose-400/50">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              <span className="text-xs font-black uppercase tracking-widest">Currently Rented</span>
            </div>
            <p className="text-white/80 text-[10px] font-bold mt-2 uppercase tracking-widest">Not Available for Booking</p>
          </div>
        )}

        {/* Floating Message Icon (Mobile/Compact) */}
        {!isOwner && (
          <button
            onClick={(e) => { e.stopPropagation(); onChat && onChat(product); }}
            className={`absolute top-4 right-4 z-30 w-11 h-11 rounded-2xl flex items-center justify-center transition-all bg-blue-600 text-white shadow-xl hover:scale-110 active:scale-95 group/chat ${inSlider && "md:hidden"} ${!isAvailable ? "hidden" : ""}`}
          >
            <Icons.Message className="w-5 h-5 group-hover/chat:animate-pulse" />
          </button>
        )}
      </div>

      {/* ── Details Section ── */}
      <div className={`p-6 md:p-8 flex flex-col flex-grow justify-between bg-white text-left ${inSlider && "md:w-3/5"}`}>
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter border border-blue-100">
                    {product.category || "General"}
                 </span>
              </div>
              <h2 className={`font-black text-slate-800 tracking-tighter leading-tight ${inSlider ? "text-2xl md:text-3xl" : "text-xl line-clamp-2"}`}>
                {product.name}
              </h2>
            </div>
            <div className="text-right shrink-0">
               <div className={`${inSlider ? "text-3xl" : "text-2xl"} font-black text-blue-600`}>₹{product.price}</div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">per {product.price_type === 'hourly' ? 'hour' : 'day'}</div>
            </div>
          </div>

          <p className={`text-slate-500 font-medium ${inSlider ? "text-base md:text-lg line-clamp-3" : "text-sm line-clamp-2"}`}>
            {product.description || "High-quality academic gear available for rental from your campus peers."}
          </p>

          {!isOwner && inSlider && (
             <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                <span className="opacity-60">Verified Owner:</span>
                <span className="text-blue-600 decoration-blue-600/30 underline decoration-2 underline-offset-4">
                   {product.owner_name || (product.owner_email ? product.owner_email.split("@")[0] : "Admin")}
                </span>
             </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-center gap-3">
           <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border w-full md:w-auto justify-center ${
             isAvailable
               ? "bg-emerald-50 text-emerald-600 border-emerald-100"
               : "bg-rose-100 text-rose-700 border-rose-200 shadow-sm shadow-rose-100"
           }`}>
             <div className={`w-2 h-2 rounded-full ${
               isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
             }`} />
             {isAvailable ? "Available" : "Currently Rented"}
           </div>

            <div className="flex items-center gap-3 w-full justify-end">
              {isOwner ? (
                !inSlider && (
                  <>
                     <button onClick={(e) => { e.stopPropagation(); onEdit && onEdit(product); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white hover:bg-black transition-all shadow-lg active:scale-95">
                        <Icons.Pencil className="w-3.5 h-3.5" /> Edit
                     </button>
                     <button onClick={handleDeleteClick} className={`flex-1 md:flex-none flex items-center justify-center gap-2 h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${confirmOpen ? "bg-rose-600 text-white shadow-xl shadow-rose-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                        {deleting ? "Wait..." : confirmOpen ? "Ok?" : <><Icons.Trash className="w-3.5 h-3.5" /></>}
                     </button>
                  </>
                )
              ) : (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); onChat && onChat(product); }}
                    className="hidden md:flex flex-1 md:flex-none items-center justify-center gap-2 h-14 px-8 rounded-2xl font-black text-[12px] uppercase tracking-widest bg-blue-50 text-blue-600 border-2 border-blue-100 hover:bg-blue-600 hover:text-white transition-all group/btn active:scale-95"
                  >
                    <Icons.Message className="w-4 h-4" /> Message Owner
                  </button>
                  <button 
                    onClick={() => navigate(`/product/${product.id || product._id}`)}
                    className={`flex-1 h-14 px-10 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isAvailable 
                        ? "bg-slate-900 text-white shadow-2xl shadow-slate-300 hover:bg-black hover:scale-[1.02]" 
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Icons.Eye className="w-5 h-5" />
                    {isAvailable ? "View Details" : "Out of Stock"}
                  </button>
                </>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}