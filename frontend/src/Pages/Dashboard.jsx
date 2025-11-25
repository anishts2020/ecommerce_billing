import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      {/* Top Navigation */}
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
               Vendors
              </Link>
            </li>
          )}

          {isAdmin && (
            <li>
              <Link to="/product-sizes" className="hover:underline">
                Product Sizes
              </Link>
            </li>
          )}
           {isAdmin && (
            <li>
              <Link to="/CreateUser" className="hover:underline">
                Create User
              </Link>
            </li>
          )}
    {isAdmin && (
            <li>
              <Link to="/colors" className="hover:underline">
                Colors
              </Link>
            </li>
          )}
           {isAdmin && (
            <li>
              <Link to="/Materials" className="hover:underline">
               Materials
              </Link>
            </li>
          )}
             {isAdmin && (
            <li>
              <Link to="/ProductCategories" className="hover:underline">
               ProductCategories
              </Link>
            </li>
          )}
          <li>
            <Link to="/login" className="hover:underline">
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      {/* Header */}
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow mb-4">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold">Textile Billing Dashboard</h1>
            <div className="text-sm">
              Logged in as{" "}
              <span className="font-semibold">{user.username}</span> (
              {roles.join(", ")})
            </div>
          </div>
        </header>

        {/* <a href="/Materials" className="ml-4 text-blue-600 underline">
          Materials
        </a> */}

        {/* MAIN CONTENT */}
        <main className="max-w-6xl mx-auto px-4 mt-4">
          <div className="grid md:grid-cols-3 gap-4">

            {/* Admin Cards */}
            {isAdmin && (
              <>
                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="font-semibold mb-2">Product Management</h2>
                  <p className="text-sm text-slate-600">
                    Add / edit categories, types, vendors, materials, products.
                  </p>

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

                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="font-semibold mb-2">User & Role Settings</h2>
                  <p className="text-sm text-slate-600 mb-2">
                    Manage roles & permissions.
                  </p>

                  <div className="flex flex-col gap-2">
                    <a href="/createroles" className="text-blue-600 underline">
                      Create Role
                    </a>
                    <a href="/createuserroles" className="text-blue-600 underline">
                      Create User Role
                    </a>
                  </div>
                </div>
              </>
            )}

            {/* Cashier Cards */}
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