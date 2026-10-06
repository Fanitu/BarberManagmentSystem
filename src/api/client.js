const BASE_URL = "http://localhost:3000/api";

const request = async (path, { method = "GET", body } = {}) => {
  const headers = { "Content-Type": "application/json" };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Throw the specific API error (e.g., 400 Bad Request from backend)
      throw new Error(data.message || `Request failed (${res.status})`);
    }

    return data;
  } catch (error) {
    // 1. Log the REAL error to the console for debugging
    console.error("API Request Error:", error);

    // 2. Check if it's a network error (fetch failed to connect)
    if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
      // Throw a generic, friendly error to the UI
      throw new Error("Unable to connect to the server. Please check your internet connection or try again later.");
    }

    // 3. Throw the sanitized error (either the API message or a generic one)
    throw new Error(error.message || "Something went wrong. Please try again.");
  }
};

export default request;