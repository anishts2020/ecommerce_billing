import React, { useState, useEffect } from "react";
import api from "../api/api";  // adjust path if needed

// Success Alert Component
const SuccessAlert = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl w-96 border-t-8 border-green-500 shadow-xl flex flex-col items-center space-y-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-12 h-12 text-green-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-xl font-bold text-center">{title}</h1>
        <p className="text-gray-600 text-center">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default function RegisterModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [successAlert, setSuccessAlert] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPassword("");
      setMobile("");
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    else if (!/^[A-Za-z\s]+$/.test(name)) newErrors.name = "Name can only contain letters and spaces";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!mobile.trim()) newErrors.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(mobile)) newErrors.mobile = "Mobile must be 10 digits";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const resp = await api.post("/users", { name, email, password, mobile });
      console.log("User created:", resp.data);

      setSuccessAlert({
        isOpen: true,
        title: "Registration Successful",
        message: "Your account has been created successfully!",
      });
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data) setErrors({ server: "Registration failed" });
      else setErrors({ server: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-md bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="text-xl mb-4 text-center font-bold">Register</h2>

          {errors.server && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errors.server}</div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                autoComplete="off"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                autoComplete="off"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                autoComplete="new-password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

      <div>
  <label className="block mb-1">Mobile</label>
  <input
    type="text"
    value={mobile}
    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} // only digits allowed
    className="w-full border px-3 py-2 rounded"
    autoComplete="off"
    maxLength={10} // optional: limit to 10 digits
  />
  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
</div>


            {/* Submit button at bottom-right */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Alert */}
      <SuccessAlert
        isOpen={successAlert.isOpen}
        title={successAlert.title}
        message={successAlert.message}
        onClose={() => {
          setSuccessAlert({ ...successAlert, isOpen: false });
          onClose();
        }}
      />
    </>
  );
}
