import React, { useEffect, useState } from "react";
import { fetchOrders } from "../services/adminApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Orders</h2>

      {/* 🔵 Loading */}
      {loading && (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ⚠️ Empty */}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500">No orders found</p>
      )}

      {/* ✅ Data */}
      {!loading && orders.length > 0 && (
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Total Price</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{o.user_id}</td>
                <td className="p-3">₹{o.total_price}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    o.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {o.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}