import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/order/${product.id}`)}
      className="relative bg-white p-4 rounded-xl shadow hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
    >

      {/* OUT OF STOCK */}
      {!product.available && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
          Out of Stock
        </div>
      )}

      {/* Image */}
      <img
        src={product.image || "https://via.placeholder.com/300"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg mb-3 transition-transform duration-300 hover:scale-110"
      />

      {/* Title */}
      <h2 className="text-lg font-semibold">{product.name}</h2>

      {/* Price */}
      <p className="text-gray-600">₹{product.price}/day</p>

      {/* Availability */}
      <p
        className={`text-sm mt-1 ${
          product.available ? "text-green-600" : "text-red-500"
        }`}
      >
        {product.available ? "Available" : "Not Available"}
      </p>

      {/* Buttons */}
      <div className="mt-3 flex gap-2">

        {/* View */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/order/${product.id}`);
          }}
          className="w-1/2 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition cursor-pointer"
        >
          View
        </button>

        {/* Buy */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/order/${product.id}`);
          }}
          disabled={!product.available}
          className={`w-1/2 py-2 rounded-lg text-white transition ${
            product.available
              ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Buy Now
        </button>

      </div>
    </div>
  );
}