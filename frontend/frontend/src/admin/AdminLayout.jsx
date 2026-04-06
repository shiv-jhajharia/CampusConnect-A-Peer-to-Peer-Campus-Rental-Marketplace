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
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      
      {/* 👇 This is where pages will render */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}