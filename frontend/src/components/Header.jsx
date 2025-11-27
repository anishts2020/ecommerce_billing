import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-900/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Left: Logo */}
        <h1 className="text-xl font-bold text-white tracking-wide">
          eBilling
        </h1>

        {/* Right: Logout Button */}
        <button
          onClick={handleLogout}
          className="text-white font-semibold px-4 py-1 rounded-lg 
          hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}