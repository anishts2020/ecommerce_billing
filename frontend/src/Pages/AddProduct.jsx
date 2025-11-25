import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

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
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [colorPage, setColorPage] = useState(0); // page number
const COLORS_PER_PAGE = 50;

const paginatedColors = colors.slice(
  colorPage * COLORS_PER_PAGE,
  (colorPage + 1) * COLORS_PER_PAGE
);


  useEffect(() => {
    axios.get("http://localhost:8000/api/categories").then((res) => setCategories(res.data));
    axios.get("http://localhost:8000/api/types").then((res) => setTypes(res.data));
    axios.get("http://localhost:8000/api/colors").then((res) => setColors(res.data));
    axios.get("http://localhost:8000/api/sizes").then((res) => setSizes(res.data));
    axios.get("http://localhost:8000/api/vendors").then((res) => setVendors(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/products/store", formData)
      .then(() => {
        Swal.fire({
          title: "Product Added Successfully!",
          text: "What would you like to do next?",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "View Products",
          cancelButtonText: "Add Another",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/view-products");
          } else {
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
            });
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Failed to Add Product",
          text: err.response?.data?.message || "Something went wrong!",
        });
      });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Product Code"
          className="border p-2 rounded"
          value={formData.product_code}
          onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
        />

        <input
          type="text"
          placeholder="SKU"
          className="border p-2 rounded"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        />

        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 rounded"
          value={formData.product_name}
          onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded col-span-2"
          value={formData.product_description}
          onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
        />

        {/* Category */}
        <select
          className="border p-2 rounded"
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
        >
          <option>Select Category</option>
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
          <option>Select Type</option>
          {types.map((type) => (
            <option key={type.product_type_id} value={type.product_type_id}>
              {type.product_type_name}
            </option>
          ))}
        </select>

        {/* Color Picker */}
       {/* COLOR PALETTE PICKER */}
{/* COLOR PALETTE PICKER */}
{/* Color Picker */}
<div className="col-span-2">
  <label className="block mb-2 font-semibold text-gray-800 text-sm">
    Select Color
  </label>

  {/* 5x5 Compact Palette Grid */}
  <div
    className="
      grid grid-cols-5 gap-2
      bg-white p-3 rounded-xl shadow-inner border border-gray-300
    "
  >
    {paginatedColors.map((color) => (
      <div
        key={color.color_id}
        onClick={() =>
          setFormData({ ...formData, color_id: color.color_id })
        }
        className={`
          group relative w-8 h-8 rounded-md cursor-pointer border 
          hover:scale-110 transition-all duration-150 hover:shadow-md
          ${
            formData.color_id === color.color_id
              ? "border-black shadow-lg"
              : "border-gray-300"
          }
        `}
        style={{ backgroundColor: color.color_code }}
      >
        {/* Hover Tooltip */}
        <span
          className="
            absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-[2px]
            text-[9px] rounded-md shadow bg-gray-800 text-white opacity-0
            group-hover:opacity-100 transition duration-150 pointer-events-none
          "
        >
          {color.color_name}
        </span>

        {/* Selected Tick */}
        {formData.color_id === color.color_id && (
          <span
            className="
              absolute bottom-[2px] right-[2px]
              bg-white rounded-full p-[1px] text-[10px]
              text-green-600 font-bold shadow
            "
          >
            ✔
          </span>
        )}
      </div>
    ))}
  </div>

  {/* Pagination */}
  <button
  type="button"
  disabled={colorPage === 0}
  onClick={() => setColorPage((prev) => prev - 1)}
  className={`px-2 py-1 text-xs rounded-md font-semibold
    ${colorPage === 0
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-gray-700 text-white hover:bg-gray-900"}
  `}
>
  ◀ Prev
</button>

<button
  type="button"
  disabled={colorPage >= Math.ceil(colors.length / COLORS_PER_PAGE) - 1}
  onClick={() => setColorPage((prev) => prev + 1)}
  className={`px-2 py-1 text-xs rounded-md font-semibold
    ${
      colorPage >= Math.ceil(colors.length / COLORS_PER_PAGE) - 1
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-800"
    }
  `}
>
  Next ▶
</button>

</div>











        {/* Size */}
        <select
          className="border p-2 rounded"
          onChange={(e) => setFormData({ ...formData, size_id: e.target.value })}
        >
          <option>Select Size</option>
          {sizes.map((size) => (
            <option key={size.product_size_id} value={size.product_size_id}>
              {size.size_name}
            </option>
          ))}
        </select>

        {/* Vendor */}
        <select
          className="border p-2 rounded"
          onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
        >
          <option>Select Vendor</option>
          {vendors.map((v) => (
            <option key={v.vendor_id} value={v.vendor_id}>
              {v.vendor_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Unit of Measure"
          className="border p-2 rounded"
          value={formData.unit_of_measure}
          onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
        />

        <input
          type="number"
          placeholder="Quantity on Hand"
          className="border p-2 rounded"
          value={formData.quantity_on_hand}
          onChange={(e) => setFormData({ ...formData, quantity_on_hand: e.target.value })}
        />

        <input
          type="number"
          placeholder="Min Stock Level"
          className="border p-2 rounded"
          value={formData.min_stock_level}
          onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
        />

        <input
          type="number"
          placeholder="Cost Price"
          className="border p-2 rounded"
          value={formData.cost_price}
          onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
        />

        <input
          type="number"
          placeholder="Selling Price"
          className="border p-2 rounded"
          value={formData.selling_price}
          onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
        />

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
    </div>
  );
};

export default AddProduct;