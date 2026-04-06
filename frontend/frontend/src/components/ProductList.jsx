import React, { useEffect, useState } from "react";

/*const products = [
  {
    id: 1,
    title: "DSLR Camera",
    price: 300,
    category: "Electronics",
    available: true,
    image: "https://images-cdn.ubuy.qa/652e355bf5dfdf3a9369ad8a-nikon-d5600-dslr-camera-with-18-140mm.jpg"
  },
  {
    id: 2,
    title: "Engineering Maths Book",
    price: 50,
    category: "Books",
    available: false,
    image: "https://m.media-amazon.com/images/I/818E+8DPuFL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: 3,
    title: "Scientific Calculator",
    price: 80,
    category: "Electronics",
    available: true,
    image: "https://cdn.schoolspecialty.com/dec3efc1-da73-42e8-a873-b0f100545916/1572188_SPR_JPG%20Output.jpg?width=700&height=700&fit=bounds&canvas=700,700&bg-color=ffffff"
  }
];*/

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://127.0.0.1:8000/products");
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);
  return (
    <div style={styles.container}>
      
      <h1 style={styles.heading}>Available Products</h1>

      <div style={styles.grid}>
        {products.map((item) => (
          <div key={item.id} style={styles.card}>
            
            <img src={item.image} alt="" style={styles.image} />

            <div style={styles.content}>
              <h3>{item.title}</h3>

              <p style={styles.category}>{item.category}</p>

              <p style={styles.price}>₹{item.price} / day</p>

              <span
                style={{
                  ...styles.status,
                  backgroundColor: item.available ? "#28a745" : "#dc3545"
                }}
              >
                {item.available ? "Available" : "Rented"}
              </span>

              <button
                style={{
                  ...styles.button,
                  opacity: item.available ? 1 : 0.6,
                  cursor: item.available ? "pointer" : "not-allowed"
                }}
                disabled={!item.available}
              >
                Rent Now
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f5f7fb",
    minHeight: "100vh"
  },
  heading: {
    marginBottom: "20px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.3s",
    cursor: "pointer"
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover"
  },
  content: {
    padding: "15px"
  },
  category: {
    color: "#777",
    fontSize: "14px"
  },
  price: {
    fontWeight: "bold",
    margin: "10px 0"
  },
  status: {
    display: "inline-block",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "5px",
    fontSize: "12px",
    marginBottom: "10px"
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    transition: "0.3s"
  }
};