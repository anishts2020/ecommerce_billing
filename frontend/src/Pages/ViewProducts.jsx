import React, { useEffect, useState } from "react";
import axios from "axios";
import Barcode from "react-barcode";
import Swal from "sweetalert2";




const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);

  const [sizes, setSizes] = useState([]);


  const [vendors, setVendors] = useState([]);


  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});

  // Fetch all products
  const fetchProducts = () => {
    axios
      .get("http://localhost:8000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  };

  // Fetch active categories
  const fetchCategories = () => {
    axios
      .get("http://localhost:8000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // Fetch Types
axios.get("http://localhost:8000/api/types")
.then(res => setTypes(res.data))
.catch(err => console.error("Error loading types:", err));

// Fetch Colors
axios.get("http://localhost:8000/api/colors")
.then(res => setColors(res.data))
.catch(err => console.error("Error loading colors:", err));

// Fetch Sizes
axios.get("http://localhost:8000/api/sizes")
.then(res => setSizes(res.data))
.catch(err => console.error("Error loading sizes:", err));

// Fetch Vendors
axios.get("http://localhost:8000/api/vendors")
.then(res => setVendors(res.data))
.catch(err => console.error("Error loading vendors:", err));

  }, []);

  // Open modal with selected product
  const handleEdit = (p) => {
    setEditData({
      ...p,
      category_id: p.category?.product_category_id || p.category_id,
      type_id: p.type?.product_type_id || p.type_id,
      color_id: p.color?.color_id || p.color_id,
      size_id: p.size?.product_size_id || p.size_id,
      vendor_id: p.vendor?.vendor_id || p.vendor_id,
    });
  
    setShowModal(true);
  };
  

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(
        `http://localhost:8000/api/products/${editData.product_id}`,
        editData
      );
  
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product updated successfully",
        timer: 1500,
        showConfirmButton: false
      });
  
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };
  


  // Delete product
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/api/products/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Product deleted successfully.", "success");
            fetchProducts();
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete product.", "error");
          });
      }
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

                <td className="border p-2">
                {p.category?.product_category_name || "-"}
                </td>

                <td className="border p-2">
                {p.type?.product_type_name || "-"}
                </td>

                <td className="border p-2">
                {p.color?.color_name || "-"}
                </td>


                <td className="border p-2">
                {p.size?.size_name || "-"}
                </td>


                <td className="border p-2">
                {p.vendor?.vendor_name || "-"}
                </td>


                <td className="border p-2">{p.unit_of_measure}</td>
                <td className="border p-2">{p.quantity_on_hand}</td>
                <td className="border p-2">{p.min_stock_level}</td>
                <td className="border p-2">{p.cost_price}</td>
                <td className="border p-2">{p.selling_price}</td>
                <td className="border p-2">{p.tax_percent}</td>
                <td className="border p-2">
                <Barcode 
                    value={p.product_id} 
                    height={40} 
                    width={1.5}
                    fontSize={12}
                />
                </td>


                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1 bg-yellow-500 text-white mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.product_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
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

            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-indigo-700">Edit Product</h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition duration-150 p-2 rounded-full hover:bg-red-50">✕</button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* TEXT INPUT FIELDS */}
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
                    { key: "tax_percent", label: "Tax Percentage" }
                ].map((field) => (
                    <div key={field.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                    <input
                        type="text"
                        value={editData[field.key] || ""}
                        onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                        className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                    />
                    </div>
                ))}

                {/* CATEGORY */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select
                    value={editData.category_id}
                    onChange={(e) => setEditData({ ...editData, category_id: e.target.value })}
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
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
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
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
                    value={editData.color_id || ""}
                    onChange={(e) => setEditData({ ...editData, color_id: e.target.value })}
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
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
                    onChange={(e) => setEditData({ ...editData, size_id: e.target.value })}
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                    >
                    <option value="">Select Size</option>
                    {sizes.map((s) => (
                        <option key={s.product_size_id} value={s.product_size_id}>{s.size_name}</option>
                    ))}
                    </select>
                </div>

                {/* VENDOR */}
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor</label>
                    <select
                    value={editData.vendor_id}
                    onChange={(e) => setEditData({ ...editData, vendor_id: e.target.value })}
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                    >
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                        <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_name}</option>
                    ))}
                    </select>
                </div>

                </div>

                {/* FOOTER BUTTONS */}
                <div className="pt-4 flex justify-end gap-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 font-medium transform hover:scale-105">Save Changes</button>
                </div>

            </form>
            </div>
        </div>
        )}




    </div>
  );
};

export default ViewProducts;
