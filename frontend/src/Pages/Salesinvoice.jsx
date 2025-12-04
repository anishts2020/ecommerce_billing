// src/pages/SalesInvoice.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

/* -------------------------
   SVG ICONS (for alerts)
   ------------------------- */
const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

/* -------------------------
   CustomAlert component (styled like your preferred modal)
   ------------------------- */
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, borderClass, buttonClass, confirmText, showCancel = false, confirmHandler = onConfirm;

  switch (type) {
    case "confirm":
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      borderClass = "border-yellow-400";
      buttonClass = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes, Continue !";
      showCancel = true;
      break;
    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      borderClass = "border-green-400";
      buttonClass = "bg-green-600 hover:bg-green-700";
      confirmText = "Close";
      confirmHandler = onClose;
      break;
    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      borderClass = "border-red-400";
      buttonClass = "bg-red-600 hover:bg-red-700";
      confirmText = "Close";
      confirmHandler = onClose;
      break;
    default:
      icon = <AlertTriangleIcon className="w-10 h-10 text-gray-500" />;
      borderClass = "border-gray-300";
      buttonClass = "bg-blue-600 hover:bg-blue-700";
      confirmText = "OK";
      confirmHandler = onClose;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">
      <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl transform scale-100 transition-all border-4 ${borderClass} bg-white`}>
        <div className="flex items-center space-x-4">
          <div>{icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 mt-2">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
            >
              Cancel
            </button>
          )}
          <button
            onClick={confirmHandler}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition duration-150 ${buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   Main SalesInvoice component
   ------------------------- */
function SalesInvoice() {
  const API_BASE = "http://127.0.0.1:8000/api";

  // products scanned
  const [barcode, setBarcode] = useState("");
  const [items, setItems] = useState([]); // {id, product_id, name, price, quantity, total, stitchings: []}

  // customer modal & info
  const [showCustomerModal, setShowCustomerModal] = useState(false);
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

  // invoice extras
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  // stitching types
  const [stichingTypes, setStichingTypes] = useState([]);

  // stitching modal (per product)
  const [showStitchModal, setShowStitchModal] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [selectedStichingTypeId, setSelectedStichingTypeId] = useState("");
   const navigate =useNavigate();
  // custom alert state
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    onConfirm: () => {},
    onClose: () => setAlert((a) => ({ ...a, isOpen: false })),
  });

  // helpers
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  };
  const fmt = (v) => "₹" + toNumber(v).toFixed(2);

  // fetch stitching types
  useEffect(() => {
    axios
      .get(`${API_BASE}/stiching-types`)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data.map((r) => ({ ...r, rate: toNumber(r.rate) }))
          : [];
        setStichingTypes(data);
      })
      .catch((err) => {
        console.error("Failed to load stitching types:", err);
        setAlert({
          isOpen: true,
          title: "Load Error",
          message: "Failed to load stitching types.",
          type: "error",
          onClose: () => setAlert((a) => ({ ...a, isOpen: false })),
        });
      });
  }, []);

  // ===== product scan =====
  const handleScan = async (e) => {
    if (e.key === "Enter") {
      try {
        const res = await axios.get(`${API_BASE}/products/barcode/${barcode}`);
        const product = res.data;

        setItems((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            product_id: product.product_id ?? null,
            name: product.product_name ?? "Unknown",
            price: toNumber(product.selling_price),
            quantity: 1,
            total: toNumber(product.selling_price),
            stitchings: [],
          },
        ]);
        setBarcode("");
      } catch (err) {
        console.error(err);
        setAlert({
          isOpen: true,
          title: "Not Found",
          message: "Product not found.",
          type: "error",
          onClose: () => setAlert((a) => ({ ...a, isOpen: false })),
        });
      }
    }
  };

  // ===== quantity updates =====
  const updateQuantity = (index, qty) => {
    const q = Math.max(0, toNumber(qty));
    const updated = [...items];
    updated[index].quantity = q;
    updated[index].total = Number((q * toNumber(updated[index].price)).toFixed(2));
    setItems(updated);
  };

  // ===== stitching modal per product =====
  const openStitchModalForProduct = (index) => {
    setActiveProductIndex(index);
    setSelectedStichingTypeId("");
    setShowStitchModal(true);
  };

  const addStitchingToActiveProduct = () => {
    if (activeProductIndex === null) return;
    if (!selectedStichingTypeId) {
      setAlert({
        isOpen: true,
        title: "Select Stitching",
        message: "Please select a stitching type before adding.",
        type: "error",
        onClose: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
      return;
    }

    const selected = stichingTypes.find(
      (t) => String(t.stiching_type_id) === String(selectedStichingTypeId)
    );
    if (!selected) {
      setAlert({
        isOpen: true,
        title: "Invalid",
        message: "Invalid stitching type selected.",
        type: "error",
        onClose: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
      return;
    }

    const updated = [...items];
    const product = updated[activeProductIndex];
    if (!product) return;

    const exists = product.stitchings.find(
      (s) => Number(s.stiching_type_id) === Number(selected.stiching_type_id)
    );
    if (exists) {
      setAlert({
        isOpen: true,
        title: "Duplicate",
        message: "This stitching type is already added for this product.",
        type: "error",
        onClose: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
      return;
    }

    product.stitchings.push({
      stiching_type_id: Number(selected.stiching_type_id),
      stiching_type_name: selected.name,
      rate: toNumber(selected.rate),
    });

    setItems(updated);
    setShowStitchModal(false);
    setActiveProductIndex(null);
    setSelectedStichingTypeId("");
  };

  const removeStitchingFromProduct = (productIndex, stitchIndex) => {
    const updated = [...items];
    if (!updated[productIndex]) return;
    updated[productIndex].stitchings.splice(stitchIndex, 1);
    setItems(updated);
  };

  // totals
  const stichingTotal = items.reduce(
    (sum, it) => sum + it.stitchings.reduce((s, st) => s + toNumber(st.rate), 0),
    0
  );

  const grandTotal = items.reduce((sum, it) => sum + toNumber(it.total), 0);
  const taxAmount = Number(((grandTotal * toNumber(tax)) / 100).toFixed(2));

const netTotal = Number(
  (grandTotal + stichingTotal - toNumber(discount) + taxAmount).toFixed(2)
);


  // ===== customer phone check =====
  const handlePhoneCheck = (phone) => {
    if (!phone || phone.length < 10) return;
    setLoading(true);
    axios
      .get(`${API_BASE}/customer/check-phone/${phone}`)
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
      .catch(() => setExistingId(null))
      .finally(() => setLoading(false));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setFormData((f) => ({ ...f, phone: value }));
    if (value.length >= 10) handlePhoneCheck(value);
  };

  const handleCustomerChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // build stitching payload
  const buildStitchingPayload = (customerId, customerName) => {
    const payload = [];
    items.forEach((it) => {
      const productId = it.product_id ?? null;
      const productName = it.name ?? "";
      it.stitchings.forEach((s) => {
        payload.push({
          product_id: productId,
          product_name: productName,
          customer_id: customerId ?? existingId ?? null,
          customer_name: customerName ?? formData.customer_name ?? "",
          stiching_type_id: s.stiching_type_id,
          stiching_type_name: s.stiching_type_name,
          rate: Number(s.rate),
        });
      });
    });
    return payload;
  };

  // ===== save invoice =====
  const saveInvoice = async (customerIdFromServer) => {
    const invoice_no = "INV-" + Date.now();
    const invoice_date = new Date().toISOString().slice(0, 10);

    const payloadItems = items.map((item) => ({
      product_id: item.product_id,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      discount_amount: 0,
      tax_percent: 0,
      grand_total: Number(item.total),
    }));

    const stitchingPayload = buildStitchingPayload(customerIdFromServer, formData.customer_name);

    const payload = {
      invoice_no,
      invoice_date,
      customer_id: customerIdFromServer ?? existingId ?? null,
      grand_total: Number(grandTotal.toFixed(2)),
      stitching_total: Number(stichingTotal.toFixed(2)),
      discount: Number(toNumber(discount).toFixed(2)),
      tax: Number(toNumber(tax).toFixed(2)),
      net_total: Number(netTotal.toFixed(2)),
      payment_mode: 1,
      remarks: "",
      items: payloadItems,
      stiching_items: stitchingPayload,
    };
console.log("ITEMS:", payloadItems);
console.log("STITCHING:", stitchingPayload);
console.log("FINAL PAYLOAD:", payload);

    try {
      await axios.post(`${API_BASE}/sales-invoices`, payload);

      setAlert({
        isOpen: true,
        title: "Saved",
        message: "Invoice and stitching saved successfully!",
        type: "success",
        onClose: () => {
          setAlert((a) => ({ ...a, isOpen: false }));
         navigate("/salesinvoice_list");
        },
        onConfirm: () => {
          setAlert((a) => ({ ...a, isOpen: false }));
         navigate("/sales-invoice");
        },
      });
    } catch (err) {
      console.error("Failed to save invoice:", err?.response ?? err);
      setAlert({
        isOpen: true,
        title: "Save Error",
        message: "Failed to save invoice. Check console for details.",
        type: "error",
        onClose: () => setAlert((a) => ({ ...a, isOpen: false })),
      });
    }
  };

  // ===== handle customer save then save invoice =====
 const handleCustomerSave = () => {
  const request = existingId
    ? axios.put(`${API_BASE}/customers/${existingId}`, formData)
    : axios.post(`${API_BASE}/customers`, formData);

  request
    .then((res) => {
      const customerId =
        existingId ? existingId : res.data.id ?? res.data.data?.id ?? null;

      // CLOSE MODAL FIRST
      setShowCustomerModal(false);

      // NOW SAVE INVOICE
      saveInvoice(customerId);
    })
    .catch((err) => {
      console.error(err);
      setAlert({
        isOpen: true,
        title: "Customer Error",
        message: "Failed to save customer.",
        type: "error",
        onClose: () =>
          setAlert((a) => ({
            ...a,
            isOpen: false,
          })),
      });
    });
};


  // confirm before opening customer modal
  const onGenerateBillClick = () => {
    setAlert({
      isOpen: true,
      title: "Generate Invoice?",
      message: "Do you want to continue and enter customer details?",
      type: "confirm",
      onConfirm: () => {
        setAlert((a) => ({ ...a, isOpen: false }));
        setShowCustomerModal(true);
      },
      onClose: () => setAlert((a) => ({ ...a, isOpen: false })),
    });
  };

  // remove item
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // close customer modal & reset
  const closeCustomerModal = () => {
    setShowCustomerModal(false);
    setExistingId(null);
    setFormData({
      customer_name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      gst_number: "",
    });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Custom Alert */}
        <CustomAlert
          isOpen={alert.isOpen}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onConfirm={alert.onConfirm}
          onClose={alert.onClose}
        />

        {/* Header */}
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

        {/* Products table */}
        <div className="overflow-x-auto rounded-xl shadow-2xl mb-6">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm font-bold uppercase tracking-wider">
                <th className="py-3 px-6 text-left">SI No</th>
                <th className="py-3 px-6 text-left">Product Name</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Quantity</th>
                <th className="py-3 px-6 text-left">Total</th>
                <th className="py-3 px-6 text-center">Stitching</th>
                <th className="py-3 px-6 text-center">Remove</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-200">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-indigo-50">
                      <td className="py-3 px-6">{item.id}</td>
                      <td className="py-3 px-6 font-semibold text-gray-800">{item.name}</td>
                      <td className="py-3 px-6">{fmt(item.price)}</td>
                      <td className="py-3 px-6">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(index, e.target.value)}
                          className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
                          min="0"
                        />
                      </td>
                      <td className="py-3 px-6 font-bold">{fmt(item.total)}</td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => openStitchModalForProduct(index)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Add Stitching
                        </button>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button onClick={() => removeItem(index)} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded">✖</button>
                      </td>
                    </tr>

                    {item.stitchings && item.stitchings.length > 0 && (
                      <tr className="bg-indigo-50">
                        <td colSpan="7" className="p-4">
                          <div className="font-semibold text-indigo-700 mb-2">Stitching for {item.name}:</div>
                          <div className="space-y-2">
                            {item.stitchings.map((s, si) => (
                              <div key={si} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                                <div>
                                  <div className="font-medium">{s.stiching_type_name}</div>
                                  <div className="text-sm text-gray-500">{fmt(s.rate)}</div>
                                </div>
                                <div>
                                  <button
                                    onClick={() => removeStitchingFromProduct(index, si)}
                                    className="text-red-600 px-3 py-1 rounded-full hover:bg-red-50"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500 text-lg">
                    Scan a product to start billing...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Stitching totals */}
        <div className="bg-white p-6 rounded-xl shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">🧵 Stitching Summary</h2>
          <div className="flex justify-between items-center">
            <div className="text-lg">Total Stitching Charges</div>
            <div className="text-xl font-semibold text-indigo-700">{fmt(stichingTotal)}</div>
          </div>
        </div>

        {/* totals */}
        <div className="mt-2 bg-white p-6 rounded-xl shadow-xl space-y-5">
          <div className="flex justify-between text-xl font-bold text-indigo-700 border-b pb-3">
            <span>Grand Total:</span>
            <span>{fmt(grandTotal)}</span>
          </div>

          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Discount:</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value === "" ? 0 : toNumber(e.target.value))}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-between items-center text-lg font-semibold">
  <span>Tax (%):</span>
  <div className="flex items-center gap-3">
    <input
      type="number"
      value={tax}
      onChange={(e) => setTax(e.target.value === "" ? 0 : toNumber(e.target.value))}
      className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
    />
    <span className="text-gray-600 text-sm">= ₹{taxAmount.toFixed(2)}</span>
  </div>
</div>


          <div className="flex justify-between text-2xl font-bold text-green-700 border-t pt-3">
            <span>Net Total:</span>
            <span>{fmt(netTotal)}</span>
          </div>

          <button onClick={onGenerateBillClick} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700">
            Generate Bill
          </button>
        </div>
      </div>

      {/* STITCHING MODAL (styled like you sent) */}
      {showStitchModal && activeProductIndex !== null && (
        <div className="fixed inset-0 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => { setShowStitchModal(false); setActiveProductIndex(null); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
            >
              ✖
            </button>

            <h3 className="text-2xl font-bold mb-4">Add Stitching for {items[activeProductIndex]?.name}</h3>

            <div className="mb-4">
              <label className="block text-sm mb-1">Stitching Type</label>
              <select
                value={selectedStichingTypeId}
                onChange={(e) => setSelectedStichingTypeId(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select stitching type...</option>
                {stichingTypes.map((t) => (
                  <option key={t.stiching_type_id} value={t.stiching_type_id}>
                    {t.name} — {fmt(t.rate)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowStitchModal(false); setActiveProductIndex(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={addStitchingToActiveProduct} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER MODAL (styled like you sent) */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl relative">
            <button onClick={closeCustomerModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">✕</button>

            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-indigo-700">{existingId ? "Edit Customer" : "Add Customer"}</h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCustomerSave(); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input type="text" name="customer_name" value={formData.customer_name} onChange={handleCustomerChange} className="w-full p-3 border rounded-lg shadow-inner" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handlePhoneChange} className="w-full p-3 border rounded-lg shadow-inner" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleCustomerChange} className="w-full p-3 border rounded-lg shadow-inner" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input type="text" name="gst_number" value={formData.gst_number} onChange={handleCustomerChange} className="w-full p-3 border rounded-lg shadow-inner" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleCustomerChange} className="w-full p-3 border rounded-lg shadow-inner" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleCustomerChange} className="w-full p-3 border rounded-lg shadow-inner" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleCustomerChange} className="w-full p-3 border rounded-lg shadow-inner" required />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleCustomerChange} className="w-full p-3 border rounded-lg shadow-inner" required />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t">
                <button type="button" onClick={closeCustomerModal} className="px-6 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  {existingId ? "Update" : "Save and continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesInvoice;

