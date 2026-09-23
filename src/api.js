// All requests to the Django backend go through here. Nothing else in the
// app should call fetch() directly — that keeps the "how do I talk to the
// server" logic in one place.

// In development this falls back to your local Django server. Once you
// deploy the backend to Render, set VITE_API_URL in a .env file (or in
// Netlify's environment variables) to your Render URL instead.
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  if (!res.ok) {
    let detail = "Something went wrong";
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      // response had no JSON body — keep the generic message
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null; // DELETE returns no body
  return res.json();
}

export function registerUser({ name, email, password }) {
  return fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then(handle);
}

export function loginUser({ email, password }) {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handle);
}

export function fetchPosts(token) {
  return fetch(`${API_URL}/posts`, {
    headers: authHeaders(token),
  }).then(handle);
}

export function createPost(text, token) {
  return fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ text }),
  }).then(handle);
}

export function toggleLike(postId, token) {
  return fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: authHeaders(token),
  }).then(handle);
}

export function deletePost(postId, token) {
  return fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  }).then(handle);
}