export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : ""
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
};