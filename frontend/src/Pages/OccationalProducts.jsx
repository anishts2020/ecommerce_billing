import React, { useEffect, useState } from "react";
import axios from "axios";

// ===================================================
// ICONS
// ===================================================
const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ===================================================
// ALERT
// ===================================================
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  const icon =
    type === "success" ? (
      <CheckCircleIcon className="w-10 h-10 text-green-500" />
    ) : (
      <XCircleIcon className="w-10 h-10 text-red-500" />
    );

  const color =
    type === "success"
      ? "border-green-500 bg-green-600 hover:bg-green-700"
      : "border-red-500 bg-red-600 hover:bg-red-700";

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white p-6 rounded-xl w-96 border-t-8 shadow-xl ${color.split(" ")[0]}`}
      >
        <div className="flex flex-col items-center gap-3">
          {icon}
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-gray-600 text-center">{message}</p>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 text-white rounded-lg ${color}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// ===================================================
// MAIN COMPONENT
// ===================================================
export default function OccationalProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [showOccationalOnly, setShowOccationalOnly] = useState(false);

  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const closeAlert = () =>
    setAlertState({ isOpen: false, title: "", message: "", type: "success" });

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ================= SET / RESET OCCATIONAL =================
  const handleSetOccational = (product_code) => {
    axios.post("http://127.0.0.1:8000/api/products/occational", { product_code })
      .then(() => {
        setAlertState({
          isOpen: true,
          title: "Success",
          message: "Product set as Occational",
          type: "success",
        });
        setProducts(prev =>
          prev.map(p =>
            p.product_code === product_code ? { ...p, occational_products: 1 } : p
          )
        );
      })
      .catch(() => {
        setAlertState({
          isOpen: true,
          title: "Error",
          message: "Failed to set product",
          type: "error",
        });
      });
  };

  const handleResetOccational = (product_code) => {
    axios.delete("http://127.0.0.1:8000/api/products/occational", { data: { product_code } })
      .then(() => {
        setAlertState({
          isOpen: true,
          title: "Success",
          message: "Product reset successfully",
          type: "success",
        });
        setProducts(prev =>
          prev.map(p =>
            p.product_code === product_code ? { ...p, occational_products: 0 } : p
          )
        );
      })
      .catch(() => {
        setAlertState({
          isOpen: true,
          title: "Error",
          message: "Failed to reset product",
          type: "error",
        });
      });
  };

  // ================= FILTER + SORT =================
  const filteredProducts = [...products]
    .filter(p => {
      if (showOccationalOnly && p.occational_products !== 1) return false;
      return (
        p.product_name.toLowerCase().includes(search.toLowerCase()) ||
        p.product_code.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      // ⭐ Show set Occational products first
      if (b.occational_products !== a.occational_products) {
        return b.occational_products - a.occational_products;
      }
      // 🕒 Then sort by date
      const dateA = new Date(a.created_at || a.createdAt);
      const dateB = new Date(b.created_at || b.createdAt);
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredProducts.slice(start, start + itemsPerPage);

  // Helper to format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">

      {/* ===== TOP ROW: Heading + Search + Filter + Toggle ===== */}
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-5xl mb-6 flex items-center gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-indigo-600 flex-shrink-0">🛍️ Occational Products</h1>

        <input
          type="text"
          placeholder="Search by name or code..."
          className="border rounded-full px-4 py-2 flex-1 min-w-[200px]"
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        />

        <select
          className="border rounded-full px-4 py-2"
          value={order}
          onChange={e => setOrder(e.target.value)}
        >
          <option value="desc">Latest</option>
          <option value="asc">Oldest</option>
        </select>

        <label className="flex items-center gap-2 ml-2">
          <input
            type="checkbox"
            checked={showOccationalOnly}
            onChange={() => { setShowOccationalOnly(prev => !prev); setCurrentPage(1); }}
            className="h-4 w-4"
          />
          <span className="text-gray-700">Show Only Occational Products</span>
        </label>
      </div>

      {/* ===== TABLE / VIEW SECTION ===== */}
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-5xl">
        <table className="w-full border">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="border px-4 py-2">Sl No</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Product Code</th>
              <th className="border px-4 py-2">Date & Time</th> {/* New column */}
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No data found</td>
              </tr>
            ) : (
              paginatedData.map((p, i) => (
                <tr
                  key={p.product_id}
                  className={`text-center hover:bg-gray-50 ${p.occational_products === 1 ? "bg-green-100" : ""}`}
                >
                  <td className="border px-4 py-2">{start + i + 1}</td>
                  <td className="border px-4 py-2 font-medium">
                    {p.product_name}
                    {p.occational_products === 1 && (
                      <span className="ml-2 text-sm text-green-700 font-semibold">(Occational)</span>
                    )}
                  </td>
                  <td className="border px-4 py-2">{p.product_code}</td>
                  <td className="border px-4 py-2">{formatDate(p.created_at)}</td> {/* Display date */}
                  <td className="border px-4 py-2">
                    {p.occational_products === 1 ? (
                      <button
                        onClick={() => handleResetOccational(p.product_code)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Reset
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSetOccational(p.product_code)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Set
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-indigo-600 text-white" : ""}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <CustomAlert {...alertState} onConfirm={closeAlert} onClose={closeAlert} />
    </div>
  );
}