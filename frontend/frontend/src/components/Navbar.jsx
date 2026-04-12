import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItem = (path, label, Icon) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`px-4 py-2 font-bold cursor-pointer rounded-xl transition-all duration-300 flex items-center gap-2 text-xs uppercase tracking-wider ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
            : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
        {label}
      </button>
    );
  };

  // Professional Lucide-style SVGs as components
  const Icons = {
    Home: (props) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    Products: (props) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    Orders: (props) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
      </svg>
    ),
    Profile: (props) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )
  };

  return (
    <div className="sticky top-0 z-50 w-full px-4 py-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto glass rounded-3xl p-5 bg-white/70 shadow-2xl shadow-blue-900/5 relative overflow-hidden min-h-[100px] flex flex-col justify-between">
        
        {/* LEFT: Branding */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
            <Icons.Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
              CampusRent
            </h1>
            <p className="text-[9px] font-extrabold text-blue-500 uppercase tracking-widest mt-1">
              Secure Peer Rental
            </p>
          </div>
        </div>

        {/* RIGHT: Navigation */}
        <div className="flex gap-1.5 self-end">
          <div className="bg-white/40 p-1 rounded-2xl border border-white flex gap-1 shadow-sm backdrop-blur-md">
            {navItem("/dashboard", "Products", Icons.Products)}
            {navItem("/my-orders", "Orders", Icons.Orders)}
            {navItem("/profile", "Profile", Icons.Profile)}
          </div>
        </div>

      </div>
    </div>
  );
}