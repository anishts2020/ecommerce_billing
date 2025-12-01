import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PurchaseInvoiceItems() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Fetch purchase invoice + items
        axios
            .get(`http://localhost:8000/api/purchase-invoices/${id}`)
            .then((res) => {
                setInvoice(res.data);
                setItems(res.data.items || []);
            })
            .catch((err) => {
                console.error("Failed to fetch purchase invoice:", err);
                setError(err?.response?.data?.message || err.message || "Failed to load invoice");
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Total calculations with proper tax handling
    const totalItemAmount = items.reduce(
        (sum, item) =>
            sum + parseFloat(item.unit_cost || 0) * parseFloat(item.quantity || 0),
        0
    );

    const totalTax = items.reduce(
        (sum, item) =>
            sum + parseFloat(item.unit_cost || 0) * parseFloat(item.quantity || 0) * (parseFloat(item.tax_percent || 0) / 100),
        0
    );

    const totalGrandTotal = (totalItemAmount + totalTax).toFixed(2);

    if (loading) {
        return <div className="p-6 text-center">Loading invoice items…</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold flex items-center">
                <span className="mr-3 text-indigo-600">🧾</span>
                Purchase Invoice Items (ID: {id})
                {invoice?.vendor_name && (
                    <span className="ml-3 text-gray-600 text-lg">
                        — Vendor: <span className="font-semibold">{invoice.vendor_name}</span>
                    </span>
                )}
            </h2>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-gray-500">
                        No items found for this invoice.
                    </p>
                </div>
            ) : (
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden mt-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Unit Cost
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Tax %
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item, index) => {
                                const itemTotal =
                                    parseFloat(item.unit_cost || 0) *
                                    parseFloat(item.quantity || 0) *
                                    (1 + parseFloat(item.tax_percent || 0) / 100);
                                return (
                                    <tr
                                        key={item.invoice_item_id || index}
                                        className={`transition duration-150 ease-in-out ${
                                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        } hover:bg-indigo-50`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.product?.product_name || item.product_name || "N/A"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                                            {parseFloat(item.quantity || 0).toFixed(2)}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                                            ₹{parseFloat(item.unit_cost || 0).toFixed(2)}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
                                            {parseFloat(item.tax_percent || 0).toFixed(2)}%
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700 text-right">
                                            ₹{itemTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        <tfoot className="bg-indigo-50 border-t-2 border-indigo-200">
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-6 py-4 text-right text-lg font-bold text-gray-800"
                                >
                                    Total Amount:
                                </td>
                                <td className="px-6 py-4 text-right text-xl font-extrabold text-indigo-700">
                                    ₹{totalGrandTotal}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PurchaseInvoiceItems;
