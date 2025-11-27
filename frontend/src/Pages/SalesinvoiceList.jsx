import React, { useEffect, useState } from "react";
import axios from "axios";

function SalesinvoiceList() {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/sales-invoices")
            .then((res) => setInvoices(res.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">
                📄 Sales Invoice List
            </h2>

            <div className="overflow-x-auto rounded-xl shadow-xl bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-indigo-600 text-white text-sm uppercase tracking-wider">
                            <th className="p-3 border">Invoice No</th>
                            <th className="p-3 border">Customer ID</th>
                            <th className="p-3 border">Customer Name</th>
                            <th className="p-3 border">Items</th>
                            <th className="p-3 border">Grand Total</th>
                            <th className="p-3 border">Net Total</th>
                            <th className="p-3 border">Payment Mode</th>
                            <th className="p-3 border">Invoice Date</th>
                            <th className="p-3 border">Action</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm">
                        {invoices.map((inv) => (
                            <tr
                                key={inv.sales_invoice_id}
                                className="hover:bg-indigo-50 transition"
                            >
                                <td className="p-3 border">{inv.invoice_no}</td>
                                <td className="p-3 border">{inv.customer_id}</td>

                                <td className="p-3 border font-medium">
                                    {inv.customer?.customer_name}
                                </td>

                                <td className="p-3 border">
                                    {inv.items.map((item) => (
                                        <div
                                            key={item.sales_invoice_item_id}
                                            className="text-gray-700"
                                        >
                                            {item.product?.product_name} —
                                            Qty: {item.quantity} —
                                            ₹{item.grand_total}
                                        </div>
                                    ))}
                                </td>

                                <td className="p-3 border font-semibold text-blue-700">
                                    ₹{inv.grand_total}
                                </td>

                                <td className="p-3 border font-semibold text-green-700">
                                    ₹{inv.net_total}
                                </td>

                                <td className="p-3 border">{inv.payment_mode}</td>

                                <td className="p-3 border">{inv.invoice_date}</td>

                                <td className="p-3 border text-center">
                                    <button
                                        onClick={() => window.location.href = `/sales-invoice-items/${inv.sales_invoice_id}`}
                                        className="px-5 py-2.5 bg-green-500 text-white font-medium rounded-xl shadow-md 
    hover:bg-green-600 hover:shadow-lg transition-all"
                                    >
                                        View Items
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SalesinvoiceList;
