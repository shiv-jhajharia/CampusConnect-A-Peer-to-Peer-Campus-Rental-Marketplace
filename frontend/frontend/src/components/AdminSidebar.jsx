import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-gray-700 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.clear(); // 🔥 better than removing only token
    navigate("/");
  };

  return (
    <div className="w-64 h-100vh bg-gray-900 text-white p-6 flex flex-col shadow-lg">
      
      {/* 🔝 Top Section */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
        <p className="text-gray-400 text-sm mb-8">Manage your platform</p>

        <nav className="space-y-2">
          <NavLink to="/admin" end className={linkClass}>
            📊 <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            👤 <span>Users</span>
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            📦 <span>Products</span>
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            🧾 <span>Orders</span>
          </NavLink>
        </nav>
      </div>

      {/* 🔻 Bottom Section */}
      <div className="mt-auto border-t border-gray-700 pt-4">
        
        {/* 👤 Admin Info (Optional but 🔥) */}
        <div className="mb-4">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-semibold text-white text-sm">
            Admin
          </p>
        </div>

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 p-2 rounded transition"
        >
          Logout
        </button>
      </div>

    </div>
  );
}