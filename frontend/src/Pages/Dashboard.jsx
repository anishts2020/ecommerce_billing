import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom"; // <-- import Link
import toast from "react-hot-toast";

export default function Dashboard() {
  
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  if (!user) return <div className="p-4">Loading...</div>;

  const roles = user.roles || [];
  const isAdmin = roles.includes("ADMIN");
  const isCashier = roles.includes("CASHIER");



  return (
    <>
      <nav>
        <ul className="flex space-x-4 bg-gray-800 p-4 text-white">
          <li>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/vendors" className="hover:underline">
                Create User
              </Link>
            </li>
          )}
          <li>
            <Link to="/login" className="hover:underline">
              Logout
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/product-sizes" className="hover:underline">
                Product Sizes
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <a href="/color-form">colors</a>

      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow mb-4">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold">Textile Billing Dashboard</h1>
            <div className="text-sm">
              Logged in as <span className="font-semibold">{user.username}</span>{" "}
              ({roles.join(", ")})
            </div>
          </div>
        </div>
      </header>
      <a href="/Materials">Materials </a>
        </header>

        <main className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {isAdmin && (
              <>
                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="font-semibold mb-2">Product Management</h2>
                  <p className="text-sm text-slate-600">
                    Add / edit categories, types, vendors, materials, products.
                  </p>
                </div>
        <p className="text-center mt-4">
          <a href="/createroles" className="auth-link">
            Create Role
          </a>
        </p>
        <p className="text-center mt-4">
          <a href="/createuserroles" className="auth-link">
            Create User Role
          </a>
        </p>
      <main className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-4">
          {isAdmin && (
            <>
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold mb-2">Product Management</h2>
                <p className="text-sm text-slate-600"> </p>
                  Add / edit categories, types, vendors, materials, products.
                  
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => navigate("/add-product")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Product
                    </button>

                    <button
                      onClick={() => navigate("/view-products")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      View Products
                    </button>
                  </div>


                
              </div>

                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="font-semibold mb-2">Employee & Salary</h2>
                  <p className="text-sm text-slate-600">
                    Manage employees, roles, salary payments.
                  </p>
                </div>
              </>
            )}

            {isCashier && (
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold mb-2">Billing</h2>
                <p className="text-sm text-slate-600">
                  Create new bills and manage daily sales.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
