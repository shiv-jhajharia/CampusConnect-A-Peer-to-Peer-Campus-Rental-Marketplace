import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProductApi } from "../services/adminApi";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const executeDelete = async (productId) => {
    setDeleting(productId);
    try {
      await deleteProductApi(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleDelete = (productId) => {
     setModalData({
        title: "Delete Product",
        description: "Are you sure you want to delete this product? All active orders for this product will also drop.",
        onConfirm: () => executeDelete(productId)
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
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Products Directory</h1>
          <p className="text-slate-400 font-medium">Monitor active listings and remove violations.</p>
        </div>
        <div className="bg-slate-800/50 text-slate-300 px-4 py-2 rounded-xl border border-slate-700/50 font-bold">
           Total: {products.length}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="glass-dark p-16 rounded-3xl text-center border-dashed border-slate-600 border-2">
           <span className="text-4xl opacity-50 block mb-4">📦</span>
           <h3 className="text-xl font-bold text-slate-300">No products found</h3>
        </div>
      ) : (
        <div className="glass-dark rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-400 uppercase tracking-widest text-xs border-b border-slate-700/50">
                  <th className="p-6 font-bold">Item Details</th>
                  <th className="p-6 font-bold">Price</th>
                  <th className="p-6 font-bold">Owner</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300 font-medium">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                         {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No Img</div>
                         )}
                      </div>
                      <div>
                        <p className="text-white font-bold hover:text-blue-400 transition-colors cursor-pointer truncate max-w-[200px]">{p.name}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{p.category || "General"}</p>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className="bg-emerald-500/10 text-emerald-400 font-black px-3 py-1 rounded-lg">₹{p.price}</span>
                    </td>
                    <td className="p-6 text-sm text-slate-400">
                       {p.owner_email}
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting === p._id}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          deleting === p._id 
                            ? "bg-rose-500/50 text-rose-200 cursor-not-allowed" 
                            : "bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white"
                        }`}
                      >
                        {deleting === p._id ? "Removing..." : "Delete Item"}
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