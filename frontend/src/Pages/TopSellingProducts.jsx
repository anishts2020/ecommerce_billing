import React, { useEffect, useState } from "react";
import api from "../api";

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
    type === "success"
      ? <CheckCircleIcon className="w-10 h-10 text-green-500" />
      : <XCircleIcon className="w-10 h-10 text-red-500" />;

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
export default function TopSellingProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [dateSort, setDateSort] = useState("latest");
  const [onlyTopSelling, setOnlyTopSelling] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const closeAlert = () =>
    setAlertState({ isOpen: false, title: "", message: "", type: "success" });

  // ================= FETCH =================
  useEffect(() => {
    api.get("/products").then((res) => {
      const list = Array.isArray(res.data) ? res.data : res.data.data || [];
      setProducts(list);
    });
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateSort, onlyTopSelling]);

  // ================= SET =================
  const handleSetTopSeller = (id) => {
    api.post("/products/set-top-seller", { product_id: id }).then(() => {
      setAlertState({
        isOpen: true,
        title: "Success",
        message: "Product set as top seller",
        type: "success",
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === id ? { ...p, top_sellers: 1 } : p
        )
      );
    });
  };

  // ================= RESET =================
  const handleResetTopSeller = (id) => {
    api.post("/products/reset-top-seller", { product_id: id }).then(() => {
      setAlertState({
        isOpen: true,
        title: "Success",
        message: "Product reset successfully",
        type: "success",
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === id ? { ...p, top_sellers: 0 } : p
        )
      );
    });
  };

  // ================= FILTER + SORT =================
  const filteredProducts = [...products]
    .filter((p) => {
      const matchesSearch =
        (p.product_name || "").toLowerCase().includes(search.trim().toLowerCase()) ||
        (p.product_code || "").toLowerCase().includes(search.trim().toLowerCase());

      const matchesTopSelling = onlyTopSelling ? p.top_sellers === 1 : true;

      return matchesSearch && matchesTopSelling;
    })
    .sort((a, b) => {
      if (b.top_sellers !== a.top_sellers) {
        return b.top_sellers - a.top_sellers;
      }

      const dateA = new Date(a.created_at || a.createdAt);
      const dateB = new Date(b.created_at || b.createdAt);

      return dateSort === "latest" ? dateB - dateA : dateA - dateB;
    });

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">

      {/* 🔹 Header Container */}
      <div className="bg-white p-6 rounded-xl shadow flex flex-wrap items-center justify-between gap-4 mb-6 w-full max-w-4xl">

        {/* Heading */}
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🔥 Top Selling Products
        </h1>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-4">

          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-full px-4 py-2 w-48 outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Sort */}
          <select
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}
            className="border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>

          {/* Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={onlyTopSelling}
              onChange={(e) => setOnlyTopSelling(e.target.checked)}
            />
            <span className="text-sm font-medium">Show only Top Selling</span>
          </label>

        </div>
      </div>

      {/* 🔹 Table */}
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-4xl">
        <table className="w-full border">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="border px-4 py-2">Sl No</th>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Product Code</th>
              <th className="border px-4 py-2">Date & Time</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p, i) => (
              <tr key={p.product_id} className="text-center">
                <td className="border px-4 py-2">
                  {(currentPage - 1) * itemsPerPage + i + 1}
                </td>

                <td className="border px-4 py-2 font-medium">
                  {p.product_name}
                  {p.top_sellers === 1 && (
                    <span className="ml-2 text-sm text-green-600 font-semibold">
                      (Top Selling)
                    </span>
                  )}
                </td>

                <td className="border px-4 py-2">{p.product_code}</td>

                <td className="border px-4 py-2">
                  {`${new Date(p.created_at || p.createdAt).toLocaleDateString()} ${new Date(p.created_at || p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </td>

                <td className="border px-4 py-2">
                  {p.top_sellers === 1 ? (
                    <button
                      onClick={() => handleResetTopSeller(p.product_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Reset
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSetTopSeller(p.product_id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Set
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-white"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <CustomAlert {...alertState} onConfirm={closeAlert} onClose={closeAlert} />
    </div>
  );
}