/*import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import { apiFetch } from "./utils/api";
import Loader from "./components/Loader";
import Modal from "./components/Modal";
import OrderPage from "./components/OrderPage";
import { API_URL } from "./config";


/*const dummyProducts = [
  { id: 1, title: "Laptop", price: 300, category: "Electronics", available: true, image: "https://www.techtarget.com/rms/onlineimages/hp_elitebook_mobile.jpg" },
  { id: 2, title: "Camera", price: 200, category: "Electronics", available: false, image: "https://www.sony.co.in/image/2ea19010a696190117f57f7a666e7230?fmt=png-alpha" },
  { id: 3, title: "Calculator", price: 50, category: "Study", available: true, image: "https://www.bbassets.com/media/uploads/p/l/40284886_4-bambalio-scientific-calculator-bl82ms-240-functions-2-line-display.jpg" },
  { id: 4, title: "Textbook", price: 80, category: "Study", available: true, image: "https://images.ctfassets.net/9htf9uzhsn4z/2rqi5DJjYoRtYNkUcAgpAk/30439e05bb32086a920d3452c00c3bf2/lulu-education-popular-formats-textbook-2x.jpg?w=2880&h=960&fm=webp" },
];*//*
export default function Dashboard() {

  const [selected, setSelected] = useState(null);

  const openModal = (data) => setSelected(data);
  const closeModal = () => setSelected(null);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(500);
  const [orders, setOrders] = useState([]);

  //AUTH CHECK
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token){
    navigate("/");
    return;
  }

  const fetchData = async () => {
    try {
      // Fetch products
      const productsData = await apiFetch(`${API_URL}/products`);
      setProducts(productsData);

      // 🔥 Fetch orders
      const ordersData = await apiFetch(`${API_URL}/orders`);
      setOrders(ordersData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
  
  /*if(loading){
    return <Loader/>
  }*/
  // FILTER LOGIC
  /*const filteredProducts = products.filter((p) =>
    (category === "All" || p.category === category) &&
    p.price <= maxPrice
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
    
      <div className="p-6">
        
        {loading ? (
          <Loader />
        ) : (
          <>
         {/* Top Controls *//*}
        <div className="flex justify-between items-center mb-6">

          <input
            type="text"
            placeholder="Search items..."
            className="p-3 rounded-lg border shadow-sm w-1/2"
          />

          <button
            onClick={() => navigate("/add-product")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer"
          >
            + Add Product
          </button>
        </div>

        {/* FILTERS *//*}
        <div className="mb-6">

          {/* Category *//*}
          <select
            className="p-2 border rounded cursor-pointer mb-3"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Study</option>
          </select>

          {/* PRICE SLIDER *//*}
          <div className="mt-2">
            
            <label className="block mb-1 font-medium">
              Max Price: ₹{maxPrice}
            </label>

            <input
              type="range"
              min="0"
              max="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full cursor-pointer"
            />

          </div>

        </div>

        <div className="text-center mb-6">
        <h2 className="text-xl font-bold">
          Trust Score ⭐ 4.5
        </h2>
        </div>

        <h3 className="text-lg font-semibold mb-2">🛒 My Products</h3>

        {products.length === 0 ? (
        <p className="text-gray-500">No products added</p>
        ) : (
        <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
        <div onClick={() => openModal(p)} className="cursor-pointer">
          {p.name}
        </div>
        ))}
        </div>
        )}

        <h3 className="text-lg font-semibold mt-6 mb-2">📦 My Orders</h3>

        {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet</p>
        ) : (
          orders.map((o) => (
          <div
            key={o.id}
            onClick={() => openModal(o)}
            className="cursor-pointer p-3 bg-white rounded shadow hover:scale-105 transition duration-300"
          >
            <p><b>ID:</b> {o.id}</p>
            <p><b>Price:</b> ₹{o.total_price}</p>
            <p><b>Status:</b> {o.status}</p>
          </div>
            ))
          )}

      {selected && <Modal data={selected} onClose={closeModal} />}
        {/* PRODUCTS *//*}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
          </>
        )}
          <div className="overflow-hidden mb-6">
          <div className="flex animate-scroll gap-4">
            {products.map((p) => (
            <img
            key={p.id}
            src={p.image || "https://via.placeholder.com/150"}
            className="h-32 w-48 object-cover rounded"
            />
            ))}
  </div>
</div>
      </div>
    </div>
  );
}*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import { apiFetch } from "./utils/api";
import { API_URL } from "./config";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await apiFetch(`${API_URL}/products`);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // FILTER LOGIC
  const filteredProducts = products.filter((p) =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">

        {/* TOP BAR */}
        <div className="flex gap-4 mb-6">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 relative p-4 rounded-full shadow outline-none text-gray-700 cursor-pointer bg-gray-50"
          />

          {/* FILTER */}
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 shadow rounded-3xl outline-none cursor-pointer bg-gray-50 text-gray-400"
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Study</option>
          </select>

          {/* ADD PRODUCT */}
          <button
                onClick={() => navigate("/add-product")} 
                className="bg-green-500 text-white px-4 rounded-lg shadow cursor-pointer">
            + Add Product
          </button>
        </div>

        {/* FEATURED SLIDER */}
        <div className="overflow-hidden mb-6">
          <div className="flex gap-4 animate-scroll">
            {[...products, ...products].map((p, i) => (
              <img
                key={i}
                src={p.image || "https://via.placeholder.com/150"}
                className="h-40 w-60 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">My Products</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {products.slice(0, 3).map((p) => (
            <div className="bg-white p-4 rounded shadow">
              <img
                src={p.image || "https://via.placeholder.com/150"}
                className="h-32 w-full object-cover mb-2"
              />
              <h3>{p.name || p.title}</h3>
              <p className="text-sm text-gray-500">{p.category}</p>
              <p className="font-bold">₹{p.price}</p>
            </div>
          ))}
        </div>
        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

      </div>
    </div>
  );
}