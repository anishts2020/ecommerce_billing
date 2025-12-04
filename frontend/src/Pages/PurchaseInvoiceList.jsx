import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PurchaseInvoiceList() {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);

        axios
            .get("http://localhost:8000/api/purchase-invoices")
            .then((res) => {
                // Helpful debug log — check shape in console
                console.log("API invoices payload:", res.data);

                // Many APIs wrap payload in {data: [...]}, others return [...] directly.
                // Use whichever applies:
                const payload = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : []; // fallback safe empty array

                setInvoices(payload);
            })
            .catch((err) => {
                console.error("Failed to fetch invoices:", err);
                setError(err?.response?.data?.message || err.message || "Failed to load invoices");
            })
            .finally(() => setLoading(false));
    }, []);

    const fmtDate = (d) => {
        if (!d) return "N/A";
        try {
            const dt = new Date(d);
            // You can change locale or use Intl.DateTimeFormat for specific format
            return dt.toLocaleDateString();
        } catch {
            return d;
        }
    };

    const normalizedPayment = (p) => {
        // Accept numbers or numeric strings
        const n = Number(p);
        if (Number.isNaN(n)) return null;
        return n;
    };

    const filtered = invoices.filter((inv) => {
        if (!searchTerm) return true;

        const vendorName =
            (inv.vendor?.vendor_name) ??
            (inv.vendor?.name) ??
            (inv.vendor_name) ??
            ""; // multiple fallbacks

        const invoiceNo = (inv.purchase_no || inv.invoice_no || "").toString();
        return (
            vendorName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
                    <h1 className="text-3xl font-extrabold text-indigo-700">🧾 Purchase Invoice List</h1>

                    <input
                        type="text"
                        placeholder="Search by vendor name or invoice no"
                        className="w-72 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto rounded-xl shadow-xl bg-white">
                    {loading ? (
                        <div className="p-6 text-center">Loading invoices…</div>
                    ) : error ? (
                        <div className="p-6 text-center text-red-600">Error: {error}</div>
                    ) : (
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="bg-indigo-600 text-white text-sm uppercase tracking-wider">
                                    <th className="py-3 px-6 text-left">Purchase No</th>
                                    <th className="py-3 px-6 text-left">Vendor Name</th>
                                    <th className="py-3 px-6 text-left">Grand Total</th>
                                    <th className="py-3 px-6 text-left">Net Total</th>
                                    <th className="py-3 px-6 text-left">Payment Mode</th>
                                    <th className="py-3 px-6 text-left">Purchase Date</th>
                                    <th className="py-3 px-6 text-left">Items</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm divide-y divide-gray-200">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-6 px-6 text-center text-gray-500">
                                            No invoices found.
                                        </td>
                                    </tr>
                                )}

                                {filtered.map((inv) => {
                                    // Map backend fields to front-end variables (safe fallbacks)
                                    const id = inv.purchase_id ?? inv.id ?? inv.purchaseId ?? JSON.stringify(inv).slice(0, 8);
                                    const invoiceNo = inv.purchase_no || inv.invoice_no || "N/A";
                                    const vendorName = inv.vendor?.vendor_name ?? inv.vendor?.name ?? inv.vendor_name ?? "N/A";
                                    const grandTotal = inv.total_amount ?? inv.grand_total ?? inv.total ?? 0;
                                    const netTotal = inv.net_amount ?? inv.net_total ?? 0;
                                    const paymentMode = normalizedPayment(inv.payment_status ?? inv.payment_mode);
                                    const invoiceDate = inv.purchase_date || inv.invoice_date || inv.created_at || "";

                                    return (
                                        <tr key={id} className="hover:bg-indigo-50 transition">
                                            <td className="py-3 px-6 font-semibold text-gray-800">{invoiceNo}</td>
                                            <td className="py-3 px-6">{vendorName}</td>
                                            <td className="py-3 px-6 font-bold text-gray-800">₹{grandTotal}</td>
                                            <td className="py-3 px-6 font-bold text-green-600">₹{netTotal}</td>
                                            <td className="py-3 px-6">
                                                {paymentMode === 1 && <span className="text-gray-700 font-medium">Paid</span>}
                                                {paymentMode === 2&& <span className="text-blue-600 font-medium">Partial</span>}
                                                {paymentMode === 3 && <span className="text-purple-600 font-medium">Unpaid</span>}
                                                {paymentMode !== 1 && paymentMode !== 2 && paymentMode !== 3 && (
                                                    <span className="text-gray-500">—</span>
                                                )}
                                            </td>

                                            <td className="py-3 px-6">{fmtDate(invoiceDate)}</td>

                                            <td className="py-3 px-6 font-bold text-gray-800">
                                                <button
                                                    onClick={() => navigate(`/purchase-invoice-items/${id}`)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200"
                                                >
                                                    <span>📦</span> Items
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PurchaseInvoiceList;
