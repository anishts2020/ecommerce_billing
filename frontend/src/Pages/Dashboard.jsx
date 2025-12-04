
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopSellingModal from "../Modal/TopSellingModal";

// Import Icons
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
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sales, setSales] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load user from localStorage
  // NEW STATES
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // PAGINATION 🔥
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));

    // LOAD PRODUCTS & CALCULATE LOW STOCK
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/products");
        const data = await res.json();

        const list = Array.isArray(data) ? data : data.data || [];

        // LOW STOCK CONDITION (≤ 2)
        const low = list.filter((p) => Number(p.quantity_on_hand) <= 2);

        setProducts(list);
        setLowStock(low);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchProducts();
  }, []);

  // Fetch Total Sales (dashboard)
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/total-sales-today")
      .then((res) => {
        setTotalAmount(res.data.totalAmount || 0);
      })
      .catch(() => {
        setTotalAmount(0);
      });
  }, []);

  // Fetch sales list when modal opens
  useEffect(() => {
    if (isModalOpen) {
      axios
        .get("http://localhost:8000/api/total-sales-today")
        .then((res) => {
          setSales(res.data.sales || []);
        })
        .catch(() => {
          setSales([]);
        });
    }
  }, [isModalOpen]);

  if (!user) return <div>Loading...</div>;

  const cardClass =
    "p-4 h-32 bg-blue-200 rounded-xl shadow cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4";
  const iconClass = "h-10 w-10 text-blue-700";

  // PAGINATED LOW STOCK LIST
  const paginatedLowStock = lowStock.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(lowStock.length / itemsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Welcome, {user.username}</h2>

      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          <div className={cardClass} onClick={() => navigate("/vendors")}>
            <BuildingStorefrontIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Vendors</h3>
              <p className="text-sm text-gray-600">Manage vendor details</p>
            </div>
          </div>

          <div className={cardClass} onClick={() => navigate("/sales-invoice")}>
            <ChartBarIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Sales</h3>
              <p className="text-sm text-gray-600">Manage sales details</p>
            </div>
          </div>

          <div className={cardClass} onClick={() => navigate("/purchase-invoice")}>
          {/* Purchase */}
          <div
            className={cardClass}
            onClick={() => navigate("/purchase-invoice")}
          >
            <ShoppingCartIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Purchase</h3>
              <p className="text-sm text-gray-600">Manage purchase details</p>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-4">
          <div className={cardClass} onClick={() => navigate("/view-products")}>
            <CubeIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Products</h3>
              <p className="text-sm text-gray-600">Manage product details</p>
            </div>
          </div>

          <div className={cardClass} onClick={() => navigate("/product-categories")}>
            <Squares2X2Icon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Product Category</h3>
              <p className="text-sm text-gray-600">Manage product category</p>
            </div>
          </div>

          <div className={cardClass} onClick={() => navigate("/materials")}>
            <ClipboardDocumentListIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Materials</h3>
              <p className="text-sm text-gray-600">Manage material details</p>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-4 gap-4">
          <div className={cardClass} onClick={() => navigate("/customers")}>
            <UsersIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Customers</h3>
              <p className="text-sm text-gray-600">Manage customer details</p>
            </div>
          </div>

          <div className={cardClass} onClick={() => navigate("/employees")}>
            <UserGroupIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Employees</h3>
              <p className="text-sm text-gray-600">Manage employees</p>
            </div>
          </div>

          <div className={cardClass} onClick={() => navigate("/createuser")}>
            <UserCircleIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Users</h3>
              <p className="text-sm text-gray-600">Manage user accounts</p>
            </div>
          </div>

          {/* Total Sales Today */}
          <div className={cardClass} onClick={() => setIsModalOpen(true)}>
            <ChartBarIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Total Sales Today</h3>
              <p className="text-sm text-gray-600">
                ₹:{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Sales Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Blur Background */}
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 md:w-3/4 max-w-4xl max-h-[80vh] flex flex-col p-6">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold transition"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-blue-700">
                Total Sales Today
              </h2>
              <p className="text-lg text-gray-600 font-semibold mt-1">
                Grand Total: {" "}
                <span className="text-blue-600">{totalAmount.toLocaleString()}</span>
              </p>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b">
                      SI No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium border-b">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium border-b">
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length > 0 ? (
                    sales.map((s, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors duration-200 ${
                          idx % 2 === 0 ? "bg-gray-50 hover:bg-blue-50" : "hover:bg-blue-50"
                        }`}
                      >
                        <td className="px-4 py-2 text-sm text-gray-700">{s.si_no}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{s.product_name}</td>
                        <td className="px-4 py-2 text-sm text-gray-700 text-right">
                          {s.grand_total.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-6 text-gray-400 font-medium"
                      >
                        No sales found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-center mt-4">
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                onClick={() => setIsModalOpen(false)}


          {/* Top Selling Product Card */}
          <div className={cardClass} onClick={() => setShowTopSellingModal(true)}>
            <ChartBarIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Top Selling Product</h3>
              <p className="text-sm text-gray-600">View products with highest sales</p>
            </div>
          </div>

          {/* Modal */}
          {showTopSellingModal && (
            <TopSellingModal onClose={() => setShowTopSellingModal(false)} />
          )}




        </div>

          {/* Low Stock Products */}
          <div
            className={cardClass}
            onClick={() => lowStock.length > 0 && setShowModal(true)}
          >
            <CubeIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Low Stock Products</h3>
              <h4 className="text-red-600 font-bold">
                Count: {lowStock.length}
              </h4>
            </div>
          </div>

        </div>
      </div>

      {/* =======================
            LOW STOCK MODAL
      ======================= */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-2xl border">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-700">Low Stock Products</h2>

              
            </div>

            {/* Table */}
            <table className="w-full border rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 border">Code</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Qty</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {paginatedLowStock.map((p) => (
                  <tr key={p.product_id} className="border hover:bg-gray-50">
                    <td className="p-3 border text-center">{p.product_code}</td>
                    <td className="p-3 border">{p.product_name}</td>
                    <td className="p-3 border">
                      {p.category?.product_category_name || "-"}
                    </td>
                    <td className="p-3 border text-center font-bold text-red-600">
                      {p.quantity_on_hand}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Buttons */}
            {lowStock.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-3 mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  {currentPage}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            <div className="text-right mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

          </div>
        </div>
      )}

    </div>
  );
}