import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import Navbar from "./Navbar";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

// ── Icons ──
const Icons = {
  ShoppingBag: (p) => (
    <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  Package: (p) => (
    <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  ),
  Calendar: (p) => (
    <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  ),
  Clock: (p) => (
    <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
    </svg>
  ),
  User: (p) => (
    <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  CheckCircle: (p) => (
    <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
    </svg>
  ),
  Empty: (p) => (
    <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  ),
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function getRemainingTime(endDateStr) {
  const now = new Date();
  const end = new Date(endDateStr);
  const diffMs = end - now;
  if (diffMs <= 0) return null;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (diffDays > 0) return `${diffDays}d ${diffHrs}h remaining`;
  if (diffHrs > 0) return `${diffHrs}h ${diffMins}m remaining`;
  return `${diffMins}m remaining`;
}

function StatusBadge({ status }) {
  const map = {
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    paid:      "bg-blue-100 text-blue-700 border-blue-200",
    active:    "bg-blue-100 text-blue-700 border-blue-200",
    cod:       "bg-purple-100 text-purple-700 border-purple-200",
    pending:   "bg-amber-100 text-amber-700 border-amber-200",
  };
  const label = status === "cod" ? "COD" : status || "active";
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${map[status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
      {label}
    </span>
  );
}

function OrderCard({ order, isSale, productsMap }) {
  const product = productsMap[order.product_id] || {};
  const productName = order.product_name || product.name || "Unknown Item";
  const imageUrl = (product.image_urls && product.image_urls[0]) || product.image_url || "";
  const remaining = (order.status === "active" || order.status === "paid" || order.status === "cod")
    ? getRemainingTime(order.end_date)
    : null;
  const isDurationHours = order.duration_type === "hours";
  const isActiveRental = order.status === "active" || order.status === "paid" || order.status === "cod";

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      {/* Top accent bar */}
      <div className={`h-1 w-full ${
        order.status === "completed" ? "bg-gradient-to-r from-emerald-400 to-teal-400"
        : order.status === "cod" ? "bg-gradient-to-r from-purple-400 to-violet-400"
        : "bg-gradient-to-r from-blue-500 to-indigo-500"
      }`} />

      <div className="p-6">
        {/* Header Row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Product Image */}
          <div className="relative w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
            {imageUrl
              ? <img src={imageUrl} alt={productName} className="w-full h-full object-contain p-1" />
              : <Icons.Package className="w-7 h-7 text-slate-300" />
            }
            {/* UNAVAILABLE overlay for active outbound leases */}
            {isSale && isActiveRental && (
              <div className="absolute inset-0 bg-rose-600/80 flex items-center justify-center rounded-2xl">
                <span className="text-[7px] font-black text-white uppercase tracking-widest text-center leading-tight px-1">Not Available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 className="font-black text-slate-900 text-base leading-tight truncate">{productName}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {isSale ? "📤 Outbound Lease" : "🛒 My Rental"} · #{(order.id || order._id || "").slice(-6).toUpperCase()}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </div>
        </div>

        {/* UNAVAILABLE banner for active outbound leases */}
        {isSale && isActiveRental && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-rose-50 rounded-xl border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span className="text-xs font-black text-rose-700 uppercase tracking-widest">Product Currently Unavailable</span>
          </div>
        )}

        {/* Renter info for sales */}
        {isSale && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <Icons.User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-500">Rented by:</span>
            <span className="text-xs font-black text-slate-800">
              {order.renter_name || "Unknown Customer"}
            </span>
          </div>
        )}

        {/* Placed-on date for sales */}
        {isSale && order.created_at && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
            <Icons.Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-xs font-bold text-indigo-500">Order Placed:</span>
            <span className="text-xs font-black text-indigo-800">
              {formatDateTime(order.created_at)}
            </span>
          </div>
        )}

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50/60 rounded-2xl p-3 border border-blue-100">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Start</p>
            <p className="text-xs font-black text-slate-700">
              {isDurationHours ? formatDateTime(order.start_date) : formatDate(order.start_date)}
            </p>
          </div>
          <div className="bg-rose-50/60 rounded-2xl p-3 border border-rose-100">
            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">End</p>
            <p className="text-xs font-black text-slate-700">
              {isDurationHours ? formatDateTime(order.end_date) : formatDate(order.end_date)}
            </p>
          </div>
        </div>

        {/* Remaining Time Pill */}
        {remaining && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
            <Icons.Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
            <span className="text-xs font-black text-amber-700">{remaining}</span>
          </div>
        )}
        {order.status === "completed" && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <Icons.CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-xs font-black text-emerald-700">Rental Completed</span>
          </div>
        )}

        {/* Footer: Duration + Price */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Icons.Calendar className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">
              {order.duration || order.days || "—"} {isDurationHours ? "hour(s)" : "day(s)"}
            </span>
          </div>
          <span className="text-xl font-black text-slate-900">
            ₹{order.total_price}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("purchases");
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseData, salesData, allProducts] = await Promise.all([
          apiFetch("/orders/"),
          apiFetch("/orders/sales"),
          apiFetch("/products")
        ]);
        const pMap = {};
        (allProducts || []).forEach(p => { pMap[p._id || p.id] = p; });
        setPurchases(Array.isArray(purchaseData) ? purchaseData : []);
        setSales(Array.isArray(salesData) ? salesData : []);
        setProductsMap(pMap);
      } catch (e) {
        console.error("Failed to load orders", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader fullScreen={true} />;

  const tabs = [
    { key: "purchases", label: "My Rentals", icon: <Icons.ShoppingBag className="w-4 h-4" />, count: purchases.length, color: "blue" },
    { key: "sales",     label: "Outbound Leases", icon: <Icons.Package className="w-4 h-4" />, count: sales.length, color: "emerald" },
  ];

  const activeOrders = activeTab === "purchases" ? purchases : sales;
  const isSale = activeTab === "sales";

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Decorative gradient background */}
      <div className="fixed top-0 left-0 w-full h-96 pointer-events-none z-0"
           style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(99,102,241,0.04) 50%, transparent 100%)" }} />

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 relative z-10">

        {/* Page Header */}
        <div className="mb-10">
          <button onClick={() => navigate("/dashboard")}
            className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors group">
            <div className="w-8 h-8 rounded-xl bg-white shadow-md flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Icons.ArrowLeft className="w-4 h-4" />
            </div>
            Back to Market
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">
                Order Center
              </h1>
              <p className="text-slate-500 font-medium">Track your rentals and monitor outgoing leases in real-time.</p>
            </div>

            {/* Summary Badges */}
            <div className="flex gap-3">
              <div className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-200 flex items-center gap-2">
                <Icons.ShoppingBag className="w-4 h-4 opacity-80" />
                <span className="font-black text-sm">{purchases.length} Rented</span>
              </div>
              <div className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-emerald-200 flex items-center gap-2">
                <Icons.Package className="w-4 h-4 opacity-80" />
                <span className="font-black text-sm">{sales.length} Leased Out</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-black text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? tab.color === "blue"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === tab.key ? "bg-white/25" : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center mb-6 border border-slate-200">
              <Icons.Empty className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-700 mb-2">
              No {isSale ? "Outbound Leases" : "Rentals"} Yet
            </h3>
            <p className="text-slate-400 font-medium max-w-xs">
              {isSale
                ? "When someone rents your listed products, your outbound leases will appear here."
                : "Browse the marketplace and rent your first item to see it here."}
            </p>
            {!isSale && (
              <button onClick={() => navigate("/dashboard")}
                className="mt-6 px-6 py-3 bg-blue-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                Browse Marketplace →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {activeOrders.map(order => (
              <OrderCard
                key={order.id || order._id}
                order={order}
                isSale={isSale}
                productsMap={productsMap}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
