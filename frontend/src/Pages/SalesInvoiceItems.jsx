import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function SalesInvoiceItems() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [invoice, setInvoice] = useState(null);

    // Fetch invoice + items from show() endpoint
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/sales-invoices/${id}`)
            .then((res) => {
                setInvoice(res.data);
                setItems(res.data.items || []);
            })
            .catch((err) => console.log(err));
    }, [id]);

    // ---- TOTAL CALCULATIONS ----

    // Total item cost = Σ (quantity × unit_price)
    const totalItemAmount = items.reduce(
        (sum, item) =>
            sum +
            (parseFloat(item.unit_price || 0) *
                parseFloat(item.quantity || 0)),
        0
    );

    // Total discount = Σ (discount_amount)
    const totalDiscount = items.reduce(
        (sum, item) => sum + parseFloat(item.discount_amount || 0),
        0
    );

    // Total tax = Σ (tax_percent)
    const totalTax = items.reduce(
        (sum, item) => sum + parseFloat(item.tax_percent || 0),
        0
    );

    // Final Total = itemTotal - discount + tax
    const totalGrandTotal = (
        totalItemAmount -
        totalDiscount +
        totalTax
    ).toFixed(2);

    // --------------------------------------

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold flex items-center">
                <span className="mr-3 text-indigo-600">🧾</span>
                Invoice Items (ID: {id})
                {invoice?.customer_name && (
                    <span className="ml-3 text-gray-600 text-lg">
                        — Customer:{" "}
                        <span className="font-semibold">
                            {invoice.customer_name}
                        </span>
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
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
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
                                    Unit Price
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Discount
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Tax %
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Grand Total
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item, index) => (
                                <tr
                                    key={item.sales_invoice_item_id}
                                    className={`transition duration-150 ease-in-out ${index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                        } hover:bg-indigo-50`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.product?.product_name ||
                                            item.product_name ||
                                            "N/A"}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                                        {parseFloat(item.quantity).toFixed(2)}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                                        ₹
                                        {parseFloat(
                                            item.unit_price || 0
                                        ).toFixed(2)}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-500">
                                        -₹
                                        {parseFloat(
                                            item.discount_amount || 0
                                        ).toFixed(2)}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
                                        {parseFloat(
                                            item.tax_percent || 0
                                        ).toFixed(2)}
                                        %
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-right text-green-700">
                                        ₹
                                        {parseFloat(
                                            item.grand_total || 0
                                        ).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot className="bg-indigo-50 border-t-2 border-indigo-200">
                            <tr>
                                <td
                                    colSpan="5"
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

export default SalesInvoiceItems;
