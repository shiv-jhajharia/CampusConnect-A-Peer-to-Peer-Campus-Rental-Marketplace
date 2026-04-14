import React, { useEffect, useState } from "react";
import { fetchOrders, deleteOrderApi } from "../services/adminApi";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const executeDelete = async (orderId) => {
    setDeleting(orderId);
    try {
      await deleteOrderApi(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert("Failed to delete order: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleDelete = (orderId) => {
     setModalData({
        title: "Cancel Order",
        description: "Are you sure you want to forcibly delete this order record? This action cannot be undone.",
        onConfirm: () => executeDelete(orderId)
     });
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto">
      <Modal 
        isOpen={!!modalData} 
        onClose={() => setModalData(null)} 
        {...modalData} 
      />

      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Order Management</h1>
          <p className="text-slate-400 font-medium">Review transactions and cancel fraudulent orders.</p>
        </div>
        <div className="bg-slate-800/50 text-slate-300 px-4 py-2 rounded-xl border border-slate-700/50 font-bold">
           Total: {orders.length}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass-dark p-16 rounded-3xl text-center border-dashed border-slate-600 border-2">
           <span className="text-4xl opacity-50 block mb-4">🧾</span>
           <h3 className="text-xl font-bold text-slate-300">No active orders</h3>
        </div>
      ) : (
        <div className="glass-dark rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-400 uppercase tracking-widest text-xs border-b border-slate-700/50">
                  <th className="p-6 font-bold">Transaction Reference</th>
                  <th className="p-6 font-bold">User</th>
                  <th className="p-6 font-bold">Total Price</th>
                  <th className="p-6 font-bold text-center">Status</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300 font-medium">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                       <span className="font-mono text-slate-400 text-sm">{o._id}</span>
                       <p className="text-xs text-slate-500 mt-1">Product ID: {o.product_id}</p>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <span className="truncate max-w-[150px]" title={o.user_id}>{o.user_id}</span>
                       </div>
                    </td>
                    <td className="p-6 font-bold text-emerald-400">
                       ₹{o.total_price}
                    </td>
                    <td className="p-6 text-center">
                       <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${
                         o.status === "completed"
                           ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                           : o.status === "active" || o.status === "paid"
                             ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                             : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                       }`}>
                         {o.status || "Pending"}
                       </span>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleDelete(o._id)}
                        disabled={deleting === o._id}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          deleting === o._id 
                            ? "bg-rose-500/50 text-rose-200 cursor-not-allowed" 
                            : "bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white"
                        }`}
                      >
                        {deleting === o._id ? "Canceling..." : "Force Cancel"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}