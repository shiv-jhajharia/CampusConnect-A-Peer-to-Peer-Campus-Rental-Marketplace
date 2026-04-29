import { NavLink, useNavigate } from "react-router-dom";

const Icons = {
  Dashboard: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  ),
  Users: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Products: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  Orders: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Feedbacks: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Shield: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    </svg>
  ),
  Logout: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  )
};

export default function AdminSidebar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 font-semibold ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/50 translate-x-2"
        : "text-slate-400 hover:bg-slate-800/80 hover:text-white hover:translate-x-1"
    }`;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-72 h-screen glass-dark flex flex-col shadow-2xl relative z-20 border-r border-slate-700/50">
      
      {/* 🔝 Top Section */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">Admin</h2>
            <p className="text-blue-400/80 text-xs uppercase tracking-widest font-bold mt-1">Command Center</p>
          </div>
        </div>

        <nav className="space-y-3 mt-8">
          <NavLink to="/admin" end className={linkClass}>
            <Icons.Dashboard className="w-5 h-5" /> <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <Icons.Users className="w-5 h-5" /> <span>Users Control</span>
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            <Icons.Products className="w-5 h-5" /> <span>Products</span>
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            <Icons.Orders className="w-5 h-5" /> <span>Orders</span>
          </NavLink>

          <NavLink to="/admin/feedbacks" className={linkClass}>
            <Icons.Feedbacks className="w-5 h-5" /> <span>Feedbacks</span>
          </NavLink>
        </nav>
      </div>

      {/* 🔻 Bottom Section */}
      <div className="mt-auto p-6 border-t border-slate-800/80 bg-slate-900/30">
        
        <div className="mb-6 flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center">
            <Icons.Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Logged in as</p>
            <p className="font-bold text-slate-200 text-sm">Super Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/50 font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
        >
          <Icons.Logout className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Secure Logout
        </button>
      </div>

    </div>
  );
}