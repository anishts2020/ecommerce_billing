import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ----------------------------------------------------------
   SVG ICONS
---------------------------------------------------------- */
const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

/* ----------------------------------------------------------
   CUSTOM ALERT
---------------------------------------------------------- */
const CustomAlert = ({ isOpen, title, message, type, onClose, onView, onAddMore }) => {
  if (!isOpen) return null;

  let icon, bgColor, buttonColor;

  switch (type) {
    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      bgColor = "bg-green-50 border-green-600";
      buttonColor = "bg-green-600 hover:bg-green-700";
      break;

    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      bgColor = "bg-red-50 border-red-600";
      buttonColor = "bg-red-600 hover:bg-red-700";
      break;

    default:
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      bgColor = "bg-yellow-50 border-yellow-600";
      buttonColor = "bg-yellow-600 hover:bg-yellow-700";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" onClick={onClose}>
      <div
        className={`bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border-t-8 ${bgColor}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-4">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        {type === "success" ? (
          <div className="mt-6 flex justify-center gap-4">
            <button onClick={onView} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              View Products
            </button>
            <button onClick={onAddMore} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Add Another
            </button>
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <button onClick={onClose} className={`px-4 py-2 text-white rounded-lg ${buttonColor}`}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------------- */
const AddProduct = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const openAlert = (title, message, type = "success") =>
    setAlert({ isOpen: true, title, message, type });

  const closeAlert = () => setAlert({ ...alert, isOpen: false });

  /* ----------------------------------------------------------
     FORM STATE
  ---------------------------------------------------------- */
  const [formData, setFormData] = useState({
    product_code: "",
    sku: "",
    product_name: "",
    product_description: "",
    category_id: "",
    type_id: "",
    color_id: "",
    size_id: "",
    vendor_id: "",
    unit_of_measure: "",
    quantity_on_hand: "",
    min_stock_level: "",
    cost_price: "",
    selling_price: "",
    tax_percent: "",
    searchColor: "",
    showColorDropdown: false,
  });

  /* ----------------------------------------------------------
     FETCH DATA
  ---------------------------------------------------------- */
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
  axios.get("http://localhost:8000/api/categories").then((res) =>
    setCategories(Array.isArray(res.data) ? res.data : res.data.data || [])
  );

  axios.get("http://localhost:8000/api/types").then((res) =>
    setTypes(Array.isArray(res.data) ? res.data : res.data.data || [])
  );

  axios.get("http://localhost:8000/api/colors").then((res) =>
    setColors(Array.isArray(res.data) ? res.data : res.data.data || [])
  );

  axios.get("http://localhost:8000/api/sizes").then((res) =>
    setSizes(Array.isArray(res.data) ? res.data : res.data.data || [])
  );

  axios.get("http://localhost:8000/api/vendors").then((res) =>
    setVendors(Array.isArray(res.data) ? res.data : res.data.data || [])
  );
}, []);

  /* ---- Close color dropdown on outside click ---- */
  useEffect(() => {
    const closeDropdown = () => {
      setFormData((prev) => ({ ...prev, showColorDropdown: false }));
    };
    window.addEventListener("click", closeDropdown);

    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  /* ----------------------------------------------------------
     SUBMIT FORM
  ---------------------------------------------------------- */
  const resetForm = () => {
    setFormData({
      product_code: "",
      sku: "",
      product_name: "",
      product_description: "",
      category_id: "",
      type_id: "",
      color_id: "",
      size_id: "",
      vendor_id: "",
      unit_of_measure: "",
      quantity_on_hand: "",
      min_stock_level: "",
      cost_price: "",
      selling_price: "",
      tax_percent: "",
      searchColor: "",
      showColorDropdown: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/api/products/store", formData)
      .then(() => {
        openAlert("Product Added Successfully!", "What would you like to do next?");
      })
      .catch((err) => {
        openAlert("Failed to Add Product", err.response?.data?.message || "Something went wrong!", "error");
      });
  };

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */
  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Product Code */}
        <input
          type="text"
          placeholder="Product Code"
          className="border p-2 rounded"
          value={formData.product_code}
          onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
        />

        {/* SKU */}
        <input
          type="text"
          placeholder="SKU"
          className="border p-2 rounded"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        />

        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 rounded"
          value={formData.product_name}
          onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          className="border p-2 rounded col-span-2"
          value={formData.product_description}
          onChange={(e) =>
            setFormData({ ...formData, product_description: e.target.value })
          }
        />

        {/* Category */}
        <select
          className="border p-2 rounded"
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.product_category_id} value={cat.product_category_id}>
              {cat.product_category_name}
            </option>
          ))}
        </select>

        {/* Type */}
        <select
          className="border p-2 rounded"
          onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
        >
          <option value="">Select Type</option>
          {types.map((type) => (
            <option key={type.product_type_id} value={type.product_type_id}>
              {type.product_type_name}
            </option>
          ))}
        </select>

        {/* Size */}
        <select
          className="border p-2 rounded"
          onChange={(e) => setFormData({ ...formData, size_id: e.target.value })}
        >
          <option value="">Select Size</option>
          {sizes.map((size, index) => (
            <option key={`${index}-${size.size_name}`} value={size.size_id}>
              {size.size_name}
            </option>
          ))}
        </select>

        {/* Vendor */}
        <select
          className="border p-2 rounded"
          onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
        >
          <option value="">Select Vendor</option>
          {vendors.map((v) => (
            <option key={v.vendor_id} value={v.vendor_id}>
              {v.vendor_name}
            </option>
          ))}
        </select>

        {/* COLOR PICKER */}
        <div className="col-span-2">
          <label className="block mb-2 font-semibold text-gray-800 text-sm">
            Select Color
          </label>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* SEARCH BOX */}
            <input
              type="text"
              placeholder="Search color..."
              className="w-full border p-2 rounded"
              value={formData.searchColor}
              onChange={(e) =>
                setFormData({ ...formData, searchColor: e.target.value })
              }
              onFocus={() => setFormData({ ...formData, showColorDropdown: true })}
            />

            {/* DROPDOWN LIST */}
            {formData.showColorDropdown && (
              <div className="absolute z-20 bg-white border rounded w-full max-h-56 overflow-y-auto shadow">
                {colors
                  .filter((c) =>
                    c.color_name.toLowerCase().includes(formData.searchColor.toLowerCase())
                  )
                  .map((color) => (
                    <div
                      key={color.color_id}
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          color_id: color.color_id,
                          searchColor: color.color_name,
                          showColorDropdown: false,
                        });
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded border"
                        style={{ backgroundColor: color.color_code }}
                      ></span>

                      <span className="text-sm">{color.color_name}</span>
                    </div>
                  ))}

                {colors.filter((c) =>
                  c.color_name
                    .toLowerCase()
                    .includes(formData.searchColor.toLowerCase())
                ).length === 0 && (
                  <div className="p-2 text-gray-500 text-sm">No colors found</div>
                )}
              </div>
            )}
          </div>

          {/* Selected Color Preview */}
          {formData.color_id && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-700">Selected:</span>
              <span
                className="w-6 h-6 rounded border shadow"
                style={{
                  backgroundColor:
                    colors.find((c) => c.color_id === formData.color_id)?.color_code || "#fff",
                }}
              ></span>

              <span className="text-sm text-gray-600">
                {colors.find((c) => c.color_id === formData.color_id)?.color_name}
              </span>
            </div>
          )}
        </div>

        {/* Unit of Measure */}
        <input
          type="text"
          placeholder="Unit of Measure"
          className="border p-2 rounded"
          value={formData.unit_of_measure}
          onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
        />

        {/* Quantity */}
        <input
          type="number"
          placeholder="Quantity on Hand"
          className="border p-2 rounded"
          value={formData.quantity_on_hand}
          onChange={(e) => setFormData({ ...formData, quantity_on_hand: e.target.value })}
        />

        {/* Min Stock */}
        <input
          type="number"
          placeholder="Min Stock Level"
          className="border p-2 rounded"
          value={formData.min_stock_level}
          onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
        />

        {/* Cost Price */}
        <input
          type="number"
          placeholder="Cost Price"
          className="border p-2 rounded"
          value={formData.cost_price}
          onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
        />

        {/* Selling Price */}
        <input
          type="number"
          placeholder="Selling Price"
          className="border p-2 rounded"
          value={formData.selling_price}
          onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
        />

        {/* Tax */}
        <input
          type="number"
          placeholder="Tax %"
          className="border p-2 rounded"
          value={formData.tax_percent}
          onChange={(e) => setFormData({ ...formData, tax_percent: e.target.value })}
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Product
        </button>
      </form>

      {/* GLOBAL ALERT */}
      <CustomAlert
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
        onView={() => navigate("/view-products")}
        onAddMore={() => {
          closeAlert();
          resetForm();
        }}
      />
    </div>
  );
};

export default AddProduct;
