import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Navbar from "./Navbar";
import CategorySelect from "./CategorySelect";

const MAX_IMAGES = 5;

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0); // how many uploads in progress
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    available: true,
  });
  const [images, setImages] = useState([]); // array of { url, preview, uploading }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Upload one file to backend → Cloudinary, return secure URL
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const data = await apiFetch("/products/upload-image", {
      method: "POST",
      body: formData,
    });
    if (!data.secure_url) throw new Error("No URL returned from server");
    return data.secure_url;
  };

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // ── Capture the current count NOW, before any state mutations ──
    // This is the only safe way to compute stable slot indices in React.
    // `images.length` inside a later closure would be stale.
    const startIdx = images.length;
    const remaining = MAX_IMAGES - startIdx;
    if (remaining <= 0) return;

    const toUpload = files.slice(0, remaining);

    // ── Step 1: Add ALL placeholder entries in one setImages call ──
    // Doing this atomically gives every file a stable, pre-computed index
    // that won't shift due to React re-renders mid-loop.
    const placeholders = toUpload.map((file) => ({
      url: "",
      preview: URL.createObjectURL(file),
      uploading: true,
    }));
    setImages((prev) => [...prev, ...placeholders]);
    setUploadingCount((c) => c + toUpload.length);

    // ── Step 2: Upload all files in parallel ──
    // stableIdx = startIdx + i is computed BEFORE any awaits,
    // so it is always correct regardless of concurrent state updates.
    await Promise.all(
      toUpload.map(async (file, i) => {
        const stableIdx = startIdx + i;
        try {
          const url = await uploadFile(file);
          // Replace the placeholder at stableIdx with the real URL
          setImages((prev) =>
            prev.map((img, idx) =>
              idx === stableIdx
                ? { url, preview: url, uploading: false }
                : img
            )
          );
        } catch (err) {
          console.error(`Image ${i + 1} upload error:`, err);
          alert(`Image ${i + 1} failed: ${err.message}`);
          // Remove the failed placeholder so the slot is freed
          setImages((prev) => prev.filter((_, idx) => idx !== stableIdx));
        } finally {
          // Decrement counter — when it hits 0 the button re-enables
          setUploadingCount((c) => Math.max(0, c - 1));
        }
      })
    );

    // Reset so the same files can be re-selected if needed
    e.target.value = "";
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadingCount > 0) {
      alert("Please wait for all images to finish uploading.");
      return;
    }
    setLoading(true);
    try {
      const urls = images.map((img) => img.url).filter(Boolean);
      await apiFetch("/products", {
        method: "POST",
        body: {
          name: form.name,
          description: form.description || "New Item",
          price: Number(form.price),
          category: form.category,
          availability_status: form.available,
          image_url: urls[0] || "",   // first image — backward compat
          image_urls: urls,           // all images — new field
        },
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to create listing: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full py-3 px-4 bg-white/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 shadow-sm";
  const labelClass =
    "block text-sm font-bold text-slate-700 mb-2 mt-4 uppercase tracking-wider";

  const isUploading = uploadingCount > 0;
  const canAddMore = images.length < MAX_IMAGES && !isUploading;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 relative pb-12">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-100/60 to-transparent pointer-events-none"></div>

      <Navbar />

      <div className="max-w-2xl mx-auto p-4 md:p-8 relative z-10 mt-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-sm">Back to Dashboard</span>
        </button>

        <div className="glass rounded-3xl p-8 md:p-10 border border-white space-y-8">
          <div className="border-b border-slate-100 pb-6 text-center">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              List Your Item
            </h2>
            <p className="text-slate-500 mt-2 font-medium bg-blue-50 inline-block px-4 py-1.5 rounded-full">
              Earn cash by renting to peers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Sony A7III Camera"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Price (₹ per day)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="500"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="1"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                placeholder="Details, condition, rules..."
                value={form.description}
                onChange={handleChange}
                className={`${inputClass} resize-none h-24`}
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <CategorySelect
                value={form.category}
                onChange={(val) => setForm((f) => ({ ...f, category: val }))}
              />
            </div>

            {/* ── Multi-image Upload ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={`${labelClass} mt-0`}>
                  Product Images
                </label>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  images.length >= MAX_IMAGES
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {images.length} / {MAX_IMAGES}
                </span>
              </div>

              {/* Uploading progress bar */}
              {isUploading && (
                <div className="mb-3 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                  <span className="text-sm font-semibold text-blue-700">
                    Uploading {uploadingCount} image{uploadingCount > 1 ? "s" : ""}…
                  </span>
                </div>
              )}

              {/* Thumbnail grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 group"
                    >
                      <img
                        src={img.preview}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Uploading spinner overlay */}
                      {img.uploading && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-white text-[9px] font-bold">UPLOADING</span>
                        </div>
                      )}
                      {/* Remove button — only when not uploading */}
                      {!img.uploading && (
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-rose-700"
                        >
                          ✕
                        </button>
                      )}
                      {/* Cover label on first image */}
                      {idx === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 text-center bg-blue-600/80 text-white text-[10px] font-bold py-0.5">
                          COVER
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Hidden file input — multiple allowed */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                className="hidden"
              />

              {/* Visible Choose Files button */}
              {canAddMore ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/60 hover:bg-blue-100/60 hover:border-blue-400 transition-all flex items-center justify-center gap-3 group cursor-pointer"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
                  <div className="text-left">
                    <p className="text-blue-700 font-bold text-sm">
                      {images.length === 0 ? "Choose Images" : "Add More Images"}
                    </p>
                    <p className="text-blue-500 text-xs">
                      Up to {MAX_IMAGES - images.length} more · JPG, PNG, WEBP
                    </p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg shadow">
                    Browse
                  </span>
                </button>
              ) : isUploading ? (
                <div className="w-full py-3 px-6 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center gap-2 text-blue-500 text-sm font-medium">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  Uploading in progress…
                </div>
              ) : (
                <div className="w-full py-3 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                  <span>✅</span> Maximum {MAX_IMAGES} images reached
                </div>
              )}
            </div>

            {/* Availability toggle */}
            <div className="pt-2 pb-2">
              <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-4 rounded-xl border border-slate-200 select-none">
                <input
                  type="checkbox"
                  name="available"
                  checked={form.available}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-800">Available Immediately</span>
                  <p className="text-xs text-slate-500 font-medium">
                    Visible to search results right now.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || isUploading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-3 ${
                loading || isUploading
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 cursor-pointer"
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-slate-400 border-t-white rounded-full animate-spin"></div>
              ) : isUploading ? (
                <>
                  <div className="w-6 h-6 border-4 border-slate-400 border-t-white rounded-full animate-spin"></div>
                  Uploading {uploadingCount} image{uploadingCount > 1 ? "s" : ""}…
                </>
              ) : (
                "Publish Listing"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}