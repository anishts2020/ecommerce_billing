import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          MyShop
        </Link>

        {/* Right side menu */}
        <nav className="flex items-center space-x-6">

          <Link 
            to="/login"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Register
          </Link>

        </nav>
      </div>
    </header>
  );
}