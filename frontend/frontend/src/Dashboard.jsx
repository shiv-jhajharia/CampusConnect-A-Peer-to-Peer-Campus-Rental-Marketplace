import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductList from "./components/ProductList";
import EditProductModal from "./components/EditProductModal";
import Loader from "./components/Loader";
import ChatArea from "./components/ChatArea";
import { apiFetch } from "./utils/api";

// ── Professional Icons (Lucide Style) ──
const Icons = {
  Search: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  Filter: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Plus: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  ),
  Grid: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  ),
  Laptop: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.2 2.8c.1.2 0 .4-.2.4H3a.5.5 0 0 1-.2-.4L4 16"/>
    </svg>
  ),
  Book: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
    </svg>
  ),
  Pen: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
    </svg>
  ),
  Trophy: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.45.98.96 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  Sparkles: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  Box: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  ),
  Expand: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>
    </svg>
  ),
  Close: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  )
};

const FILTER_CATS = [
  { value: "All",         Icon: Icons.Grid,     label: "All Categories" },
  { value: "Electronics", Icon: Icons.Laptop,   label: "Electronics" },
  { value: "Books",       Icon: Icons.Book,     label: "Books" },
  { value: "Stationery",  Icon: Icons.Pen,      label: "Stationery" },
  { value: "Sports",      Icon: Icons.Trophy,   label: "Sports" },
  { value: "Other",       Icon: Icons.Sparkles, label: "Other" },
];

// ── All Products Modal ──
function AllProductsModal({ products, myProductIds, onClose, onChat, navigate }) {
  const [search,   setSearch]   = useState("");
  const [cat,      setCat]      = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showPrice, setShowPrice] = useState(false);

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Client-side filtering ──
  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchName  = !q || p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchCat   = cat === "All" || p.category === cat;
    const matchMin   = minPrice === "" || (p.price >= Number(minPrice));
    const matchMax   = maxPrice === "" || (p.price <= Number(maxPrice));
    return matchName && matchCat && matchMin && matchMax;
  });

  const hasFilters = search || cat !== "All" || minPrice || maxPrice;
  const resetAll   = () => { setSearch(""); setCat("All"); setMinPrice(""); setMaxPrice(""); setShowPrice(false); };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.78)", backdropFilter: "blur(6px)" }}
      onClick={handleBackdrop}
    >
      <div
        className="relative bg-white rounded-[2.5rem] shadow-2xl flex flex-col"
        style={{ width: "min(95vw, 1140px)", maxHeight: "92vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 md:px-8 pt-7 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
              All <span className="text-blue-600">Products</span>
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
              {filtered.length} of {products.length} listing{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all"
          >
            <Icons.Close className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* ── Search + Filter Toolbar ── */}
        <div className="px-6 md:px-8 py-4 border-b border-slate-100 bg-slate-50/60 shrink-0 space-y-3">

          {/* Row 1: Search + Price toggle + Reset */}
          <div className="flex gap-2 items-center">
            {/* Search bar */}
            <div className="relative flex-1 flex items-center bg-white border border-slate-200 rounded-2xl px-4 shadow-sm focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
              <Icons.Search className="w-4 h-4 text-blue-500 shrink-0" />
              <input
                type="text"
                placeholder="Search by name or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 px-3 outline-none bg-transparent font-semibold text-slate-700 placeholder-slate-400 text-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="shrink-0 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-all">
                  <Icons.Close className="w-3 h-3 text-slate-500" />
                </button>
              )}
            </div>

            {/* Price filter toggle */}
            <button
              onClick={() => setShowPrice((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm border transition-all shrink-0 ${
                showPrice || minPrice || maxPrice
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-300/30"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icons.Filter className={`w-4 h-4 ${showPrice || minPrice || maxPrice ? "text-white" : "text-slate-400"}`} />
              Price
            </button>

            {/* Reset button — only when filters active */}
            {hasFilters && (
              <button
                onClick={resetAll}
                className="px-4 py-3 rounded-2xl font-bold text-sm border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all shrink-0"
              >
                Reset
              </button>
            )}
          </div>

          {/* Row 2: Price range (collapsible) */}
          {showPrice && (
            <div className="flex items-center gap-3 animate-slideIn">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">₹ Range</span>
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
              <span className="text-slate-300 font-bold">—</span>
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
          )}

          {/* Row 3: Category pills */}
          <div className="flex gap-2 flex-wrap">
            {FILTER_CATS.map(({ value, Icon, label }) => (
              <button
                key={value}
                onClick={() => setCat(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-tighter border transition-all ${
                  cat === value
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-300/30"
                    : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable Product Grid ── */}
        <div className="overflow-y-auto p-6 flex-1">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold flex flex-col items-center gap-3">
              <span className="text-4xl">🔍</span>
              <p>No products match your filters.</p>
              {hasFilters && (
                <button onClick={resetAll} className="mt-2 text-blue-600 font-black text-sm hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product) => {
                const isOwner = myProductIds.has(product.id || product._id);
                const imageUrl = (() => {
                  const urls = product.image_urls;
                  if (Array.isArray(urls) && urls.length > 0) return urls[0];
                  if (product.image_url) return product.image_url;
                  return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=500&q=80";
                })();
                const isAvailable = product.availability_status;

                return (
                  <div
                    key={product.id || product._id}
                    className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-44 bg-slate-50 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className={`absolute top-3 left-3 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter border ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                        {isAvailable ? "In Stock" : "Unavailable"}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-tighter border border-blue-100">
                          {product.category || "General"}
                        </span>
                        <h3 className="font-black text-slate-800 text-base tracking-tighter line-clamp-1 mt-1">{product.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 font-medium">
                          {product.description || "Available for rental from your campus peers."}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4 gap-2">
                        <div>
                          <div className="text-xl font-black text-blue-600">₹{product.price}</div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">per day</div>
                        </div>
                        <div className="flex gap-2">
                          {!isOwner && (
                            <button
                              onClick={() => { onChat && onChat(product); onClose(); }}
                              className="h-9 px-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
                            >
                              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                              Chat
                            </button>
                          )}
                          <button
                            onClick={() => { navigate(`/product/${product.id || product._id}`); onClose(); }}
                            disabled={!isAvailable}
                            className={`h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 active:scale-95 ${
                              isAvailable
                                ? "bg-slate-900 text-white hover:bg-black shadow-md"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryFilterDropdown({ value, onChange, open, onToggle }) {
  const ref = useRef(null);
  const active = FILTER_CATS.find((c) => c.value === value) || FILTER_CATS[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) && open) onToggle(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative w-full md:w-auto">
      <button
        type="button"
        onClick={() => onToggle(!open)}
        className={`flex items-center gap-2 w-full md:w-auto px-5 py-4 rounded-2xl border font-bold text-sm transition-all shadow-sm whitespace-nowrap ${
          open
            ? "bg-white border-blue-400 ring-4 ring-blue-100 text-slate-700"
            : value !== "All"
            ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-300/40"
            : "bg-white/50 text-slate-600 border-slate-200/60 hover:bg-white"
        }`}
      >
        <active.Icon className="w-4 h-4" />
        <span className="flex-1 text-left">{active.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 min-w-full bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden p-2 animate-slideIn">
          <div className="space-y-1">
            {FILTER_CATS.map((cat) => {
              const isActive = cat.value === value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => { onChange(cat.value); onToggle(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                       ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                       : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <cat.Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const EXPAND_THRESHOLD = 7;
  const myProductIds = new Set(myProducts.map((p) => p.id || p._id));

  const fetchProducts = useCallback(async () => {
    try {
      let url = `/products`;
      const params = new URLSearchParams();
      if (search)                      params.append("search",    search);
      if (category !== "All")          params.append("category",  category);
      if (minPrice !== "")             params.append("min_price", minPrice);
      if (maxPrice !== "")             params.append("max_price", maxPrice);
      if (params.toString())           url += `?${params.toString()}`;

      const data = await apiFetch(url);
      setProducts(data);
      setCurrentIndex(0);
    } catch (e) {
      console.error("Error fetching products", e);
    }
  }, [search, category, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const data = await apiFetch("/products/my/all");
        setMyProducts(data);
      } catch (e) {
        console.error("Error fetching my products", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  useEffect(() => {
    if (products.length <= 1 || sliderPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length, sliderPaused]);

  const nextSlide = () => { setCurrentIndex((prev) => (prev + 1) % products.length); };
  const prevSlide = () => { setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1)); };

  const handleDeleteProduct = async (id) => {
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      setMyProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (e) {
      alert("Failed to delete product: " + e.message);
    }
  };

  const handleSaveEdit = (updatedProduct) => {
    const id = updatedProduct.id || updatedProduct._id;
    const merge = (prev) => prev.map((p) => (p.id || p._id) === id ? { ...p, ...updatedProduct } : p);
    setMyProducts(merge);
    setProducts(merge);
  };

  const handleOpenChat = (product) => {
    setActiveChat({
      partnerId: product.owner_id || product.user_id,
      partnerName: product.owner_email ? product.owner_email.split("@")[0] : "Owner",
      productId: product.id || product._id,
      productName: product.name
    });
  };

  if (loading) return <Loader fullScreen={true} />;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/30 to-transparent pointer-events-none"></div>
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 md:px-8 md:pt-2 md:pb-24 space-y-8 relative z-10">
        
        {/* TOP BAR */}
        <div className="flex flex-col glass p-3 md:p-4 rounded-[2rem] gap-3 relative z-30 border-white">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full rounded-2xl flex items-center px-5 bg-white border border-slate-100 overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 transition-all shadow-sm">
              <Icons.Search className="w-5 h-5 text-blue-500" />
              <input
                type="text" placeholder="Search for products, categories..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full py-4 px-3 outline-none bg-transparent font-bold text-slate-700 placeholder-slate-400"
              />
            </div>

            <CategoryFilterDropdown
              value={category} onChange={setCategory}
              open={showCategoryDropdown}
              onToggle={(isOpen) => { setShowCategoryDropdown(isOpen); if (isOpen) setShowPriceFilter(false); }}
            />

            <button
              onClick={() => { const next = !showPriceFilter; setShowPriceFilter(next); if (next) setShowCategoryDropdown(false); }}
              className={`flex items-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm transition-all border shadow-sm ${
                showPriceFilter || minPrice || maxPrice ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/30" : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
              }`}
            >
              <Icons.Filter className={`w-4 h-4 ${showPriceFilter ? "text-white" : "text-slate-400"}`} />
              Price Filter
            </button>

            <button onClick={() => navigate("/add-product")} className="bg-slate-900 text-white px-7 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center gap-2">
              <Icons.Plus className="w-4 h-4" />
              List Item
            </button>
          </div>

          {showPriceFilter && (
            <div className="flex flex-col sm:flex-row items-center gap-4 px-2 pb-2 pt-1 animate-slideIn">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 border-r border-slate-200">Price Range (₹)</span>
              <div className="flex items-center gap-3 flex-1 w-full">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" />
              </div>
            </div>
          )}
        </div>

        {/* FEATURED SLIDER */}
        <div className="space-y-6">
           <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Featured <span className="text-blue-600">Rentals</span></h2>
           {products.length > 0 ? (
             <div className="glass rounded-[2.5rem] p-4 md:p-6 flex items-center justify-between relative group overflow-visible h-72 md:h-80 border-white" onMouseEnter={() => setSliderPaused(true)} onMouseLeave={() => setSliderPaused(false)}>
                <button onClick={prevSlide} className="absolute -left-6 z-20 bg-white shadow-2xl rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer border border-slate-100">❮</button>
                <div className="flex-1 h-full px-4 md:px-12 text-center flex justify-center">
                  {products[currentIndex] && (
                    <ProductCard 
                      product={products[currentIndex]} 
                      inSlider={true} 
                      isOwner={myProductIds.has(products[currentIndex]?.id || products[currentIndex]?._id)}
                      onChat={handleOpenChat}
                    />
                  )}
                </div>
                <button onClick={nextSlide} className="absolute -right-6 z-20 bg-white shadow-2xl rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer border border-slate-100">❯</button>

                {/* Slide indicator dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {products.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`transition-all duration-300 rounded-full ${
                        i === currentIndex
                          ? "w-5 h-2 bg-blue-600"
                          : "w-2 h-2 bg-slate-300 hover:bg-blue-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Expand button — bottom-right corner */}
                <button
                  onClick={() => setExpandedView(true)}
                  title="View all products"
                  className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-blue-400/30 active:scale-95 transition-all group/exp"
                >
                  <Icons.Expand className="w-3.5 h-3.5 transition-transform group-hover/exp:scale-110" />
                  <span>View All ({products.length})</span>
                </button>
             </div>
           ) : <div className="p-20 text-center glass rounded-3xl border-dashed border-slate-200 text-slate-400 font-bold">No active listings found.</div>}
        </div>

        {/* INVENTORY */}
        <div className="pt-12 space-y-8">
          <div className="flex items-center gap-4">
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Your Inventory</h2>
             <div className="h-0.5 flex-1 bg-slate-200/50"></div>
             <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full">{myProducts.length} ITEMS</span>
          </div>
          <ProductList products={myProducts} isOwner={true} onDelete={handleDeleteProduct} onEdit={setEditingProduct} onChat={handleOpenChat} />
        </div>
      </div>

      {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSaveEdit} />}
      <ChatArea isOpen={!!activeChat} onClose={() => setActiveChat(null)} {...activeChat} />

      {/* All Products Modal */}
      {expandedView && (
        <AllProductsModal
          products={products}
          myProductIds={myProductIds}
          onClose={() => setExpandedView(false)}
          onChat={(product) => { handleOpenChat(product); setExpandedView(false); }}
          navigate={navigate}
        />
      )}
    </div>
  );
}
