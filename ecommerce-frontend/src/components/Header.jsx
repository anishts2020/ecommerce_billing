import { useState } from "react";
import { Link } from "react-router-dom";
import RegisterModal from "./RegisterModal";

export default function Header() {
  const [showRegister, setShowRegister] = useState(false);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setShowRegister(true);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          MyShop
        </Link>

        <nav className="flex items-center space-x-6">
              <Link
            to="/address"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
           Address
          </Link>

          <Link
            to="/login"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={handleRegisterClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Register
          </Link>
        </nav>
      </div>

      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)} 
      />
    </header>
  );
}
