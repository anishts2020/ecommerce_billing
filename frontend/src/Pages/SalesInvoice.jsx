import React, { useState } from "react";
import axios from "axios";

function SalesInvoice() {
    const [barcode, setBarcode] = useState("");
    const [items, setItems] = useState([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);

    // Customer Modal States
    const [formData, setFormData] = useState({
        customer_name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gst_number: "",
    });

    const [existingId, setExistingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // ====================== PRODUCT SCANNING ======================
    const handleScan = async (e) => {
        if (e.key === "Enter") {
            try {
                const res = await axios.get(
                    `http://127.0.0.1:8000/api/products/barcode/${barcode}`
                );
                const product = res.data;

                setItems((prev) => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        product_id: product.product_id,   // 🔥 VERY IMPORTANT
                        name: product.product_name,
                        price: product.selling_price,
                        quantity: 1,
                        total: product.selling_price,
                    },
                ]);

                setBarcode("");
            } catch {
                alert("Product not found!");
            }
        }
    };

    const updateQuantity = (index, qty) => {
        const updated = [...items];
        updated[index].quantity = qty;
        updated[index].total = qty * updated[index].price;
        setItems(updated);
    };

    const grandTotal = items.reduce((sum, item) => sum + item.total, 0);
    const netTotal = grandTotal - Number(discount) + Number(tax);

    // ====================== CUSTOMER MODAL LOGIC ======================
    const handleCustomerChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneCheck = (phone) => {
        if (phone.length < 10) return;

        setLoading(true);

        axios
            .get(`http://127.0.0.1:8000/api/customer/check-phone/${phone}`)
            .then((res) => {
                if (res.data.exists) {
                    const c = res.data.data;

                    setFormData({
                        customer_name: c.customer_name,
                        phone: c.phone,
                        email: c.email,
                        address: c.address,
                        city: c.city,
                        state: c.state,
                        pincode: c.pincode,
                        gst_number: c.gst_number || "",
                    });

                    setExistingId(c.id);
                } else {
                    setExistingId(null);
                }
            })
            .finally(() => setLoading(false));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, phone: value });

        if (value.length >= 10) handlePhoneCheck(value);
    };

    // ====================== SAVE INVOICE + ITEMS ======================
    const saveInvoice = async (customerId) => {
        const invoice_no = "INV-" + Date.now();
        const invoice_date = new Date().toISOString().slice(0, 10);

        const payload = {
            invoice_no,
            invoice_date,
            customer_id: customerId,
            grand_total: grandTotal,
            discount: discount,
            tax: tax,
            net_total: netTotal,
            payment_mode: 1,
            remarks: "",
            items: items.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.price,
                discount_amount: 0,
                tax_percent: 0,
                grand_total: item.total,
            })),
        };

        try {
            await axios.post("http://127.0.0.1:8000/api/sales-invoices", payload);
            alert("Invoice saved successfully!");
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("Failed to save invoice!");
        }
    };

    // ====================== SAVE CUSTOMER + THEN SAVE INVOICE ======================
    const handleCustomerSave = () => {
        const request = existingId
            ? axios.put(`http://127.0.0.1:8000/api/customer/${existingId}`, formData)
            : axios.post(`http://127.0.0.1:8000/api/customer`, formData);

        request
            .then((res) => {
                const customerId = existingId ? existingId : res.data.id;

                alert(existingId ? "Customer updated successfully!" : "Customer added successfully!");

                // 🔥 AFTER SAVING CUSTOMER -> SAVE INVOICE
                saveInvoice(customerId);

                setShowCustomerModal(false);
            })
            .catch(() => {
                alert("Operation failed!");
            });
    };

    // ====================== UI ======================
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg mb-8">
                    <h1 className="text-3xl font-extrabold text-indigo-700">🧾 Sales Invoice</h1>

                    <input
                        type="text"
                        value={barcode}
                        placeholder="Scan Barcode Here..."
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={handleScan}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-300"
                    />
                </div>

                {/* PRODUCT TABLE */}
                <div className="overflow-x-auto rounded-xl shadow-2xl">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-indigo-600 text-white text-sm font-bold uppercase tracking-wider">
                                <th className="py-3 px-6 text-left rounded-tl-xl">SI No</th>
                                <th className="py-3 px-6 text-left">Product Name</th>
                                <th className="py-3 px-6 text-left">Price</th>
                                <th className="py-3 px-6 text-left">Quantity</th>
                                <th className="py-3 px-6 text-left rounded-tr-xl">Total</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm divide-y divide-gray-200">
                            {items.length > 0 ? (
                                items.map((item, index) => (
                                    <tr key={index} className="hover:bg-indigo-50">
                                        <td className="py-3 px-6">{item.id}</td>
                                        <td className="py-3 px-6 font-semibold text-gray-800">{item.name}</td>
                                        <td className="py-3 px-6">₹{item.price}</td>
                                        <td className="py-3 px-6">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(index, Number(e.target.value))}
                                                className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
                                            />
                                        </td>
                                        <td className="py-3 px-6 font-bold">₹{item.total}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-gray-500 text-lg">
                                        Scan a product to start billing...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* TOTAL SECTION */}
                <div className="mt-8 bg-white p-6 rounded-xl shadow-xl space-y-5">

                    <div className="flex justify-between text-xl font-bold text-indigo-700 border-b pb-3">
                        <span>Grand Total:</span>
                        <span>₹{grandTotal}</span>
                    </div>

                    <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Discount:</span>
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Tax:</span>
                        <input
                            type="number"
                            value={tax}
                            onChange={(e) => setTax(e.target.value)}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div className="flex justify-between text-2xl font-bold text-green-700 border-t pt-3">
                        <span>Net Total:</span>
                        <span>₹{netTotal}</span>
                    </div>

                    <button
                        onClick={() => setShowCustomerModal(true)}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700"
                    >
                        Generate Bill
                    </button>
                </div>
            </div>

            {/* ================= CUSTOMER MODAL ================= */}
            {showCustomerModal && (
                <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl relative border border-gray-100">

                        {/* Close Button */}
                        <button
                            onClick={() => setShowCustomerModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 p-1 rounded-full bg-gray-50 hover:bg-red-50"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
                            Customer Details
                        </h2>

                        <div className="space-y-5">

                            {/* PHONE */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    onBlur={(e) => handlePhoneCheck(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="e.g., 9876543210"
                                />
                                {loading && (
                                    <p className="text-blue-600 text-sm mt-1">Checking...</p>
                                )}
                                {existingId && (
                                    <p className="text-green-600 text-sm font-semibold mt-1">
                                        Existing customer loaded.
                                    </p>
                                )}
                            </div>

                            {/* NAME */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleCustomerChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="Full Name"
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleCustomerChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="email@example.com"
                                />
                            </div>

                            {/* ADDRESS */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleCustomerChange}
                                    rows="2"
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="Street Address"
                                ></textarea>
                            </div>

                            {/* CITY + STATE */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleCustomerChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleCustomerChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* PINCODE + GST */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleCustomerChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                    <input
                                        type="text"
                                        name="gst_number"
                                        value={formData.gst_number}
                                        onChange={handleCustomerChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SAVE BUTTON */}
                        <button
                            onClick={handleCustomerSave}
                            className="w-full mt-8 text-white p-3 rounded-xl font-semibold text-lg bg-indigo-600 hover:bg-indigo-700"
                        >
                            {existingId ? "Update Customer" : "Save Customer"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalesInvoice;
