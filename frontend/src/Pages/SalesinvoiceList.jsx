import React, { useEffect, useState } from "react";
import axios from "axios";

function SalesinvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/sales-invoices")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            🧾 Sales Invoice List
          </h1>

          <input
            type="text"
            placeholder="Search by customer name..."
            className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-full shadow-sm 
                       focus:ring-2 focus:ring-indigo-300 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ===== TABLE ===== */}
        <div className="overflow-x-auto rounded-xl shadow-2xl mt-8">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm font-bold uppercase tracking-wider">
                <th className="py-4 px-6 text-left rounded-tl-xl">Invoice No</th>
                <th className="py-4 px-6 text-left">Customer ID</th>
                <th className="py-4 px-6 text-left">Customer Name</th>
                
                <th className="py-4 px-6 text-left">Grand Total</th>
                <th className="py-4 px-6 text-left">Net Total</th>
                <th className="py-4 px-6 text-left">Payment Mode</th>
                <th className="py-4 px-6 text-left rounded-tr-xl">Invoice Date</th>
                <th className="py-4 px-6 text-left">Items</th>
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
                    className="hover:bg-indigo-50 transition duration-150"
                  >
                    <td className="py-3 px-6 font-semibold text-gray-800">
                      {inv.invoice_no}
                    </td>

                    <td className="py-3 px-6">{inv.customer_id}</td>

                    <td className="py-3 px-6 font-medium text-gray-800">
                      {inv.customer?.customer_name}
                    </td>

                    {/* ITEMS */}
                   

                    <td className="py-3 px-6 font-bold text-gray-800">
                      ₹{inv.grand_total}
                    </td>

                    <td className="py-3 px-6 font-bold text-green-600">
                      ₹{inv.net_total}
                    </td>
                   

                    {/* PAYMENT MODE */}
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
                      <td className="py-3 px-6 font-bold text-gray-800">
  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow 
                     hover:bg-green-600 transition duration-200">
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
