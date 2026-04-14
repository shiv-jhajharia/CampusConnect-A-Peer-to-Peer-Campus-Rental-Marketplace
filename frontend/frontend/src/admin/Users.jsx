import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUserApi } from "../services/adminApi";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const executeDelete = async (userId) => {
    setDeleting(userId);
    try {
      await deleteUserApi(userId);
      setUsers((prev) => prev.filter((u) => u.user._id !== userId));
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleDelete = (userId) => {
     setModalData({
        title: "Delete User",
        description: "Are you sure you want to permanently delete this user and all associated data?",
        onConfirm: () => executeDelete(userId)
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
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">User Directory</h1>
          <p className="text-slate-400 font-medium">Manage and remove platform members.</p>
        </div>
        <div className="bg-slate-800/50 text-slate-300 px-4 py-2 rounded-xl border border-slate-700/50 font-bold">
           Total: {users.length}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="glass-dark p-16 rounded-3xl text-center border-dashed border-slate-600 border-2">
           <span className="text-4xl opacity-50 block mb-4">👥</span>
           <h3 className="text-xl font-bold text-slate-300">No users found</h3>
        </div>
      ) : (
        <div className="glass-dark rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-400 uppercase tracking-widest text-xs border-b border-slate-700/50">
                  <th className="p-6 font-bold">User Details</th>
                  <th className="p-6 font-bold text-center">Active Products</th>
                  <th className="p-6 font-bold text-center">Order Volume</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300 font-medium">
                {users.map((u) => (
                  <tr key={u.user._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                        {u.user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-bold">{u.user.email}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider bg-slate-800 inline-block px-2 py-0.5 rounded">
                           ID: {u.user._id.substring(0, 8)}...
                        </p>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                       <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg font-bold">
                          {u.products.length}
                       </span>
                    </td>
                    <td className="p-6 text-center">
                       <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg font-bold">
                          {u.orders.length}
                       </span>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleDelete(u.user._id)}
                        disabled={deleting === u.user._id || u.user.role === "admin"}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          u.user.role === "admin"
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" 
                          : deleting === u.user._id 
                            ? "bg-rose-500/50 text-rose-200 cursor-not-allowed" 
                            : "bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white"
                        }`}
                      >
                        {u.user.role === "admin" ? "Admin" : (deleting === u.user._id ? "Deleting..." : "Remove")}
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