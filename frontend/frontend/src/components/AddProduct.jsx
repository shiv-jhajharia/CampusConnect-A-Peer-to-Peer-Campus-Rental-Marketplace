import React, { useState } from "react";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Electronics",
    available: true,
    image: ""
  });

  const [preview, setPreview] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle image upload
  /*const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };*/

  // Submit
  /*const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Product Data:", form);

    // 👉 Later connect with backend API
    alert("Product Added Successfully 🚀");
  };*/

  const handleImage = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "CampusRent"); // 🔥 your preset

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlysrruwm/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Upload failed");
    }

    // ✅ Save image URL
    setForm((prev) => ({
      ...prev,
      image: data.secure_url
    }));

    // ✅ Preview
    setPreview(data.secure_url);

  } catch (err) {
    console.error(err);
    alert("Image upload failed ❌");
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: form.name,
        description: form.category, // temporary mapping
        price: Number(form.price),
        stock: 1,
        image: form.image
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail);
    }

    alert("Product Added Successfully 🚀");
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>➕ Add New Product</h2>

      <form onSubmit={handleSubmit}>

        {/* PRODUCT NAME */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price per day"
          value={form.price}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* CATEGORY */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={inputStyle}
        >
          <option>Electronics</option>
          <option>Books</option>
          <option>Stationery</option>
        </select>

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          style={inputStyle}
        />

        {/* IMAGE PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          />
        )}

        {/* AVAILABILITY */}
        <label style={{ display: "block", marginBottom: "10px" }}>
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          />
          Available for Rent
        </label>

        {/* BUTTON */}
        <button
          type="submit"
          style={buttonStyle}
          className="cursor-pointer hover:bg-green-600 transition duration-200"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};