import React, { useEffect, useState } from "react";
import { fetchStats, fetchOrders } from "../services/adminApi";
import AdminCard from "../components/AdminCard";
import Stats from "./Stats"; 
import Loader from "../components/Loader";

const Icons = {
  Users: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Products: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Orders: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Payments: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
  Trending: <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
};

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
        <div className="hidden md:flex w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/30">
           {Icons.Trending}
        </div>
      </div>

      {/* 📊 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <AdminCard title="Users Active" value={stats.total_users || 0} icon={Icons.Users} />
        <AdminCard title="Listed Products" value={stats.total_products || 0} icon={Icons.Products} />
        <AdminCard title="Orders Placed" value={stats.total_orders || 0} icon={Icons.Orders} />
        <AdminCard title="Payments Processed" value={stats.total_payments || 0} icon={Icons.Payments} />
      </div>

      {/* 📊 Chart */}
      <div className="glass-dark rounded-3xl p-8 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6">System Distribution</h3>
        <Stats data={chartData} />
      </div>

    </div>
  );
}