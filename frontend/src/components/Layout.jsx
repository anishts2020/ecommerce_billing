import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop default = open

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const submenuClass =
    "block px-3 py-2 rounded-md transition-all duration-200 hover:bg-white/20 hover:translate-x-1";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ======================
          SIDEBAR (Toggle Desktop + Mobile)
      ====================== */}
      <aside
        className={`
          bg-[#006699]/90 text-white shadow-xl p-4
          w-64 h-full flex-shrink-0
          fixed md:static inset-y-0 left-0 z-30
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-3 right-3 text-white text-xl md:block"
          onClick={() => setSidebarOpen(false)}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-6 tracking-wide">e-Billing</h2>

        <nav className="space-y-3">

          {/* DASHBOARD */}
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-md hover:bg-white/20 transition"
          >
            Dashboard
          </Link>

          {/* =======================
              SYSTEM MENU
          ======================= */}
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
                <Link to="/createuserroles" className={submenuClass}>User Roles</Link>
              </div>
            )}
          </div>

          {/* =======================
              MASTERS MENU
          ======================= */}
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
                <Link to="/add-product-images" className={submenuClass}>Add Product Images</Link>{/*MULTI IMAGE UPLOAD */}
                <Link to="/product-categories" className={submenuClass}>Product Categories</Link>
                <Link to="/product-types" className={submenuClass}>Product Types</Link>
                <Link to="/product-sizes" className={submenuClass}>Product Sizes</Link>
                <Link to="/materials" className={submenuClass}>Materials</Link>
                <Link to="/colors" className={submenuClass}>Colors</Link>
                <Link to="/vendors" className={submenuClass}>Vendors</Link>
                <Link to="/customers" className={submenuClass}>Customers</Link>
                <Link to="/employees" className={submenuClass}>Employees</Link>
                <Link to="/stiching" className={submenuClass}>Stiching</Link>
                <Link to="/carousel" className={submenuClass}>Carousel</Link>
                <Link to="/new-arrival" className={submenuClass}>
                  New Arrivals
                </Link>
                <Link to="/featured-product" className={submenuClass}>
                  Featured Product
                </Link>
                <Link to="/top-selling" className={submenuClass}>
                   Top Selling
                </Link>
                <Link to="/occational-products" className={submenuClass}>
                     Occational Product
                </Link>
              </div>
            )}
          </div>

          {/* =======================
              COUPONS MENU
          ======================= */}
          <div>
            <button
              onClick={() => toggleMenu("coupons")}
              className="w-full text-left font-semibold px-3 py-2 hover:bg-white/10 rounded"
            >
              Coupons & Discount
            </button>

            {openMenu === "coupons" && (
              <div className="ml-5 mt-1 space-y-1">
                <Link to="/coupon-master" className={submenuClass}>Coupon Master</Link>
                <Link to="/coupon-user" className={submenuClass}>Coupon User</Link>
                <Link to="/coupon-products" className={submenuClass}>Coupon Products</Link>
                <Link to="/coupon-category" className={submenuClass}>Coupon Categories</Link>
              </div>
            )}
          </div>

          {/* =======================
              PURCHASE MENU
          ======================= */}
          <div>
            <button
              onClick={() => toggleMenu("purchase")}
              className="w-full text-left font-semibold px-3 py-2 hover:bg-white/10 rounded"
            >
              Purchase
            </button>

            {openMenu === "purchase" && (
              <div className="ml-5 mt-1 space-y-1">
                <Link to="/purchase-invoice" className={submenuClass}>Add Invoice</Link>
                <Link to="/purchase_list" className={submenuClass}>Purchase Invoice List</Link>
                <Link to="/inventory-transactions" className={submenuClass}>Inventory Transactions</Link>
              </div>
            )}
          </div>

          {/* =======================
              SALES MENU
          ======================= */}
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

          {/* =======================
              CHARTS MENU
          ======================= */}
          <div>
            <button
              onClick={() => toggleMenu("charts")}
              className="w-full text-left font-semibold px-3 py-2 hover:bg:white/10 hover:bg-white/10 rounded"
            >
              Charts
            </button>

            {openMenu === "charts" && (
              <div className="ml-5 mt-1 space-y-1">
                <Link to="/purchaseChart" className={submenuClass}>Purchase Chart</Link>
                <Link to="/saleschart" className={submenuClass}>Sales Chart</Link>
                <Link to="/productcategorychart" className={submenuClass}>Product Category Chart</Link>
                <Link to="/productprofitbymonth" className={submenuClass}>Profit & Sales</Link>
              </div>
            )}
          </div>

          {/* =======================
              REPORT MENU
          ======================= */}
          <div>
            <button
              onClick={() => toggleMenu("report")}
              className="w-full text-left font-semibold px-3 py-2 hover:bg-white/10 rounded"
            >
              Report
            </button>

            {openMenu === "report" && (
              <div className="ml-5 mt-1 space-y-1">
                <Link to="/purchasereport" className={submenuClass}>Purchase Report</Link>
                <Link to="/salesreport" className={submenuClass}>Sales Report</Link>
              </div>
            )}
          </div>
       
        </nav>
      </aside>

      {/* ======================
          MAIN CONTENT AREA
      ====================== */}
      <div
        className={`
          flex-1 flex flex-col overflow-hidden transition-all duration-300
          ${sidebarOpen ? "md:ml-64" : "md:ml-0"}
        `}
      >
        {/* HEADER */}
        <header className="h-14 flex items-center px-6 bg-[#003366] text-white sticky top-0 z-20">

          {/* TOGGLE BUTTON (works in Desktop + Mobile) */}
          <button
            className="text-white mr-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          <h1 className="text-xl font-bold">Admin Dashboard</h1>

          <button
            onClick={handleLogout}
            className="ml-auto border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-[#006699] transition"
          >
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* FOOTER */}
        <footer className="bg-[#003366] text-white text-center text-sm py-2 shadow-inner">
          © {new Date().getFullYear()} Sita Softwares — All rights reserved.
        </footer>
      </div>
    </div>
  );
}