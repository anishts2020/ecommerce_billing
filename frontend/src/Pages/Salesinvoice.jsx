import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
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

    let icon, bgColor, buttonColor, confirmText, showCancelButton = false;
    let confirmAction = onConfirm; // Default action when clicking confirm button

    switch (type) {
        case 'confirm':
            icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
            bgColor = 'bg-white border-4 border-yellow-500';
            buttonColor = 'bg-red-600 hover:bg-red-700';
            confirmText = 'Yes, Continue !';
            showCancelButton = true;
            break;
        case 'success':
            icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
            bgColor = 'bg-white border-4 border-green-500';
            buttonColor = 'bg-green-600 hover:bg-green-700';
            confirmText = 'Close';
            confirmAction = onClose; // Success/Error typically just closes the modal
            break;
        case 'error':
            icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
            bgColor = 'bg-white border-4 border-red-500';
            buttonColor = 'bg-red-600 hover:bg-red-700';
            confirmText = 'Close';
            confirmAction = onClose; // Success/Error typically just closes the modal
            break;
        default:
            icon = <AlertTriangleIcon className="w-10 h-10 text-gray-500" />;
            bgColor = 'bg-white border-4 border-gray-500';
            buttonColor = 'bg-blue-600 hover:bg-blue-700';
            confirmText = 'OK';
            confirmAction = onClose;
    }

    return (
         <div className="fixed inset-0 z-40 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">
            <div className={`w-full max-w-md p-6 rounded-lg shadow-2xl transform scale-100 transition-all ${bgColor}`}>
                {/* Header/Icon */}
                <div className="flex items-center space-x-4">
                    {icon}
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>

                {/* Message */}
                <div className="mt-4 pl-14">
                    <p className="text-gray-600">{message}</p>
                </div>

                {/* Footer/Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                    {showCancelButton && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg 
                                       hover:bg-gray-300 transition duration-150"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={confirmAction}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition duration-150 ${buttonColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
function Salesinvoice() {
  const [barcode, setBarcode] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
 const [customAlert, setCustomAlert] = useState({
      isOpen: false, 
      title: "", 
      message: "", 
      type: "", 
      onConfirm: () => {}, 
      itemId: null 
    });
  
  // MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
    const [paymentMode, setPaymentMode] = useState(0);
  // CUSTOMER FORM STATE (correct one)
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

  // -------------------------------
  // BARCODE SCAN HANDLER
  // -------------------------------
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
    product_id: product.product_id,   // IMPORTANT
    name: product.product_name,
    price: product.selling_price,
    quantity: 1,
    total: product.selling_price,
  },
]);

        setBarcode("");
      } catch {
        window.alert("Product not found!");
      }
    }
  };

  // -------------------------------
  // CUSTOMER PHONE AUTO-LOAD
  // -------------------------------
  // CHECK PHONE
const handlePhoneCheck = (phone) => {
  if (!phone || phone.length < 10) return;

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
          gst_number: c.gst_number,
        });

        setEditingId(c.id);
      } else {
        setEditingId(null);
      }
    });
};

// HANDLE INPUT CHANGE
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });

  if (e.target.name === "phone" && e.target.value.length >= 10) {
    handlePhoneCheck(e.target.value);
  }
};

// SAVE CUSTOMER (CREATE / UPDATE)
const handleSave = async (e) => {
  e.preventDefault();

  try {
    let customerId = editingId;

    // 1. Save customer
    if (editingId) {
      await axios.put(`http://127.0.0.1:8000/api/customers/${editingId}`, formData);
    } else {
      const res = await axios.post("http://127.0.0.1:8000/api/customers", formData);
      customerId = res.data.id ?? res.data.data?.id;
    }

    // 2. Close customer form
    setShowModal(false);

    // 3. Show "Customer Saved" popup
    setCustomAlert({
      isOpen: true,
      type: "success",
      title: "Customer Saved",
      message: "Customer details saved successfully!",
      onConfirm: () => {
        setCustomAlert(a => ({ ...a, isOpen: false }));
        saveInvoice(customerId);   // NOW save invoice
      },
      onClose: () => {
        setCustomAlert(a => ({ ...a, isOpen: false }));
        saveInvoice(customerId);
      }
    });

  } catch (error) {
    console.error(error);

    // ERROR POPUP
    setCustomAlert({
      isOpen: true,
      type: "error",
      title: "Failed",
      message: "Failed to save customer",
      onConfirm: () => setCustomAlert(a => ({ ...a, isOpen: false })),
      onClose: () => setCustomAlert(a => ({ ...a, isOpen: false }))
    });
  }
};

 const saveInvoice = async (customerId) => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const invoiceNo =
    `INV-` +
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "-" +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());

  const invoiceDate =
    now.getFullYear() +
    "-" +
    pad(now.getMonth() + 1) +
    "-" +
    pad(now.getDate());

  const invoiceData = {
    invoice_no: invoiceNo,
    invoice_date: invoiceDate,
    customer_id: customerId,
    cashier_id: null,
    grand_total: grandTotal,
    discount,
    tax,
    net_total: netTotal,
    payment_mode: paymentMode,
    status: "PAID",
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
  console.log("INVOICE DATA SENDING TO SERVER:", invoiceData);


 try {
  await axios.post(
    "http://127.0.0.1:8000/api/sales-invoices",
    invoiceData
  );

  // SHOW INVOICE SUCCESS ALERT
  setCustomAlert({
    isOpen: true,
    type: "success",
    title: "Invoice Saved",
    message: "Invoice created successfully!",
    onConfirm: () => {
      setCustomAlert(a => ({ ...a, isOpen: false }));
      navigate("/salesinvoice_list");
    },
    onClose: () => {
      setCustomAlert(a => ({ ...a, isOpen: false }));
      navigate("/salesinvoice_list");
    }
  });

} catch (error) {
  console.error(error);

  // ERROR ALERT
  setCustomAlert({
    isOpen: true,
    type: "error",
    title: "Failed",
    message: "Failed to save invoice!",
    onConfirm: () => setCustomAlert(a => ({ ...a, isOpen: false })),
    onClose: () => setCustomAlert(a => ({ ...a, isOpen: false }))
  });
}

};

const removeItem = (index) => {
  setItems(prev => prev.filter((_, i) => i !== index));
};




// CLOSE MODAL + RESET
const closeModal = () => {
  setShowModal(false);
  setEditingId(null);

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
const updateQuantity = (index, qty) => {
  setItems((prev) =>
    prev.map((item, i) =>
      i === index
        ? {
            ...item,
            quantity: qty,
            total: qty * item.price,
          }
        : item
    )
  );
};
  // -------------------------------
  // TOTAL CALCULATION
  // -------------------------------
  const grandTotal = items.reduce((sum, item) => sum + Number(item.total), 0);

  const netTotal = grandTotal - Number(discount) + Number(tax);
   

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <CustomAlert
  isOpen={customAlert.isOpen}
  title={customAlert.title}
  message={customAlert.message}
  type={customAlert.type}
  onConfirm={customAlert.onConfirm}
  onClose={customAlert.onClose}
/>


        {/* HEADER */}
        <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-700">🧾 Sales Invoice</h1>

          <input
            type="text"
            value={barcode}
            placeholder="Scan Barcode Here..."
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleScan}
            className="w-64 px-4 py-2 border border-gray-300 rounded-full shadow-sm 
                       focus:ring-2 focus:ring-indigo-300 outline-none"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl shadow-2xl">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm font-bold uppercase tracking-wider">
                <th className="py-3 px-6 text-left rounded-tl-xl">SI No</th>
                <th className="py-3 px-6 text-left">Product Name</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Quantity</th>
                <th className="py-3 px-6 text-left rounded-tr-xl">Total</th>
                <th>cancel</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-200">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index} className="hover:bg-indigo-50">
                    <td className="py-3 px-6">{item.id}</td>
                    <td className="py-3 px-6 font-semibold text-gray-800">
                      {item.name}
                    </td>
                    <td className="py-3 px-6">₹{item.price}</td>
                    <td className="py-3 px-6">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(index, Number(e.target.value))
                        }
                        className="w-20 px-3 py-1 border border-gray-300 rounded-lg shadow-inner 
                                   focus:ring-2 focus:ring-indigo-300"
                      />
                    </td>
                    <td className="py-3 px-6 font-bold">₹{item.total}</td>
                    <td className="py-3 px-6" onClick={() => removeItem(index)}>  ✕ </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-500">
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

          <div className="flex justify-between items-center text-lg">
            <span>Discount:</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-32 px-3 py-2 border rounded-lg shadow-sm"
            />
          </div>

          <div className="flex justify-between items-center text-lg">
            <span>Tax:</span>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              className="w-32 px-3 py-2 border rounded-lg shadow-sm"
            />
          </div>

          <div className="flex justify-between text-2xl font-bold text-green-700 border-t pt-3">
            <span>Net Total:</span>
            <span>₹{netTotal}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
  <span>Payment Mode:</span>

  <select
    value={paymentMode}
    onChange={(e) => setPaymentMode(e.target.value)}
    className="w-40 px-3 py-2 border rounded-lg shadow-sm"
  >
    <option value={0}>Cash</option>
    <option value={1}>UPI</option>
    <option value={2}>Card</option>
  </select>
</div>


          <button
  onClick={() =>
    setCustomAlert({
      isOpen: true,
      type: "confirm",
      title: "Generate Invoice?",
      message: "Do you want to continue and enter customer details?",
      onConfirm: () => {
        setCustomAlert(a => ({ ...a, isOpen: false }));
        setShowModal(true); // open customer form
      },
      onClose: () => setCustomAlert(a => ({ ...a, isOpen: false }))
    })
  }
  className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
>
  Generate Bill
</button>

        </div>

        {/* ============================
              CUSTOMER MODAL
        ============================ */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl">

              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-indigo-700">
                  {editingId ? "Edit Customer" : "Add Customer"}
                </h3>

                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label>Customer Name</label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-inner"
                      required
                    />
                  </div>

                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-inner"
                      required
                    />
                  </div>

                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-inner"
                      required
                    />
                  </div>

                  <div>
                    <label>GST Number</label>
                    <input
                      type="text"
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-inner"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-inner"
                      required
                    />
                  </div>

                  <div>
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-inner"
                      required
                    />
                  </div>

                  <div>
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-inner"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingId ? "Update" : "Save and continue"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Salesinvoice;
