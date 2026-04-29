import { API_URL } from "../config";

const BASE_URL = `${API_URL}/admin`;

const getToken = () => localStorage.getItem("token");

export const fetchStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!res.ok) throw new Error("API Failed");
  return res.json();
};

export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users-full`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!res.ok) throw new Error("API Failed");
  return res.json();
};

export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!res.ok) throw new Error("API Failed");
  return res.json();
};

export const fetchOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
    if (!res.ok) throw new Error("API Failed");
    return res.json();
};

export const deleteUserApi = async (userId) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("API Failed");
  return res.json();
};

export const deleteProductApi = async (productId) => {
  const res = await fetch(`${BASE_URL}/product/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("API Failed");
  return res.json();
};

export const deleteOrderApi = async (orderId) => {
  const res = await fetch(`${BASE_URL}/order/${orderId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("API Failed");
  return res.json();
};
