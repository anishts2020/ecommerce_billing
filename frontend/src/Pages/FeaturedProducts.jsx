import { useEffect, useState } from "react";
import api from "../api";

/* =============== ALERT COMPONENT =============== */
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white p-6 rounded-xl w-96 border-t-8 shadow-xl ${
          type === "success"
            ? "border-green-500"
            : type === "error"
            ? "border-red-500"
            : "border-gray-500"
        }`}
      >
        <h1 className="text-xl font-bold text-center mb-2">{title}</h1>
        <p className="text-gray-700 text-center">{message}</p>
        <div className="flex justify-center mt-4">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded ${
              type === "success"
                ? "bg-green-600 hover:bg-green-700"
                : type === "error"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

/* =============== FEATURED PRODUCTS PAGE =============== */
export default function FeaturedProductsForm() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const closeAlert = () =>
    setAlert({ isOpen: false, title: "", message: "", type: "success" });

  /* =============== FETCH PRODUCTS =============== */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      const list = Array.isArray(res.data) ? res.data : res.data.data || [];
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setProducts(list);
    } catch {
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Failed to load products",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =============== TOGGLE FEATURED =============== */
  const handleToggleFeatured = async (product) => {
    const action =
      product.featured_products === 1
        ? "reset-featured"
        : "set-featured";

    try {
      const res = await api.post(`/products/${action}`, {
        product_id: product.product_id,
      });

      setAlert({
        isOpen: true,
        title: "Success",
        message: res.data.message,
        type: "success",
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === product.product_id
            ? {
                ...p,
                featured_products: p.featured_products === 1 ? 0 : 1,
              }
            : p
        )
      );
    } catch (err) {
      setAlert({
        isOpen: true,
        title: "Error",
        message: err.response?.data?.message || "Action failed",
        type: "error",
      });
    }
  };

  /* =============== FILTER + SEARCH =============== */
  const filteredProducts = products
    .filter((p) => {
      if (showFeaturedOnly) {
        return p.featured_products === 1;
      }
      return true;
    })
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.product_name.toLowerCase().includes(q) ||
        p.product_code.toLowerCase().includes(q)
      );
    });

  /* =============== PAGINATION =============== */
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePrevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-4xl font-extrabold text-indigo-700">
          ⭐ Featured Products
        </h1>
      </div>

     {/* FILTER BAR */}
<div className="max-w-5xl mx-auto flex items-center justify-between gap-4 mb-4">
  {/* SEARCH */}
  <input
    type="text"
    placeholder="Search by name or code..."
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full md:w-2/3 border p-3 rounded-xl focus:outline-indigo-500"
  />

  {/* CHECKBOX */}
  <label className="flex items-center whitespace-nowrap space-x-2 font-medium text-gray-700">
    <input
      type="checkbox"
      checked={showFeaturedOnly}
      onChange={(e) => {
        setShowFeaturedOnly(e.target.checked);
        setCurrentPage(1);
      }}
      className="w-5 h-5 text-indigo-600"
    />
    <span>Show only Featured</span>
  </label>
</div>


      {/* TABLE */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 w-1/12">SL NO</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Product Code</th>
                <th className="p-3 text-left">Created Date</th>
                <th className="p-3 w-1/5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p, index) => (
                <tr key={p.product_id} className="border-b hover:bg-blue-50">
                  <td className="p-3 text-center">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="p-3">{p.product_name}</td>
                  <td className="p-3">{p.product_code}</td>
                  <td className="p-3">
                    {new Date(p.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`text-sm px-3 py-1 font-medium text-white rounded-lg shadow-md transition ${
                        p.featured_products === 1
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {p.featured_products === 1
                        ? "Remove from Featured"
                        : "Add to Featured"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && currentProducts.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No products found.
          </p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === 1
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
          >
            Prev
          </button>

          <span className="px-4 py-2 border bg-blue-600 text-white rounded-lg">
            {currentPage}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === totalPages
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* ALERT */}
      <CustomAlert
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={closeAlert}
        onClose={closeAlert}
      />
    </div>
  );
}
