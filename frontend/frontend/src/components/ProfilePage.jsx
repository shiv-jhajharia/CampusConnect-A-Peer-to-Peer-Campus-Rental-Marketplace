import React, { useState } from "react";

export default function ProfilePage() {
  const [edit, setEdit] = useState(false);

  const [user, setUser] = useState({
    name: "Priyanshu",
    email: "test@gmail.com",
    trust: 4.5
  });

  const [form, setForm] = useState(user);

  const orders = [
    { id: 1, product: "Camera", status: "Completed" },
    { id: 2, product: "Calculator", status: "Active" }
  ];

  const products = [
    { id: 1, name: "DSLR Camera" },
    { id: 2, name: "Maths Book" }
  ];

  // Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save profile
  const handleSave = () => {
    setUser(form);
    setEdit(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      

      {/* USER INFO */}
      <div style={box}>
        <h2>👤 My Profile<br></br></h2>
        {edit ? (
          <>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={input}
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              style={input}
            />

            <button onClick={handleSave} style={saveBtn}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Trust Score:</b> ⭐ {user.trust}</p>

            <button onClick={() => setEdit(true)} style={editBtn}>
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* MY ORDERS */}
      <div style={box}>
        <h3>📦 My Orders</h3>
        {orders.map((o) => (
          <div key={o.id} style={item}>
            {o.product} - <b>{o.status}</b>
          </div>
        ))}
      </div>

      {/* MY PRODUCTS */}
      <div style={box}>
        <h3>🛒 My Products</h3>
        {products.map((p) => (
          <div key={p.id} style={item}>
            {p.name}
          </div>
        ))}
      </div>

      {/* LOGOUT */}
      <button
        style={logoutBtn}
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}

// STYLES
const box = {
  border: "1px solid #ccc",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px"
};

const input = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px"
};

const item = {
  padding: "5px 0",
  borderBottom: "1px solid #eee"
};

const editBtn = {
  padding: "8px",
  background: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px"
};

const saveBtn = {
  padding: "8px",
  background: "#28a745",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px"
};

const logoutBtn = {
  width: "100%",
  padding: "10px",
  background: "red",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px"
};