import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

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
                <p className="text-sm text-slate-600">
                  Add / edit categories, types, vendors, materials, products.
                </p>
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
  );
}