import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <div className="min-h-screen bg-slate-50">
        {/* HEADER */}
        <header className="bg-white shadow mb-4">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Textile Billing Dashboard</h1>

            <div className="text-sm">
              Logged in as{" "}
              <span className="font-semibold">{user.username}</span> (
              {roles.join(", ")})
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="max-w-6xl mx-auto px-4 mt-4 pb-10">

          {/* ADMIN CARDS */}
          {isAdmin && (
            <div className="grid md:grid-cols-3 gap-4">

              {/* PRODUCT MANAGEMENT */}
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold mb-2">Product Management</h2>
                <p className="text-sm text-slate-600">
                  Add / edit products & manage categories.
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

              {/* INDIVIDUAL CARDS YOU REQUESTED */}

              {/* Vendors */}
              <div
                onClick={() => navigate("/vendors")}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h2 className="font-semibold mb-2">Vendors</h2>
                <p className="text-sm text-slate-600">Manage vendor details.</p>
              </div>

              {/* Product Sizes */}
              <div
                onClick={() => navigate("/product-sizes")}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h2 className="font-semibold mb-2">Product Sizes</h2>
                <p className="text-sm text-slate-600">
                  Add and manage product sizes.
                </p>
              </div>

              {/* Create User */}
              <div
                onClick={() => navigate("/createuser")}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h2 className="font-semibold mb-2">Create User</h2>
                <p className="text-sm text-slate-600">Add system users.</p>
              </div>

              {/* Colors */}
              <div
                onClick={() => navigate("/colors")}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h2 className="font-semibold mb-2">Colors</h2>
                <p className="text-sm text-slate-600">
                  Manage color database for products.
                </p>
              </div>

              {/* Materials */}
              <div
                onClick={() => navigate("/materials")}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h2 className="font-semibold mb-2">Materials</h2>
                <p className="text-sm text-slate-600">
                  Add and edit product materials.
                </p>
              </div>

              {/* Product Categories */}
              <div
                onClick={() => navigate("/productcategories")}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h2 className="font-semibold mb-2">Product Categories</h2>
                <p className="text-sm text-slate-600">
                  Manage product category types.
                </p>
              </div>

              {/* EMPLOYEE */}
              <div
                onClick={() => navigate("/employees")}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h2 className="font-semibold mb-2">Employee & Salary</h2>
                <p className="text-sm text-slate-600">
                  Manage employees and salary payments.
                </p>
              </div>

              {/* SALES INVOICE */}
              <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                <h2 className="font-semibold mb-2">Sales Invoice</h2>
                <p className="text-sm text-slate-600 mb-4">
                  Billing & Invoices
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/salesinvoice_list")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                  >
                    Invoice List
                  </button>

                  <button
                    onClick={() => navigate("/sales-invoice")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Add Invoice
                  </button>
                </div>
              </div>

              {/* CUSTOMER */}
              <div
                onClick={() => navigate("/customers")}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h2 className="font-semibold mb-2">Customer Management</h2>
                <p className="text-sm text-slate-600">
                  Manage customers & billing info.
                </p>
              </div>

              {/* USER ROLE SETTINGS */}
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold mb-2">User & Role Settings</h2>
                <p className="text-sm text-slate-600 mb-2">
                  Manage users & permissions.
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate("/createroles")}
                    className="text-blue-600 underline text-left"
                  >
                    Create Role
                  </button>

                  <button
                    onClick={() => navigate("/createuserroles")}
                    className="text-blue-600 underline text-left"
                  >
                    Create User Role
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* CASHIER CARD */}
          {isCashier && (
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div
                onClick={() => navigate("/sales-invoice")}
                className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h2 className="font-semibold mb-2">Billing</h2>
                <p className="text-sm text-slate-600">
                  Create daily sales invoices.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
