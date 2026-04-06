import React, { useEffect, useState } from "react";
import { fetchStats, fetchOrders } from "../services/adminApi";
import AdminCard from "../components/AdminCard";
import Stats from "./Stats"; // ✅ ADD HERE

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const statsData = await fetchStats();
      const ordersData = await fetchOrders();

      setStats(statsData);
      setOrders(ordersData);
    };
    fetchData();
  }, []);

  // 💰 Revenue
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.total_price || 0),
    0
  );

  // ✅ ADD HERE
  const chartData = [
    { name: "Users", value: stats.total_users || 0 },
    { name: "Products", value: stats.total_products || 0 },
    { name: "Orders", value: stats.total_orders || 0 },
    { name: "Payments", value: stats.total_payments || 0 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* 💰 Revenue */}
      <h2 className="text-xl mb-4">
        Total Revenue: ₹{totalRevenue}
      </h2>

      {/* 📊 Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <AdminCard title="Users" value={stats.total_users || 0} />
        <AdminCard title="Products" value={stats.total_products || 0} />
        <AdminCard title="Orders" value={stats.total_orders || 0} />
        <AdminCard title="Payments" value={stats.total_payments || 0} />
      </div>

      {/* 📊 Chart (ADD HERE) */}
      <Stats data={chartData} />
    </div>
  );
}