const BASE_URL = "http://127.0.0.1:8000/admin";

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