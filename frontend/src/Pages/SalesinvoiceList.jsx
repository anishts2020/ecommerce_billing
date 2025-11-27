import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SalesinvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/sales-invoices")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            🧾 Sales Invoice List
          </h1>

          <input
            type="text"
            placeholder="Search by customer name..."
            className="w-72 px-4 py-2 border border-gray-300 rounded-full shadow-sm 
                       focus:ring-2 focus:ring-indigo-300 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-xl bg-white">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm uppercase tracking-wider">
                <th className="py-3 px-6 text-left">Invoice No</th>
                <th className="py-3 px-6 text-left">Customer Name</th>
                <th className="py-3 px-6 text-left">Grand Total</th>
                <th className="py-3 px-6 text-left">Net Total</th>
                <th className="py-3 px-6 text-left">Payment Mode</th>
                <th className="py-3 px-6 text-left">Invoice Date</th>
                <th className="py-3 px-6 text-left">Items</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-200">
              {invoices
                .filter((inv) =>
                  inv.customer?.customer_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((inv) => (
                  <tr
                    key={inv.sales_invoice_id}
                    className="hover:bg-indigo-50 transition"
                  >
                    <td className="py-3 px-6 font-semibold text-gray-800">
                      {inv.invoice_no}
                    </td>

                    <td className="py-3 px-6">
                      {inv.customer?.customer_name || "N/A"}
                    </td>

                    <td className="py-3 px-6 font-bold text-gray-800">
                      ₹{inv.grand_total}
                    </td>

                    <td className="py-3 px-6 font-bold text-green-600">
                      ₹{inv.net_total}
                    </td>

                    <td className="py-3 px-6">
                      {inv.payment_mode === 0 && (
                        <span className="text-gray-700 font-medium">Cash</span>
                      )}
                      {inv.payment_mode === 1 && (
                        <span className="text-blue-600 font-medium">UPI</span>
                      )}
                      {inv.payment_mode === 2 && (
                        <span className="text-purple-600 font-medium">Card</span>
                      )}
                    </td>

                    <td className="py-3 px-6">{inv.invoice_date}</td>

                    {/* Items Button */}
                    <td className="py-3 px-6 font-bold text-gray-800">
                      <button
                        onClick={() =>
                          navigate(`/sales-invoice-items/${inv.sales_invoice_id}`)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow 
                                   hover:bg-green-700 transition duration-200"
                      >
                        <span>📦</span> Items
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesinvoiceList;
