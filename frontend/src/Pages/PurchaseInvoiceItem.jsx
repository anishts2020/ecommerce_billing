// src/Pages/PurchaseInvoiceItems.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

/* ---------- Custom Alert Component (from Materials.jsx) ---------- */
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

const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, bgColor, buttonColor, confirmText;
  switch (type) {
    case "confirm":
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      bgColor = "bg-yellow-50 border-yellow-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes, continue";
      break;
    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      bgColor = "bg-green-50 border-green-500";
      buttonColor = "bg-green-600 hover:bg-green-700";
      confirmText = "Close";
      break;
    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      bgColor = "bg-red-50 border-red-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Close";
      break;
    default:
      icon = <AlertTriangleIcon className="w-10 h-10 text-gray-500" />;
      bgColor = "bg-white border-gray-500";
      buttonColor = "bg-blue-600 hover:bg-blue-700";
      confirmText = "OK";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border-t-8 ${bgColor}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center space-y-4">
          {icon}
          <h2 className="text-xl font-bold text-gray-800 text-center">{title}</h2>
          <p className="text-gray-600 text-center">{message}</p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-150"
            >
              Cancel
            </button>
          )}
          <button onClick={onConfirm} className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-150 shadow-md ${buttonColor}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
/* ------------------------------------------------------------------------- */

export default function PurchaseInvoiceItems() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [items, setItems] = useState([]);
  const [tax, setTax] = useState("");

  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [remark, setRemark] = useState("");

  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    actionToRun: null,
  });

  // Load products
  useEffect(() => {
    axios.get("http://localhost:8000/api/products")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setProducts(data);
      })
      .catch((err) => console.error("Products fetch error:", err));
  }, []);

  // Load vendors
  useEffect(() => {
    axios.get("http://localhost:8000/api/vendors")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setVendors(data);
      })
      .catch((err) => console.error("Vendors fetch error:", err));
  }, []);

  const handleVendorChange = (e) => setVendorId(e.target.value);
  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const addProductItem = () => {
    if (!selectedProduct) {
      setAlertState({ isOpen: true, title: "Error", message: "Please select a product.", type: "error" });
      return;
    }
    const product = products.find((p) => String(p.product_id) === String(selectedProduct.value));
    if (!product) {
      setAlertState({ isOpen: true, title: "Error", message: "Product not found.", type: "error" });
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: `${selectedProduct.value}-${Date.now()}`,
        product_id: product.product_id,
        product_name: product.product_name,
        unit_cost: Number(product.cost_price ?? product.cost ?? 0),
        qty: 1,
      },
    ]);
    setSelectedProduct(null);
  };

  const updateQty = (id, qty) => {
    let q = Number(qty);
    if (Number.isNaN(q) || q < 1) q = 1;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: q } : it)));
  };

  const removeItem = (id) => {
    setAlertState({
      isOpen: true,
      title: "Confirm",
      message: "Are you sure you want to remove this product?",
      type: "confirm",
      actionToRun: async () => setItems((prev) => prev.filter((it) => it.id !== id)),
    });
  };

  // Totals
  const grandTotal = items.reduce((sum, it) => sum + it.unit_cost * it.qty, 0);
  const taxAmount = (grandTotal * (Number(tax) || 0)) / 100;
  const netTotal = grandTotal + taxAmount;

  const paymentMethods = [
    { id: 1, label: "Paid" },
    { id: 2, label: "Partial" },
    { id: 3, label: "Unpaid" },
  ];

  const productOptions = products.map((p) => ({
    value: p.product_id,
    label: `${p.product_id} - ${p.product_name}`,
  }));

  const handleSaveInvoice = async () => {
    if (!vendorId || !paymentMethod || !remark.trim() || !items.length) {
      setAlertState({ isOpen: true, title: "Error", message: "Fill all required fields and add products.", type: "error" });
      return;
    }

    const payload = {
      vendor_id: Number(vendorId),
      total_amount: Number(grandTotal.toFixed(2)),
      tax_amount: Number(taxAmount.toFixed(2)),
      net_amount: Number(netTotal.toFixed(2)),
      payment_status: Number(paymentMethod),
      remark: remark.trim(),
      items: items.map((it) => ({
        product_id: it.product_id,
        quantity: it.qty,
        unit_cost: it.unit_cost,
        tax_percent: Number(tax) || 0,
        total: Number((it.unit_cost * it.qty).toFixed(2)),
      })),
    };

    try {
      await axios.post("http://localhost:8000/api/purchase-invoices", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setAlertState({ isOpen: true, title: "Success", message: "Purchase invoice created successfully.", type: "success" });
      setItems([]);
      setVendorId("");
      setPaymentMethod("");
      setTax("");
      setRemark("");
      setSelectedProduct(null);
    } catch (err) {
      const server = err.response?.data;
      const message = server?.message || (server?.errors ? Object.values(server.errors).flat().join(" ") : err.message || "Something went wrong!");
      setAlertState({ isOpen: true, title: "Failed", message, type: "error" });
    }
  };

  const closeAlert = () => setAlertState({ ...alertState, isOpen: false });

  const handleAlertConfirm = async () => {
    if (alertState.type === "confirm" && alertState.actionToRun) {
      await alertState.actionToRun();
    }
    closeAlert();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header & Product Select */}
      <div className="bg-white shadow-lg p-5 rounded-xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-purple-700">📦 Purchase Invoice Items</h1>
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <Select
            options={productOptions}
            value={selectedProduct}
            onChange={setSelectedProduct}
            placeholder="Select Product"
            isClearable
            className="w-full sm:w-80"
          />
          <button onClick={addProductItem} className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700">Add</button>
        </div>
      </div>

      {/* Vendor & Clear */}
      <div className="bg-white shadow-xl p-5 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-semibold mb-1">Vendor</label>
          <select name="vendor_id" value={vendorId} onChange={handleVendorChange} className="border p-2 rounded w-full">
            <option value="">Select Vendor</option>
            {vendors.map((v, idx) => {
              const vid = v.vendor_id ?? v.id ?? "";
              const name = v.vendor_name ?? v.name ?? `Vendor ${idx + 1}`;
              return <option key={vid || `${name}-${idx}`} value={vid}>{name}</option>;
            })}
          </select>
        </div>
        <div className="flex items-end col-span-2 sm:col-span-1 sm:col-start-3">
          <button onClick={() => { setItems([]); setTax(""); setVendorId(""); setPaymentMethod(""); setRemark(""); }} className="ml-auto bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Clear</button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="p-3">SI NO</th>
              <th className="p-3">PRODUCT NAME</th>
              <th className="p-3">UNIT COST</th>
              <th className="p-3">QUANTITY</th>
              <th className="p-3">TOTAL</th>
              <th className="p-3">REMOVE</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">No items added.</td></tr>
            ) : (
              items.map((item, index) => {
                const itemTotal = item.unit_cost * item.qty;
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="text-center p-3">{index + 1}</td>
                    <td className="text-center p-3">{item.product_name}</td>
                    <td className="text-center p-3">₹{item.unit_cost.toFixed(2)}</td>
                    <td className="text-center p-3">
                      <input type="number" min="1" className="border px-3 py-1 rounded-md w-20 text-center" value={item.qty} onChange={(e) => updateQty(item.id, e.target.value)} />
                    </td>
                    <td className="text-center p-3 font-semibold">₹{itemTotal.toFixed(2)}</td>
                    <td className="text-center p-3 cursor-pointer text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>✕</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Totals & Payment */}
      <div className="bg-white shadow-xl p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 mb-3 gap-4">
          <div>
            <h2 className="text-xl font-bold text-purple-700">Grand Total:</h2>
            <span className="text-xl font-bold text-purple-700">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 mt-4">
          <div>
            <label className="font-semibold">Tax (%):</label>
            <input type="number" step="0.01" min="0" className="border px-3 py-2 rounded-lg w-full mt-1" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="Enter tax percent" />
          </div>

          <div>
            <label className="font-semibold">Tax Amount</label>
            <input readOnly value={`₹${taxAmount.toFixed(2)}`} className="border px-3 py-2 rounded-lg w-full mt-1 bg-gray-100" />
          </div>

          <div>
            <label className="font-semibold">Net Total</label>
            <input readOnly value={`₹${netTotal.toFixed(2)}`} className="border px-3 py-2 rounded-lg w-full mt-1 bg-gray-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Payment Method</label>
            <select name="payment_method" value={paymentMethod} onChange={handlePaymentMethodChange} className="border p-2 rounded w-full">
              <option value="">Select Payment Method</option>
              {paymentMethods.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1">Remark</label>
            <input type="text" autoComplete="off" placeholder="Remark" className="border p-2 rounded w-full" value={remark} onChange={(e) => setRemark(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button onClick={handleSaveInvoice} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md">Save Invoice</button>
        </div>
      </div>

      {/* Global Custom Alert */}
      <CustomAlert
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={handleAlertConfirm}
        onClose={closeAlert}
      />
    </div>
  );
}
