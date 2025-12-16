// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginModal from "../components/LoginModal";
import api from "../api/api"; // your axios instance

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  console.log(JSON.parse(sessionStorage.getItem("user")));

  useEffect(() => {
    // load user from sessionStorage (session-like)
    const u = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    }

    // if token present, set default header on api
    if (token && api && api.defaults) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    if (api && api.defaults) delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const onLoginSuccess = (loggedUser) => {
    // parent handler called from LoginModal
    setUser(loggedUser || JSON.parse(sessionStorage.getItem("user") || "null"));
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            MyShop
          </Link>

          {/* Right side menu */}
          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-gray-700">Welcome, <span className="font-semibold text-indigo-700">{user?.name || user?.username }</span></span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Login
                </button>

                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Login Modal - separate file */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={onLoginSuccess}
      />
    </>
  );
}
