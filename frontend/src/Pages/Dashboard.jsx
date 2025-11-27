import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  if (!user) return <div className="p-4">Loading...</div>;

  const roles = user.roles || [];

  const isAdmin = roles.includes("ADMIN");
  const isCashier = roles.includes("CASHIER");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow mb-4">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Textile Billing Dashboard</h1>
          <div className="text-sm">
            Logged in as <span className="font-semibold">{user.username}</span>{" "}
            ({roles.join(", ")})
          </div>
        </div>
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

              <div
  onClick={() => navigate("/employees")}
  className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
>
  <h2 className="font-semibold mb-2">Employee & Salary</h2>
  <p className="text-sm text-slate-600">
    Manage employees, roles, salary payments.
  </p>
</div>
<div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">

  <h2 className="font-semibold mb-2">Sales Invoice</h2>
  <p className="text-sm text-slate-600 mb-4">
    Bills
  </p>

  <div className="flex gap-3">
    {/* Invoice List Button */}
    <button
      onClick={() => navigate("/salesinvoice_list")}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
    >
      Invoice List
    </button>

    {/* Add Invoice Button */}
    <button
      onClick={() => navigate("/sales-invoice")}
      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
    >
      Add Invoice
    </button>
  </div>

</div>


              <div
  onClick={() => navigate("/customers")}
  className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
>
  <h2 className="font-semibold mb-2">Customer & Sales</h2>
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
  );
}