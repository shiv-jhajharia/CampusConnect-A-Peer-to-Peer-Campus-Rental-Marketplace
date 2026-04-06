import React, { useState } from "react";

export default function PaymentPage() {
  const [method, setMethod] = useState("");

  const order = {
    product: "DSLR Camera",
    total: 1500,
    days: 3
  };

  /*const handlePayment = () => {
    if (!method) {
      alert("Please select payment method");
      return;
    }

    if (method === "cash") {
      alert("Cash on Delivery Selected 💵\nPay when receiving item.");
    } else {
      alert("Redirecting to UPI App 💳");
    }

    console.log("Payment Method:", method);
  };*/

  const handlePayment = async () => {
  if (!method) {
    alert("Please select payment method");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const order_id = localStorage.getItem("order_id");

    const res = await fetch("http://127.0.0.1:8000/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        order_id: order_id,
        amount: order.total
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.detail);

    alert("Payment successful 💳");

  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>💳 Payment</h2>

      {/* ORDER SUMMARY */}
      <div style={box}>
        <h3>Order Summary</h3>
        <p><b>Product:</b> {order.product}</p>
        <p><b>Days:</b> {order.days}</p>
        <p><b>Total:</b> ₹{order.total}</p>
      </div>

      {/* PAYMENT OPTIONS */}
      <h3>Select Payment Method</h3>

      {/* ONLINE */}
      <div
        style={{
          ...optionStyle,
          border: method === "upi" ? "2px solid blue" : "1px solid #ccc"
        }}
        onClick={() => setMethod("upi")}
      >
        💳 UPI Payment

        {method === "upi" && (
          <div style={{ marginTop: "10px" }}>
            <button style={upiBtn}>PhonePe</button>
            <button style={upiBtn}>Google Pay</button>
            <button style={upiBtn}>Paytm</button>
          </div>
        )}
      </div>

      {/* CASH */}
      <div
        style={{
          ...optionStyle,
          border: method === "cash" ? "2px solid green" : "1px solid #ccc"
        }}
        onClick={() => setMethod("cash")}
      >
        💵 Cash on Delivery
      </div>

      {/* ESCROW INFO */}
      <div style={escrowBox}>
        <h4>🔐 Secure Escrow Payment</h4>
        <p>
          Your payment is held securely and released only after successful item return.
          This ensures safety for both renter and owner.
        </p>
      </div>

      {/* PAY BUTTON */}
      <button
      onClick={handlePayment}
      style={payBtn}
      className="cursor-pointer hover:bg-green-600 transition"
      >
        Proceed to Pay
      </button>
    </div>
  );
}

// STYLES
const box = {
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "10px",
  marginBottom: "15px"
};

const optionStyle = {
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "0.3s"
};

const upiBtn = {
  margin: "5px",
  padding: "5px 10px",
  cursor: "pointer"
};

const escrowBox = {
  background: "#f1f8ff",
  padding: "10px",
  borderRadius: "10px",
  marginTop: "15px"
};

const payBtn = {
  width: "100%",
  padding: "10px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "15px"
};