import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">
      
      {/* Background orbs for admin */}
      <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-rose-600/10 blur-[100px] pointer-events-none"></div>

      <AdminSidebar />
      
      {/* 👇 This is where pages will render */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10 h-screen">
        <Outlet />
      </div>
    </div>
  );
}