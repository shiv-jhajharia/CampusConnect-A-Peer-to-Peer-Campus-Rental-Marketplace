import React, { useEffect, useState } from "react";
import { fetchStats, fetchOrders } from "../services/adminApi";
import AdminCard from "../components/AdminCard";
import Stats from "./Stats"; 
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await fetchStats();
        const ordersData = await fetchOrders();
        setStats(statsData);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.total_price || 0),
    0
  );

  const chartData = [
    { name: "Users", value: stats.total_users || 0 },
    { name: "Products", value: stats.total_products || 0 },
    { name: "Orders", value: stats.total_orders || 0 },
    { name: "Payments", value: stats.total_payments || 0 },
  ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto">
      
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Platform Overview</h1>
          <p className="text-slate-400 font-medium">Monitor your metrics and revenue globally.</p>
        </div>
      </div>

      {/* 💰 Revenue Highlight */}
      <div className="glass-dark rounded-3xl p-8 mb-10 border border-slate-700/50 relative overflow-hidden flex items-center justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Total Platform Volume</p>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            ₹{totalRevenue.toLocaleString()}
          </h2>
        </div>
        <div className="hidden md:flex w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 items-center justify-center text-3xl shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/30">
           📈
        </div>
      </div>

      {/* 📊 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <AdminCard title="Users Active" value={stats.total_users || 0} icon="👥" />
        <AdminCard title="Listed Products" value={stats.total_products || 0} icon="📦" />
        <AdminCard title="Orders Placed" value={stats.total_orders || 0} icon="🧾" />
        <AdminCard title="Payments Processed" value={stats.total_payments || 0} icon="💳" />
      </div>

      {/* 📊 Chart */}
      <div className="glass-dark rounded-3xl p-8 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6">System Distribution</h3>
        <Stats data={chartData} />
      </div>

    </div>
  );
}