import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/adminApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // ✅ IMPORTANT
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Products</h2>

      {/* 🔵 Loading */}
      {loading && (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ⚠️ Empty */}
      {!loading && products.length === 0 && (
        <p className="text-gray-500">No products found</p>
      )}

      {/* ✅ Data */}
      {!loading && products.length > 0 && (
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Owner</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.owner_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}