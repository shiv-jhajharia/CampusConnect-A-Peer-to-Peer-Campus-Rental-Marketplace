import React from "react";

export default function Modal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">

      {/* Modal Box */}
      <div className="bg-white p-6 rounded-xl w-96 relative 
                      transform scale-95 animate-fadeIn shadow-2xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl hover:scale-125 transition cursor-pointer"
        >
          ❌
        </button>

        <h2 className="text-lg font-bold mb-2">
          {data.name || "Order Details"}
        </h2>

        <p>Price: ₹{data.price || data.total_price}</p>

        <p className="mt-2 text-sm text-gray-600">
          ⏳ Remaining: 2 days
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Status: {data.status || "Active"}
        </p>

      </div>
    </div>
  );
}