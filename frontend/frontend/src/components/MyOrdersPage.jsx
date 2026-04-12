import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import Navbar from "./Navbar";
import Loader from "./Loader";

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("purchases");
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch arrays
        const [purchaseData, salesData, allProducts] = await Promise.all([
          apiFetch("/orders"),
          apiFetch("/orders/sales"),
          apiFetch("/products")
        ]);

        // Map products for rapid O(1) lookup
        const pMap = {};
        allProducts.forEach(p => {
          pMap[p._id || p.id] = p;
        });

        setPurchases(purchaseData);
        setSales(salesData);
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

  const getProductInfo = (id) => productsMap[id] || { name: "Unknown Item", image_url: "" };

  const renderTable = (items, isSale) => {
    if (!items || items.length === 0) {
      return (
        <div className="py-20 text-center glass rounded-3xl border-2 border-dashed border-slate-300">
          <div className="text-5xl mb-4 opacity-50">🧾</div>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">No {isSale ? "Leases" : "Purchases"} Found</h3>
          <p className="text-slate-500">You don't have any active {isSale ? "outgoing rentals" : "cart orders"} yet.</p>
        </div>
      );
    }

    return (
      <div className="glass rounded-3xl overflow-hidden border border-white/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-100/50 text-slate-500 uppercase tracking-widest text-xs border-b border-slate-200">
                 <th className="p-6 font-bold">Item</th>
                 {isSale && <th className="p-6 font-bold">Renter ID</th>}
                 <th className="p-6 font-bold">Timeframe Bounds</th>
                 <th className="p-6 font-bold">Total Payout</th>
                 <th className="p-6 font-bold text-center">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {items.map(order => {
                  const product = getProductInfo(order.product_id);
                  const startDate = new Date(order.start_date);
                  const endDate = new Date(order.end_date);
                  
                  return (
                    <tr key={order._id} className="hover:bg-white/40 transition-colors">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shadow-sm shrink-0">
                           {product.image_url ? (
                              <img src={product.image_url} alt="img" className="w-full h-full object-cover" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center leading-none p-1">No Image</div>
                           )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">Order #{order._id.substring(0,6)}</p>
                        </div>
                      </td>
                      {isSale && (
                        <td className="p-6">
                           <div className="flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 inline-flex">
                             👤 {order.user_id.substring(0,8)}...
                           </div>
                        </td>
                      )}
                      <td className="p-6">
                        <div className="text-sm">
                           <p className="font-bold text-slate-700">From: <span className="font-medium text-slate-500 ml-1">{startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span></p>
                           <p className="font-bold text-slate-700 mt-1">To: <span className="font-medium text-rose-500 ml-1">{endDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span></p>
                        </div>
                      </td>
                      <td className="p-6 font-black text-emerald-600 text-lg">
                        ₹{order.total_price}
                      </td>
                      <td className="p-6 text-center">
                         <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                           order.status === "completed" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                         }`}>
                            {order.status || "Active"}
                         </span>
                      </td>
                    </tr>
                  )
               })}
             </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
         <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Order Center</h1>
               <p className="text-slate-500 font-medium text-lg">Manage your active cart purchases and outbound leases.</p>
            </div>
            
            <div className="flex bg-slate-200/60 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-inner">
               <button 
                  onClick={() => setActiveTab("purchases")}
                  className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === "purchases" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
               >
                 🛒 My Cart / Rentals
               </button>
               <button 
                  onClick={() => setActiveTab("sales")}
                  className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === "sales" ? "bg-white text-emerald-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
               >
                 📦 My Outbound Leases
               </button>
            </div>
         </div>

         {/* Content View */}
         <div className="animate-fadeIn">
            {activeTab === "purchases" ? renderTable(purchases, false) : renderTable(sales, true)}
         </div>

      </div>
    </div>
  );
}
