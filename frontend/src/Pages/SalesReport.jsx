import React, { useEffect, useState } from "react";
import api from "../Api";

function SalesReport() {
  const [reports, setReports] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // adjust as needed

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await api.get("/salesreport", { params });
      setReports(res.data);
      setCurrentPage(1); // reset to first page after filtering
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

  // Pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentReports = reports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">📊 Sales Report</h1>

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
                <th className="py-3 px-6">Invoice No</th>
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Products</th>
                <th className="py-3 px-6">Grand Total</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200">
              {currentReports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-6 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                currentReports.map((r) => (
                  <tr key={r.sales_invoice_id} className="hover:bg-indigo-50 transition">
                    <td className="py-3 px-6 font-semibold text-gray-800">{r.invoice_no}</td>
                    <td className="py-3 px-6">{r.customer_name}</td>
                    <td className="py-3 px-6">{r.product_names}</td>
                    <td className="py-3 px-6 font-bold text-green-600">₹{r.total_grand}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {reports.length > itemsPerPage && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1 ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesReport;
