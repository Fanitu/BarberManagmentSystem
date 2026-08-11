const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://barbermanagmentsystembackend-production.up.railway.app/api";

const request = async (path, { method = "GET", body } = {}) => {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // This is crucial - sends cookies
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

export default request;
