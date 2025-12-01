import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  
  // Track which menu is expanded
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const submenuClass = "block px-3 py-2 rounded-md transition-all duration-200 hover:bg-white/20 hover:translate-x-1";

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#006699]/90 text-white overflow-y-auto p-4 shadow-xl">
        <h2 className="text-xl font-bold mb-6 tracking-wide">e-Billing</h2>

        <nav className="space-y-3">

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-md hover:bg-white/20 transition"
          >
            Dashboard
          </Link>

          {/* SYSTEM */}
          <div>
            <button
              onClick={() => toggleMenu("system")}
              className="w-full text-left font-semibold px-3 py-2 hover:bg-white/10 rounded"
            >
              System
            </button>

            {openMenu === "system" && (
              <div className="ml-5 mt-1 space-y-1">
                <Link to="/createuser" className={submenuClass}>Users</Link>
                <Link to="/createroles" className={submenuClass}>Roles</Link>
              </div>
            )}
          </div>

          {/* MASTERS */}
          <div>
            <button
              onClick={() => toggleMenu("masters")}
              className="w-full text-left font-semibold px-3 py-2 hover:bg-white/10 rounded"
            >
              Masters
            </button>

            {openMenu === "masters" && (
              <div className="ml-5 mt-1 space-y-1">
                <Link to="/view-products" className={submenuClass}>Products</Link>
                <Link to="/product-categories" className={submenuClass}>Product Categories</Link>
                <Link to="/product-sizes" className={submenuClass}>Product Sizes</Link>
                <Link to="/materials" className={submenuClass}>Materials</Link>
                <Link to="/colors" className={submenuClass}>Colors</Link>
                <Link to="/vendors" className={submenuClass}>Vendors</Link>
                <Link to="/customers" className={submenuClass}>Customers</Link>
                <Link to="/employees" className={submenuClass}>Employees</Link>
              </div>
            )}
          </div>

          {/* PURCHASE */}
          <div>
            <button
              onClick={() => toggleMenu("purchase")}
              className="w-full text-left font-semibold px-3 py-2 hover:bg-white/10 rounded"
            >
              Purchase
            </button>

            {openMenu === "purchase" && (
              <div className="ml-5 mt-1 space-y-1">
                <Link to="/purchase-invoice-items" className={submenuClass}>Invoice</Link>
                <Link to="/inventory-transactions" className={submenuClass}>Inventory</Link>
              </div>
            )}
          </div>

          {/* SALES */}
          <div>
            <button
              onClick={() => toggleMenu("sales")}
              className="w-full text-left font-semibold px-3 py-2 hover:bg-white/10 rounded"
            >
              Sales
            </button>

            {openMenu === "sales" && (
              <div className="ml-5 mt-1 space-y-1">
                <Link to="/salesinvoice_list" className={submenuClass}>Invoice List</Link>
                <Link to="/sales-invoice" className={submenuClass}>Add Invoice</Link>
              </div>
            )}
          </div>

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP HEADER */}
        <div className="admin-header">



        <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-20"
            style={{ backgroundColor: "#003366" }}>

            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>

            <button
              onClick={handleLogout}
              className="border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-[#006699] transition"
            >
              Logout
            </button>
          </header>
        </div>

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>

        {/* FOOTER */}
        <footer className="bg-[#003366] text-white text-center text-sm py-2 shadow-inner">
        © {new Date().getFullYear()} sita softwares — All rights reserved.
        </footer>

      </div>
    </div>
  );
}