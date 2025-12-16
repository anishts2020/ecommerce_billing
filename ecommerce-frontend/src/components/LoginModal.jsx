// src/components/LoginModal.jsx
import React, { useState, useEffect } from "react";
import api from "../api/api"; // axios instance

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔥 RESET INPUTS WHEN MODAL OPENS */
  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/ecommerce-login", {
        username,
        password,
      });

      // Extract token & user
      const token = res.data?.access_token || null;
      const user = res.data?.user || null;

      // Fix username display
      const fixedUser = {
        ...user,
        display_name: user?.name || user?.username || user?.email || "User",
      };

      // Save to sessionStorage
      if (token) sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(fixedUser));

      // Apply authorization for API instance
      if (api.defaults && token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      // Notify parent
      if (onLoginSuccess) onLoginSuccess(fixedUser);

      // Close modal
      onClose();
    } catch (err) {
      console.error("Login failed:", err);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-indigo-700">Login</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            ✕
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium">Username or Email</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              placeholder="Enter username or email"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              placeholder="Enter password"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
