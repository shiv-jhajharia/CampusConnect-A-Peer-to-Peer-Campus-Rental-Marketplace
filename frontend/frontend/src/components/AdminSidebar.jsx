import { NavLink, useNavigate } from "react-router-dom";

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
            <span className="text-xl">📊</span> <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <span className="text-xl">👥</span> <span>Users Control</span>
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            <span className="text-xl">🛒</span> <span>Products</span>
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            <span className="text-xl">🧾</span> <span>Orders</span>
          </NavLink>
        </nav>
      </div>

      {/* 🔻 Bottom Section */}
      <div className="mt-auto p-6 border-t border-slate-800/80 bg-slate-900/30">
        
        <div className="mb-6 flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-slate-300 font-bold">🛡️</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Logged in as</p>
            <p className="font-bold text-slate-200 text-sm">Super Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/50 font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
        >
          <span>🚪</span> Secure Logout
        </button>
      </div>

    </div>
  );
}