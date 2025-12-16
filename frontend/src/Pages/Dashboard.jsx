import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopSellingModal from "../Modal/TopSellingModal";
import api from "../Api";

import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CubeIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  UsersIcon,
  UserGroupIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const [showTopSellingModal, setShowTopSellingModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sales, setSales] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState([]);

  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load user
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // API Call
        const res = await api.get("/products");

        // Axios returns JSON automatically in res.data
        const data = res.data;

        // Handle array or { data: [...] }
        const list = Array.isArray(data) ? data : data.data || [];

        const low = list.filter(
          (p) => Number(p.quantity_on_hand) <= 2
        );

        setProducts(list);
        setLowStock(low);

      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Total sales
  useEffect(() => {
    api
      .get("/total-sales-today")
      .then((res) => setTotalAmount(res.data.totalAmount || 0))
      .catch(() => setTotalAmount(0));
  }, []);

  // Load sales list when modal opens
  useEffect(() => {
    if (isModalOpen) {
      api
        .get("/total-sales-today")
        .then((res) => setSales(res.data.sales || []))
        .catch(() => setSales([]));
    }
  }, [isModalOpen]);

  // Load revenue
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await api.get("/total-revenue-today");
        const data = res.data;

        setTotalRevenue(data.totalRevenueToday);
        setRevenueData(data.productWiseRevenue);

      } catch (err) {
        console.error("Failed to fetch revenue:", err);
      }
    };

    fetchRevenue();
  }, []);

  if (!user) return <div className="p-4">Loading...</div>;

  // UI classes
  const cardClass =
    "p-4 h-32 bg-blue-200 rounded-xl shadow cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4";
  const iconClass = "h-10 w-10 text-blue-700";

  // Pagination
  const paginatedLowStock = lowStock.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(lowStock.length / itemsPerPage);

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">Welcome, {user.username}</h2>

      {/* ================= ROW 1 ================= */}
      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className={cardClass} onClick={() => navigate("/sales-invoice")}>
          <ChartBarIcon className={iconClass} />
          <div>
            <h3 className="font-semibold text-lg">Sales</h3>
            <p className="text-sm text-gray-600">Manage sales details</p>
          </div>
        </div>

        <div className={cardClass} onClick={() => navigate("/purchase-invoice")}>
          <ShoppingCartIcon className={iconClass} />
          <div>
            <h3 className="font-semibold text-lg">Purchase</h3>
            <p className="text-sm text-gray-600">Manage purchase details</p>
          </div>
        </div>
      </div>

    

      {/* ================= ROW 2 ================= */}
      <div className="grid grid-cols-2 gap-4 mt-6">

        {/* Total Sales Card */}
        <div className={cardClass} onClick={() => setIsModalOpen(true)}>
          <ChartBarIcon className={iconClass} />
          <div>
            <h3 className="font-semibold text-lg">Total Sales Today</h3>
            <p className="text-sm text-gray-600">₹ {totalAmount}</p>
          </div>
        </div>
         <div className={cardClass} onClick={() => setShowRevenueModal(true)}>
          <ChartBarIcon className={iconClass} />
          <div>
            <h3 className="font-semibold text-lg">Total Revenue Today</h3>
            <p className="text-sm text-gray-600">₹ {totalRevenue}</p>
          </div>
        </div>
       
      </div>


      {/* ================= ROW 3 ================= */}
      <div className="grid grid-cols-2 gap-4 mt-6">

       
        <div className={cardClass} onClick={() => setShowTopSellingModal(true)}>
          <ChartBarIcon className={iconClass} />
          <div>
            <h3 className="font-semibold text-lg">Top Selling Product</h3>
            <p className="text-sm text-gray-600">View highest selling</p>
          </div>
        </div>
        <div
          className={cardClass}
          onClick={() => lowStock.length > 0 && setShowModal(true)}
        >
          <CubeIcon className={iconClass} />
          <div>
            <h3 className="font-semibold text-lg">Low Stock</h3>
            <p className="text-red-600 font-bold">Count: {lowStock.length}</p>
          </div>
        </div>
      </div>

      {/* ================= SALES MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-3/4 max-w-4xl p-6 relative">

            <button
              className="absolute top-4 right-4 text-3xl"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-blue-600 text-center mb-4">
              Total Sales Today (₹ {totalAmount})
            </h2>

            <div className="max-h-[50vh] overflow-y-auto">
              <table className="w-full border">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 border">SI No</th>
                    <th className="p-3 border">Product Name</th>
                    <th className="p-3 border">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {sales.length ? (
                    sales.map((s, idx) => (
                      <tr key={idx} className="text-center">
                        <td className="p-2 border">{s.si_no}</td>
                        <td className="p-2 border">{s.product_name}</td>
                        <td className="p-2 border">{s.grand_total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center p-4 text-gray-500">
                        No sales today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-4">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REVENUE MODAL ================= */}
{showRevenueModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-xl w-[700px] max-h-[85vh] overflow-y-auto relative">

      {/* TOP RIGHT CLOSE BUTTON */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-black-600 text-2xl"
        onClick={() => setShowRevenueModal(false)}
      >
        ×
      </button>

      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Total Revenue Today: ₹ {totalRevenue}
      </h2>

      {/* ==== TABLE ALWAYS SHOWN ==== */}
      <table className="w-full border">
        <thead className="bg-blue-600 text-white text-center">
          <tr>
            <th className="p-3 border">SL No</th>
            <th className="p-3 border">Product Name</th>
            <th className="p-3 border">Revenue (₹)</th>
          </tr>
        </thead>

        <tbody>
          {revenueData.length === 0 ? (
            <tr>
              <td
                className="border p-4 text-center text-text-gray-500"
                colSpan={3}
              >
                No revenue today
              </td>
            </tr>
          ) : (
            revenueData.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-3">{index + 1}</td>
                <td className="border p-3">{item.product_name}</td>
                <td className="border p-3 text-green-700 font-bold">
                  ₹ {item.revenue}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="text-center mt-6">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          onClick={() => setShowRevenueModal(false)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}

      {/* ================= TOP SELLING MODAL ================= */}
      {showTopSellingModal && (
        <TopSellingModal onClose={() => setShowTopSellingModal(false)} />
      )}

      {/* ================= LOW STOCK MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-3xl">

            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Low Stock Products
            </h2>

            <table className="w-full border">
              <thead className="bg-blue-600 text-white text-center">
                <tr>
                  <th className="p-3 border">Code</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Qty</th>
                </tr>
              </thead>

              <tbody>
                {paginatedLowStock.map((p) => (
                  <tr key={p.product_id}>
                    <td className="p-3 border text-center">{p.product_code}</td>
                    <td className="p-3 border">{p.product_name}</td>
                    <td className="p-3 border">
                      {p.category?.product_category_name}
                    </td>
                    <td className="p-3 border text-center text-red-600 font-bold">
                      {p.quantity_on_hand}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lowStock.length > itemsPerPage && (
              <div className="flex justify-center gap-3 mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Prev
                </button>

                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  {currentPage}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Next
                </button>
              </div>
            )}

            <div className="text-right mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}