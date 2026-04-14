import React, { useState, useRef, useEffect } from "react";
import { apiFetch } from "../utils/api";
import CategorySelect from "./CategorySelect";

const MAX_IMAGES = 5;

export default function EditProductModal({ product, onClose, onSave }) {
  const fileInputRef = useRef(null);

  // Resolve existing image list (backward compat)
  const existingUrls = (() => {
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0)
      return product.image_urls;
    if (product.image_url) return [product.image_url];
    return [];
  })();

  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    category: product.category || "Electronics",
    available: product.availability_status ?? true,
  });

  // images: array of { url, preview, uploading }
  const [images, setImages] = useState(
    existingUrls.map((url) => ({ url, preview: url, uploading: false }))
  );
  const [uploadingCount, setUploadingCount] = useState(0);
  const [saving, setSaving] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const data = await apiFetch("/products/upload-image", { method: "POST", body: formData });
    if (!data.secure_url) throw new Error("No URL returned from server");
    return data.secure_url;
  };

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const startIdx = images.length;
    const remaining = MAX_IMAGES - startIdx;
    if (remaining <= 0) return;

    const toUpload = files.slice(0, remaining);
    const placeholders = toUpload.map((file) => ({
      url: "", preview: URL.createObjectURL(file), uploading: true,
    }));
    setImages((prev) => [...prev, ...placeholders]);
    setUploadingCount((c) => c + toUpload.length);

    await Promise.all(
      toUpload.map(async (file, i) => {
        const idx = startIdx + i;
        try {
          const url = await uploadFile(file);
          setImages((prev) =>
            prev.map((img, j) => j === idx ? { url, preview: url, uploading: false } : img)
          );
        } catch (err) {
          alert(`Image ${i + 1} upload failed: ${err.message}`);
          setImages((prev) => prev.filter((_, j) => j !== idx));
        } finally {
          setUploadingCount((c) => Math.max(0, c - 1));
        }
      })
    );
    e.target.value = "";
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (uploadingCount > 0) {
      alert("Please wait for images to finish uploading.");
      return;
    }
    setSaving(true);
    try {
      const urls = images.map((img) => img.url).filter(Boolean);
      const updated = await apiFetch(`/products/${product.id || product._id}`, {
        method: "PUT",
        body: {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          availability_status: form.available,
          image_url: urls[0] || "",
          image_urls: urls,
        },
      });
      onSave(updated);
      onClose();
    } catch (err) {
      alert("Failed to save changes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const isUploading = uploadingCount > 0;
  const canAddMore = images.length < MAX_IMAGES && !isUploading;
  const inputClass = "w-full py-2.5 px-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50/30 transition-all text-slate-700 text-sm shadow-sm";
  const labelClass = "block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider";

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Modal panel ── */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-400 flex items-center justify-center transition-all cursor-pointer group"
            title="Back to Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1">
            <h2 className="text-xl font-extrabold text-slate-800">Edit Listing</h2>
            <p className="text-slate-400 text-xs mt-0.5">Changes will update immediately in the marketplace</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Name + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product Name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} required
                placeholder="e.g. Sony A7III Camera"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Price (₹ / day)</label>
              <input
                type="number" name="price" value={form.price}
                onChange={handleChange} required min="1"
                placeholder="500"
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description" value={form.description}
              onChange={handleChange}
              placeholder="Details, condition, special instructions..."
              className={`${inputClass} resize-none h-20`}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <CategorySelect
              value={form.category}
              onChange={(val) => setForm((f) => ({ ...f, category: val }))}
              inputClass="py-2.5 px-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-sm hover:bg-slate-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ── Images ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${labelClass} mb-0`}>Product Images</label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                images.length >= MAX_IMAGES ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
              }`}>
                {images.length} / {MAX_IMAGES}
              </span>
            </div>

            {/* Uploading banner */}
            {isUploading && (
              <div className="mb-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                <span className="text-xs font-semibold text-blue-700">
                  Uploading {uploadingCount} image{uploadingCount > 1 ? "s" : ""}…
                </span>
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 group">
                    <img src={img.preview} alt={`img-${idx}`} className="w-full h-full object-cover" />
                    {img.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {!img.uploading && (
                      <button
                        type="button" onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      >✕</button>
                    )}
                    {idx === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 text-center bg-blue-600/75 text-white text-[8px] font-bold py-0.5">COVER</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFilesSelected} className="hidden" />

            {/* Add images button */}
            {canAddMore ? (
              <button
                type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/60 hover:bg-blue-100/60 hover:border-blue-400 transition-all flex items-center gap-3 cursor-pointer group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📸</span>
                <div className="text-left flex-1">
                  <p className="text-blue-700 font-bold text-xs">
                    {images.length === 0 ? "Add Images" : "Add More Images"}
                  </p>
                  <p className="text-blue-400 text-[11px]">Up to {MAX_IMAGES - images.length} more</p>
                </div>
                <span className="text-[11px] font-bold text-white bg-blue-600 px-2.5 py-1 rounded-lg">Browse</span>
              </button>
            ) : !isUploading ? (
              <div className="py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center text-slate-400 text-xs font-medium">
                ✅ Maximum {MAX_IMAGES} images reached
              </div>
            ) : null}
          </div>

          {/* Availability toggle */}
          <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-3.5 rounded-xl border border-slate-200 select-none">
            <input
              type="checkbox" name="available" checked={form.available}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <div>
              <span className="font-bold text-slate-800 text-sm">Available for Rent</span>
              <p className="text-xs text-slate-500">Show this item to other students</p>
            </div>
          </label>
        </div>

        {/* ── Sticky footer ── */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || isUploading}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              saving || isUploading
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
            }`}
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Saving…</>
            ) : isUploading ? (
              <><div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> Uploading…</>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
