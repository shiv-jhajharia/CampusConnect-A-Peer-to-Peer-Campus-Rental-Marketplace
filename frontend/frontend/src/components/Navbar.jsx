/*import { useState } from "react";

export default function Navbar() {
  const [active, setActive] = useState("Home");

  const menu = ["Home", "Products", "Orders", "Profile"];

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">

      <h1 className="text-lg font-bold">CampusRent</h1>

      <div className="flex gap-6">
        {menu.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`cursor-pointer ${
              active === item ? "underline text-yellow-300" : "hover:text-gray-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

    </div>
  );
}*/

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItem = (path, label) => (
    <button
      onClick={() => navigate(path)}
      className={`px-4 py-2 font-medium transition cursor-pointer ${
        location.pathname === path
          ? "text-blue-600 font-bold border-b-2 border-blue-600"
          : "text-gray-600 hover:text-blue-500"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="relative gap-4 p-10 bg-white shadow">
      <h1 className="absolute top-0 left-0  p-3 text-blue-600 text-3xl font-bold">CampusRent</h1>
      {/*navItem("/dashboard", "HOME")*/}
      <div className="absolute bottom-0 right-0">
      {navItem("/dashboard", "PRODUCTS")}
      {navItem("/orders", "ORDERS")}
      {navItem("/profile", "PROFILE")}
      </div>
    </div>
  );
}