import React, { useEffect, useState } from "react";
import axios from "axios";
import Barcode from "react-barcode";

// SVG Icons
const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Custom Alert Component
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, bgColor, buttonColor, confirmText;

  switch (type) {
    case "confirm":
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      bgColor = "bg-yellow-50 border-yellow-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes, delete it!";
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
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border-t-8 ${bgColor}`} onClick={(e) => e.stopPropagation()}>
        <div className="text-center space-y-4">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          {type === "confirm" && (
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          )}

          <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg ${buttonColor}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});

  // ALERT SYSTEM
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    actionToRun: null,
  });

  const closeAlert = () => setAlertState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });

  const handleAlertConfirm = () => {
    if (alertState.type === "confirm" && alertState.actionToRun) {
      alertState.actionToRun();
    }
    closeAlert();
  };

  // Fetch all products
  const fetchProducts = () => {
    axios
      .get("http://localhost:8000/api/products")
      .then((res) => setProducts(res.data))
      .catch(() =>
        setAlertState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to load products",
        })
      );
  };

  const fetchCategories = () => {
    axios.get("http://localhost:8000/api/categories").then((res) => setCategories(res.data));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    axios.get("http://localhost:8000/api/types").then((res) => setTypes(res.data));
    axios.get("http://localhost:8000/api/colors").then((res) => setColors(res.data));
    axios.get("http://localhost:8000/api/sizes").then((res) => setSizes(res.data));
    axios.get("http://localhost:8000/api/vendors").then((res) => setVendors(res.data));
  }, []);

  // Open modal with selected product
  const handleEdit = (p) => {
    setEditData({
      product_id: p.product_id,
      product_code: p.product_code,
      sku: p.sku,
      product_name: p.product_name,
      product_description: p.product_description,
      category_id: p.category?.product_category_id || p.category_id,
      type_id: p.type?.product_type_id || p.type_id,
      color_id: p.color?.color_id || p.color_id,
      size_id: p.size?.size_id || p.size_id,
      vendor_id: p.vendor?.vendor_id || p.vendor_id,
      unit_of_measure: p.unit_of_measure,
      quantity_on_hand: p.quantity_on_hand,
      min_stock_level: p.min_stock_level,
      cost_price: p.cost_price,
      selling_price: p.selling_price,
      tax_percent: p.tax_percent
    });
    

    setShowModal(true);
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8000/api/products/${editData.product_id}`, editData);

      setAlertState({
        isOpen: true,
        type: "success",
        title: "Updated!",
        message: "Product updated successfully",
      });

      fetchProducts();
      setShowModal(false);
    } catch (error) {
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  // Delete product
  const handleDelete = (id) => {
    setAlertState({
      isOpen: true,
      type: "confirm",
      title: "Are you sure?",
      message: "This product will be permanently deleted!",
      actionToRun: async () => {
        try {
          await axios.delete(`http://localhost:8000/api/products/${id}`);

          setAlertState({
            isOpen: true,
            type: "success",
            title: "Deleted!",
            message: "Product deleted successfully.",
          });

          fetchProducts();
        } catch {
          setAlertState({
            isOpen: true,
            type: "error",
            title: "Error!",
            message: "Failed to delete product.",
          });
        }
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Product List</h1>

      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Code</th>
              <th className="border p-2">SKU</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Color</th>
              <th className="border p-2">Size</th>
              <th className="border p-2">Vendor</th>
              <th className="border p-2">UOM</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Min Stock</th>
              <th className="border p-2">Cost</th>
              <th className="border p-2">Selling</th>
              <th className="border p-2">Tax</th>
              <th className="border p-2">Barcode</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.product_id}>
                <td className="border p-2">{p.product_code}</td>
                <td className="border p-2">{p.sku}</td>
                <td className="border p-2">{p.product_name}</td>
                <td className="border p-2">{p.product_description}</td>

                <td className="border p-2">{p.category?.product_category_name || "-"}</td>
                <td className="border p-2">{p.type?.product_type_name || "-"}</td>
                <td className="border p-2">{p.color?.color_name || "-"}</td>
                <td className="border p-2">{p.size?.size_name || "-"}</td>
                <td className="border p-2">{p.vendor?.vendor_name || "-"}</td>

                <td className="border p-2">{p.unit_of_measure}</td>
                <td className="border p-2">{p.quantity_on_hand}</td>
                <td className="border p-2">{p.min_stock_level}</td>
                <td className="border p-2">{p.cost_price}</td>
                <td className="border p-2">{p.selling_price}</td>
                <td className="border p-2">{p.tax_percent}</td>

                <td className="border p-2">
                  <Barcode value={p.product_id} height={40} width={1.5} fontSize={12} />
                </td>

                <td className="border p-2">
                  <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-yellow-500 text-white mr-2 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.product_id)} className="px-3 py-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-40 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-indigo-700">Edit Product</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {[
                  { key: "product_code", label: "Product Code" },
                  { key: "sku", label: "SKU" },
                  { key: "product_name", label: "Product Name" },
                  { key: "product_description", label: "Description" },
                  { key: "unit_of_measure", label: "Unit of Measure" },
                  { key: "quantity_on_hand", label: "Quantity" },
                  { key: "min_stock_level", label: "Minimum Stock Level" },
                  { key: "cost_price", label: "Cost Price" },
                  { key: "selling_price", label: "Selling Price" },
                  { key: "tax_percent", label: "Tax Percentage" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                    <input
                      type="text"
                      value={editData[field.key] || ""}
                      onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                      className="block w-full p-3 border rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                ))}

                {/* CATEGORY */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={editData.category_id}
                    onChange={(e) => setEditData({ ...editData, category_id: e.target.value })}
                    className="block w-full p-3 border rounded-lg shadow-inner"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.product_category_id} value={cat.product_category_id}>{cat.product_category_name}</option>
                    ))}
                  </select>
                </div>

                {/* TYPE */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                  <select
                    value={editData.type_id}
                    onChange={(e) => setEditData({ ...editData, type_id: e.target.value })}
                    className="block w-full p-3 border rounded-lg shadow-inner"
                  >
                    <option value="">Select Type</option>
                    {types.map((t) => (
                      <option key={t.product_type_id} value={t.product_type_id}>{t.product_type_name}</option>
                    ))}
                  </select>
                </div>

                {/* COLOR */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                  <select
                    value={editData.color_id}
                    onChange={(e) => setEditData({ ...editData, color_id: e.target.value })}
                    className="block w-full p-3 border rounded-lg shadow-inner"
                  >
                    <option value="">Select Color</option>
                    {colors.map((c) => (
                      <option key={c.color_id} value={c.color_id}>{c.color_name}</option>
                    ))}
                  </select>
                </div>

                {/* SIZE */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Size</label>
                  <select
                    value={editData.size_id || ""}
                    onChange={(e) => setEditData({ ...editData, size_id: parseInt(e.target.value) })}
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                  >
                    <option value="">Select Size</option>
                    {sizes.map((s) => (
                      <option key={s.size_id} value={s.size_id}>
                        {s.size_name}
                      </option>
                    ))}
                  </select>
                </div>


                {/* VENDOR */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor</label>
                  <select
                    value={editData.vendor_id}
                    onChange={(e) => setEditData({ ...editData, vendor_id: e.target.value })}
                    className="block w-full p-3 border rounded-lg shadow-inner"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                      <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL ALERT */}
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
};

export default ViewProducts;
