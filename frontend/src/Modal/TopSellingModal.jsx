import React, { useEffect, useState } from "react";
import api from "../Api";

export default function TopSellingModal({ onClose }) {
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(
          "/top-selling-products"
        );

        if (Array.isArray(res.data)) {
          setTopProducts(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setTopProducts(res.data.data);
        } else {
          setError("Unexpected data format");
        }
      } catch (err) {
        setError("Failed to fetch top selling products");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-2xl shadow-2xl border max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Top Selling Products</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg flex-1 overflow-y-auto">
          {loading && <p className="text-center py-4">Loading...</p>}
          {error && <p className="text-red-600 py-4 text-center">{error}</p>}
          {!loading && !error && topProducts.length === 0 && (
            <p className="text-center py-4">No data available</p>
          )}

          {!loading && !error && topProducts.length > 0 && (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">SL NO</th>
                  <th className="px-4 py-3 text-left">Product Name</th>
                  <th className="px-4 py-3 text-left">Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr
                    key={product.product_id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{product.product_name}</td>
                    <td className="px-4 py-3">{product.total_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Close button */}
        <div className="text-right mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
