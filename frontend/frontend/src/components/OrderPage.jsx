import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Navbar from "./Navbar";
import Loader from "./Loader";

// ── Icons ──
const ChevronLeft = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const ChevronRight = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const ArrowLeft = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);
const CalendarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct]         = useState(null);
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");
  const [total, setTotal]             = useState(0);
  const [days, setDays]               = useState(0);
  const [loading, setLoading]         = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [imgIndex, setImgIndex]       = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await apiFetch(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        alert("Failed to load product: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // Build image list from product data
  const imageList = (() => {
    if (!product) return [];
    const urls = product.image_urls;
    if (Array.isArray(urls) && urls.length > 0) return urls;
    if (product.image_url) return [product.image_url];
    return ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=500&q=80"];
  })();

  const hasMultiple = imageList.length > 1;
  const prevImg = () => setImgIndex((p) => (p === 0 ? imageList.length - 1 : p - 1));
  const nextImg = () => setImgIndex((p) => (p + 1) % imageList.length);

  const calculateTotal = (start, end, price) => {
    if (start && end && price) {
      const s = new Date(start);
      const e = new Date(end);
      const diffDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setDays(diffDays);
        setTotal(diffDays * price);
      } else {
        setDays(0);
        setTotal(0);
      }
    }
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) { alert("Please select start and end dates."); return; }
    if (total <= 0) { alert("End date must be after start date."); return; }

    // Support both MongoDB _id and mapped id
    const productId = product.id || product._id;
    if (!productId) { alert("Product ID missing. Please go back and try again."); return; }

    setOrderLoading(true);
    try {
      const data = await apiFetch("/orders/", {
        method: "POST",
        body: { product_id: productId, start_date: startDate, end_date: endDate }
      });

      const orderId = data.order_id || data.id || data._id;
      if (!orderId) throw new Error("Order created but no order ID returned.");

      localStorage.setItem("order_id", orderId);
      navigate("/payment", {
        state: {
          productName: product.name,
          productImage: imageList[0] || "",
          category: product.category || "General",
          startDate,
          endDate,
          days,
          pricePerDay: product.price,
          total,
        }
      });
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed: " + (err.message || "Unknown error. Check console."));
    } finally {
      setOrderLoading(false);
    }
  };

  const inputClass =
    "w-full py-3 px-4 bg-white border border-slate-200 rounded-xl outline-none " +
    "focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-slate-700 shadow-sm font-semibold";

  if (loading) return <Loader fullScreen={true} />;

  if (!product) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center text-slate-500">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 flex items-center gap-2 text-blue-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const isAvailable = product.availability_status;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 relative pb-16">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />

      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-12 relative z-10">

        {/* ── Back Arrow ── */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all font-bold text-sm text-slate-600 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* ── Main Card ── */}
        <div className="glass rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row border border-white shadow-xl">

          {/* ── LEFT: Image Gallery + Info ── */}
          <div className="lg:w-[55%] flex flex-col bg-white/60 border-b lg:border-b-0 lg:border-r border-slate-100">

            {/* Image Slider */}
            <div className="relative w-full h-72 md:h-80 bg-white flex items-center justify-center overflow-hidden border-b border-slate-100">
              {/* Main image */}
              <img
                key={imgIndex}
                src={imageList[imgIndex]}
                alt={`${product.name} - image ${imgIndex + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain p-6 transition-opacity duration-300"
                style={{ background: "#ffffff" }}
              />

              {/* Category badge */}
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl shadow-md font-black text-[10px] uppercase tracking-widest text-blue-700 border border-blue-100">
                {product.category || "General"}
              </span>

              {/* Availability badge */}
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-widest border flex items-center gap-1.5 ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                {isAvailable ? "Available" : "Unavailable"}
              </span>

              {/* Prev / Next arrows (only if multiple images) */}
              {hasMultiple && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all border border-slate-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all border border-slate-100"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {hasMultiple && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {imageList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`transition-all duration-300 rounded-full ${
                        i === imgIndex
                          ? "w-5 h-2 bg-blue-600 shadow-sm"
                          : "w-2 h-2 bg-slate-300 hover:bg-blue-400"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Image counter */}
              {hasMultiple && (
                <span className="absolute bottom-3 right-4 text-[10px] font-black text-slate-400 bg-white/80 px-2 py-0.5 rounded-lg">
                  {imgIndex + 1} / {imageList.length}
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            {hasMultiple && (
              <div className="flex gap-2 p-4 overflow-x-auto border-t border-slate-100 bg-slate-50/50">
                {imageList.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === imgIndex ? "border-blue-500 shadow-lg shadow-blue-400/20 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`thumb-${i}`} className="w-full h-full object-contain bg-white p-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Product Info */}
            <div className="p-6 md:p-8 flex flex-col gap-3 flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-tight">
                {product.name}
              </h1>
              <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                {product.description || "High-quality academic gear available for rental from your campus peers."}
              </p>
              {product.owner_email && (
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-1">
                  <span className="opacity-60">Listed by:</span>
                  <span className="text-blue-600">{product.owner_email.split("@")[0]}</span>
                </div>
              )}
              <div className="mt-auto pt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-blue-600">₹{product.price}</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">/ day</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Booking Panel ── */}
          <div className="lg:w-[45%] p-6 md:p-10 flex flex-col justify-between bg-white/30">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">Reserve This Item</h2>
              <p className="text-slate-400 text-sm font-medium mb-8">Pick your rental dates to see the total cost.</p>

              <div className="space-y-5">
                {/* Start Date */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                    Rental Start Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); calculateTotal(e.target.value, endDate, product.price); }}
                    className={inputClass}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                    Rental End Date
                  </label>
                  <input
                    type="date"
                    min={startDate || new Date().toISOString().split("T")[0]}
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); calculateTotal(startDate, e.target.value, product.price); }}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Pricing Breakdown */}
              {days > 0 && (
                <div className="mt-6 bg-blue-50/60 border border-blue-100 rounded-2xl p-5 space-y-2 animate-slideIn">
                  <div className="flex justify-between text-sm font-bold text-slate-600">
                    <span>₹{product.price} × {days} day{days !== 1 ? "s" : ""}</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="border-t border-blue-100 pt-2 flex justify-between font-black text-slate-800">
                    <span>Total Estimate</span>
                    <span className="text-blue-700 text-lg">₹{total}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-8">
              {!isAvailable && (
                <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-sm text-center">
                  This item is currently unavailable for rent.
                </div>
              )}
              <button
                onClick={handleBooking}
                disabled={orderLoading || total <= 0 || !isAvailable}
                className={`w-full py-4 rounded-2xl font-black text-base flex justify-center items-center gap-3 shadow-lg transition-all active:scale-[0.98] ${
                  orderLoading || total <= 0 || !isAvailable
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/40 hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                {orderLoading
                  ? <div className="w-5 h-5 border-4 border-blue-300 border-t-white rounded-full animate-spin" />
                  : "Proceed to Payment →"
                }
              </button>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">
                🔒 Secured by CampusRent Escrow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}