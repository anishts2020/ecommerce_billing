import React, { useEffect, useState } from "react";
import axios from "axios";

function PurchaseReport() {
  const [reports, setReports] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // items per page

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await axios.get("http://localhost:8000/api/purchase-report", { params });
      setReports(res.data);
      setCurrentPage(1); // reset when filtering
    } catch (err) {
      console.error(err);
      setError("Failed to fetch report. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // Pagination Logic
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = reports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reports.length / perPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700"> 📊 Purchase Report</h1>

          <div className="flex gap-2 items-center">
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span>to</span>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button
              onClick={fetchReport}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Filter
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto rounded-xl shadow-xl bg-white">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm uppercase tracking-wider">
                <th className="py-3 px-6">Purchase No</th>
                <th className="py-3 px-6">Vendor Name</th>
                <th className="py-3 px-6">Products</th>
                <th className="py-3 px-6">Net Amount</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-6 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                currentData.map((r) => (
                  <tr key={r.purchase_id} className="hover:bg-indigo-50 transition">
                    <td className="py-3 px-6 font-semibold text-gray-800">{r.purchase_no}</td>
                    <td className="py-3 px-6">{r.vendor_name}</td>
                    <td className="py-3 px-6">{r.product_names}</td>
                    <td className="py-3 px-6 font-bold text-green-600">₹{r.net_amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            ◀ Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-2 rounded-lg ${
                currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseReport;
