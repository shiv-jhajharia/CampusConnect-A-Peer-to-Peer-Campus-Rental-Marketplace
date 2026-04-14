import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Loader from "./Loader";
import ChatArea from "./ChatArea";

const Icons = {
  User: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Shield: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  LogOut: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Message: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  History: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
    </svg>
  ),
  Package: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  ),
  ArrowLeft: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  ),
  Check: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  Pencil: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
    </svg>
  )
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", picture: "", trust_score: 4.8 });
  const [form, setForm] = useState({ name: "", picture: "" });
  const [inbox, setInbox] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [orders] = useState([
    { id: 1, product: "DSLR Camera Lens", status: "Active" },
    { id: 2, product: "Engineering Calculator", status: "Completed" }
  ]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, myProds, myInbox] = await Promise.all([
          apiFetch("/users/me"), apiFetch("/products/my/all"), apiFetch("/messages/inbox")
        ]);
        setUser(profile); setForm({ name: profile.name || "", picture: profile.picture || "" }); setProducts(myProds); setInbox(myInbox);
      } catch (err) { console.error("Data load error:", err); } finally { setLoading(false); }
    };
    loadData();
    const interval = setInterval(async () => {
      try { const myInbox = await apiFetch("/messages/inbox"); setInbox(myInbox); } catch (e) {}
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleEditStart = () => {
    setForm({ name: user.name || "", picture: user.picture || "" });
    setEdit(true);
  };

  const generateNameFromEmail = () => {
    if (user.email) {
      const namePart = user.email.split("@")[0];
      const prettyName = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._]/g, " ");
      setForm({ ...form, name: prettyName });
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Name cannot be empty");
    setSaving(true);
    try {
      const updated = await apiFetch("/users/me", {
        method: "PATCH", body: { name: form.name, picture: form.picture }
      });
      setUser(updated); setEdit(false);
    } catch (err) { alert("Save failed: " + err.message); } finally { setSaving(false); }
  };

  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };

  if (loading) return <Loader fullScreen={true} />;

  const inputClass = "w-full py-4 px-5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all text-slate-700 shadow-sm font-bold";

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 relative pb-20">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/30 to-transparent pointer-events-none"></div>
      <Navbar />

      <div className="max-w-5xl mx-auto p-4 md:px-8 relative z-10 mt-6">
        <button onClick={() => navigate("/dashboard")} className="mb-10 flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black transition-all group">
          <div className="w-11 h-11 rounded-2xl bg-white shadow-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Icons.ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase tracking-widest">Return to Market</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="glass rounded-[2.5rem] p-10 border-white text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
               <input type="file" ref={fileInputRef} onChange={async (e) => {
                 const file = e.target.files[0]; if (!file) return; setUploading(true);
                 const fd = new FormData(); fd.append("file", file);
                 try { const data = await apiFetch("/products/upload-image", { method: "POST", body: fd }); if (data.secure_url) setForm({ ...form, picture: data.secure_url }); }
                 catch (err) { alert("Upload error"); } finally { setUploading(false); }
               }} className="hidden" accept="image/*" />
               
               <div onClick={() => edit && fileInputRef.current?.click()} className={`relative w-32 h-32 mx-auto rounded-full p-1.5 mb-6 shadow-2xl transition-all ${edit ? "cursor-pointer hover:scale-105 active:scale-95" : ""} ${uploading ? "opacity-30" : ""}`} style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)' }}>
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden relative">
                    {form.picture ? <img src={form.picture} alt="P" className="w-full h-full object-cover" /> : <Icons.User className="w-12 h-12 text-slate-200" />}
                    {edit && <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Pencil className="w-4 h-4 text-white" /></div>}
                  </div>
               </div>

               {edit ? (
                 <div className="text-left mt-4 w-full animate-fadeIn">
                    <div className="flex justify-between items-center mb-3 px-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</p>
                      <button onClick={generateNameFromEmail} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors cursor-pointer">Use Email Name</button>
                    </div>
                    <input 
                      value={form.name || ""} 
                      onChange={(e) => setForm({...form, name: e.target.value})} 
                      className={`${inputClass} mb-5`} 
                      placeholder="Full Name" 
                    />
                    
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Account Email (Verified)</p>
                    <input value={user.email || ""} className={`${inputClass} mb-8 opacity-60`} disabled />
                    
                    <div className="flex gap-3">
                      <button onClick={handleSave} disabled={saving} className="flex-1 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
                        {saving ? "Saving..." : "Apply Changes"}
                      </button>
                      <button onClick={() => setEdit(false)} className="px-6 py-4 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all cursor-pointer">
                        Cancel
                      </button>
                    </div>
                 </div>
               ) : (
                 <>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2">{user.name || "Student User"}</h2>
                   <p className="text-xs font-bold text-slate-400 mb-8">{user.email}</p>
                   <div className="flex items-center gap-3 bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl border border-blue-100 w-full justify-center">
                     <Icons.Shield className="w-4 h-4" />
                     <span className="text-xs font-black uppercase tracking-widest">Trust: {user.trust_score} / 5.0</span>
                   </div>
                   <button onClick={handleEditStart} className="w-full mt-6 py-4 border-2 border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-sm cursor-pointer">Manage Identity</button>
                 </>
               )}
            </div>
            <button onClick={handleLogout} className="w-full py-4 bg-white text-rose-600 font-black text-[10px] uppercase tracking-widest rounded-[2rem] border border-slate-100 shadow-xl hover:bg-rose-50 transition-all flex items-center justify-center gap-3 cursor-pointer">
               <Icons.LogOut className="w-4 h-4" /> Final Sign Out
            </button>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2.5rem] p-10 border-white shadow-2xl">
               <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4 uppercase tracking-tighter">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Icons.Message className="w-5 h-5" /></div>
                 Account Inquiries
               </h3>
               <div className="space-y-4">
                 {inbox.length === 0 ? <p className="text-slate-400 text-xs font-bold italic py-4">No active inquiries at this time.</p> : inbox.map((msg) => (
                   <div key={msg.user_id} onClick={() => setActiveChat({ partnerId: msg.user_id, partnerName: msg.user_name })} className="flex items-center justify-between p-5 bg-white border border-slate-50 rounded-2xl hover:border-blue-300 hover:shadow-2xl transition-all cursor-pointer group">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">{msg.user_name[0]}</div>
                         <div>
                            <h4 className="font-black text-slate-900 text-sm tracking-tight">{msg.user_name}</h4>
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">{msg.last_message}</p>
                         </div>
                      </div>
                      {msg.unread_count > 0 && <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full animate-pulse tracking-widest">NEW</span>}
                   </div>
                 ))}
               </div>
            </div>

            <div className="glass rounded-[2.5rem] p-10 border-white shadow-2xl">
               <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4 uppercase tracking-tighter">
                 <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Icons.History className="w-5 h-5" /></div>
                 Rental History
               </h3>
               <div className="space-y-4">
                 {orders.map((o) => (
                   <div key={o.id} className="flex justify-between items-center p-6 bg-white rounded-2xl border border-slate-50">
                     <div>
                        <h4 className="font-black text-slate-900 text-sm tracking-tight">{o.product}</h4>
                        <p className="text-[10px] font-black text-slate-300 uppercase mt-1">Order #CR-{o.id}209</p>
                     </div>
                     <span className={`px-4 py-1.5 font-black text-[9px] uppercase tracking-widest rounded-full cursor-default ${o.status === 'Active' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{o.status}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="glass rounded-[2.5rem] p-10 border-white shadow-2xl">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
                   <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Icons.Package className="w-5 h-5" /></div>
                   Listed Assets
                 </h3>
                 <button onClick={() => navigate("/add-product")} className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b-2 border-blue-600 pb-1 hover:text-blue-800 cursor-pointer">Add Item</button>
               </div>
               <div className="grid grid-cols-1 gap-4">
                 {products.map((p) => (
                   <div key={p.id || p._id} className="flex justify-between items-center p-6 bg-white rounded-2xl border border-slate-50">
                     <h4 className="font-black text-slate-900 text-sm tracking-tight">{p.name}</h4>
                     <div className="text-right"><span className="text-lg font-black text-slate-900">₹{p.price}</span><span className="text-[9px] font-black text-slate-400 block uppercase">per day</span></div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
      <ChatArea isOpen={!!activeChat} onClose={() => setActiveChat(null)} {...activeChat} />
    </div>
  );
}