import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function OrderPage() {
  const { id } = useParams();

  const product = {
    id: id,
    name: "Product",
    price: 500,
    image: "https://via.placeholder.com/300"
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [total, setTotal] = useState(0);

  // Calculate total price
  const calculateTotal = (start, end) => {
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);

      const diffTime = e - s;
      const days = diffTime / (1000 * 60 * 60 * 24);

      if (days > 0) {
        setTotal(days * product.price);
      } else {
        setTotal(0);
      }
    }
  };

  // Handle booking
  /*const handleBooking = () => {
    if (!startDate || !endDate) {
      alert("Please select dates");
      return;
    }

    if (total <= 0) {
      alert("Invalid date range");
      return;
    }

    console.log({
      product_id: product.id,
      startDate,
      endDate,
      total
    });

    alert("Booking Successful 🚀");
  };*/
  const navigate = useNavigate();
  
  const handleBooking = async () => {
  if (!startDate || !endDate) {
    alert("Please select dates");
    return;
  }

  if (total <= 0) {
    alert("Invalid date range");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
        body: JSON.stringify({
        product_id: product.id,
        start_date: startDate,
        end_date: endDate
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.detail);

    localStorage.setItem("order_id", data.order_id);

    alert("Order placed 🚀");

    navigate("/payment");
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>📦 Book Product</h2>

      {/* PRODUCT DETAILS */}
      <div style={{ textAlign: "center" }}>
        <img
          src={product.image}
          alt="product"
          style={{ width: "100%", borderRadius: "10px" }}
        />
        <h3>{product.name}</h3>
        <p>₹{product.price} / day</p>
      </div>

      {/* DATE SELECTION */}
      <div style={{ marginTop: "20px" }}>
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            calculateTotal(e.target.value, endDate);
          }}
          style={inputStyle}
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            calculateTotal(startDate, e.target.value);
          }}
          style={inputStyle}
        />
      </div>

      {/* TOTAL PRICE */}
      <div style={{ marginTop: "15px" }}>
        <h3>Total: ₹{total}</h3>
      </div>

      {/* BUTTON */}
      <button onClick={handleBooking} style={buttonStyle}>
        Confirm Booking
      </button>
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  cursor: "pointer"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};