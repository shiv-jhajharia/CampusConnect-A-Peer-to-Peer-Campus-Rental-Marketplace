import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/adminApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Users</h2>

      {/* 🔵 Loading */}
      {loading && (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ⚠️ Empty */}
      {!loading && users.length === 0 && (
        <p className="text-gray-500">No users found</p>
      )}

      {/* ✅ Data */}
      {!loading && users.length > 0 && (
        users.map((u) => (
          <div key={u.user._id} className="border p-4 mb-4 rounded-lg shadow hover:shadow-md">
            <p><b>Email:</b> {u.user.email}</p>
            <p>Products: {u.products.length}</p>
            <p>Orders: {u.orders.length}</p>
          </div>
        ))
      )}
    </div>
  );
}