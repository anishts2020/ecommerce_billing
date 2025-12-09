import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; 
import api from "../Api";
import { BASE_URL } from "../Api";

/* =========================
   SVG ICONS
   ========================= */
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

/* =========================
   CustomAlert (used for success/error/confirm)
   - For Add product success: shows two buttons (View Products / Add Another)
   - For other types: single OK button
   ========================= */
const CustomAlert = ({ isOpen, title, message, type = "success", onClose, onView, onAddMore, onConfirm }) => {
  if (!isOpen) return null;

  let icon, bgColor, buttonColor, confirmText;
  switch (type) {
    case "confirm":
      icon = <AlertTriangleIcon className="w-12 h-12 text-yellow-500" />;
      bgColor = "bg-yellow-50 border-yellow-500";
      buttonColor = "bg-yellow-600 hover:bg-yellow-700";
      confirmText = "Yes";
      break;
    case "error":
      icon = <XCircleIcon className="w-12 h-12 text-red-500" />;
      bgColor = "bg-red-50 border-red-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "OK";
      break;
    default:
      icon = <CheckCircleIcon className="w-12 h-12 text-green-500" />;
      bgColor = "bg-green-50 border-green-500";
      buttonColor = "bg-green-600 hover:bg-green-700";
      confirmText = "Close";
  }


  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border-t-8 ${bgColor}`} onClick={(e) => e.stopPropagation()}>
        <div className="text-center space-y-4">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        {/* for add-product success we may show two buttons (View / Add Another) via onView/onAddMore */}
        {type === "success" && onView && onAddMore ? (
          <div className="mt-6 flex justify-center gap-4">
            <button onClick={onView} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">View Products</button>
          </div>
        ) : type === "confirm" && onConfirm ? (
          <div className="mt-6 flex justify-center gap-4">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg ${buttonColor}`}>{confirmText}</button>
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <button onClick={onClose} className={`px-4 py-2 text-white rounded-lg ${buttonColor}`}>{confirmText}</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================
   AddProductModal & EditProductModal share same modal UI
   We will create a ModalContainer to reduce duplication.
   ========================= */
const ModalContainer = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-indigo-700">{title}</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 transition p-2 rounded-full">✕</button>
      </div>
      {children}
    </div>
  </div>
);



/* =========================
   MAIN VIEW PRODUCTS COMPONENT
   - includes Add modal & Edit modal
   - Add modal uses the same modal layout as Edit
   ========================= */
const ViewProducts = () => {
  const navigate = useNavigate();

  // data lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [materials, setMaterials] = useState([]);

  // modal & edit/add states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [adding, setAdding] = useState(false);


  const [searchTerm, setSearchTerm] = useState("");


  // alerts
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    // confirm action for confirm alerts
    actionToRun: null,
  });

  const closeAlert = () => setAlertState((s) => ({ ...s, isOpen: false, actionToRun: null }));

  // fetch helpers
  const fetchProducts = () =>
    api.get("/products")
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => setAlertState({ isOpen: true, title: "Error", message: "Failed to load products", type: "error" }));

      const fetchCategories = () =>
      api
        .get("/product-categories")
        .then((res) =>
          setCategories(Array.isArray(res.data) ? res.data : res.data.data || [])
        )
        .catch(() => setCategories([]));
        const fetchTypes = () =>
        api
          .get("/product-types")
          .then((res) =>
            setTypes(Array.isArray(res.data) ? res.data : res.data.data || [])
          )
          .catch(() => setTypes([]));
        const fetchColors = () => api.get("/colors").then((res) => setColors(Array.isArray(res.data) ? res.data : res.data.data || [])).catch(()=>setColors([]));
  const fetchSizes = () => api.get("/sizes").then((res) => setSizes(Array.isArray(res.data) ? res.data : res.data.data || [])).catch(()=>setSizes([]));
  const fetchVendors = () => api.get("/vendors").then((res) => setVendors(Array.isArray(res.data) ? res.data : res.data.data || [])).catch(()=>setVendors([]));
  const fetchMaterials = () => api.get("/materials").then((res) => setMaterials(Array.isArray(res.data) ? res.data : res.data.data || [])).catch(()=>setMaterials([]));

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchTypes();
    fetchColors();
    fetchSizes();
    fetchVendors();
    fetchMaterials();
  }, []);

  // material lookup
  const materialLookup = Object.fromEntries(materials.map((m) => [m.material_id, m.material_name]));

  /* =========================
     EDIT flow
     - openEdit sets editData with string values for selects (to avoid wrong-type errors when editing)
     - handleUpdate sends PUT to update product
     ========================= */
  const handleEdit = (p) => {
    const imageUrl = p.image_url 
      ? p.image_url 
      : `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`;

    setEditData({
      product_id: (p.product_id || "").toString(),
      product_code: p.product_code || "",
      sku: p.sku || "",
      product_name: p.product_name || "",
      product_description: p.product_description || "",
      category_id: (p.category?.product_category_id || p.category_id || "").toString(),
      type_id: (p.type?.product_type_id || p.type_id || "").toString(),
      color_id: (p.color?.color_id || p.color_id || "").toString(),
      size_id: (p.size?.size_id || p.size_id || "").toString(),
      vendor_id: (p.vendor?.vendor_id || p.vendor_id || "").toString(),
      material_id: (p.material_id || "").toString(),
      unit_of_measure: p.unit_of_measure || "",
      quantity_on_hand: p.quantity_on_hand || "",
      min_stock_level: p.min_stock_level || "",
      cost_price: p.cost_price || "",
      selling_price: p.selling_price || "",
      tax_percent: p.tax_percent || "",

      product_image_url: imageUrl,  // FULL CORRECT URL HERE
      previewImage: null,
      product_image: null,
    });

    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
  
      // Append all fields to FormData
      Object.keys(editData).forEach((key) => {
        if (key !== "previewImage") {
          formData.append(key, editData[key]);
        }
      });
  
      // Convert numeric values
      formData.set("category_id", editData.category_id ? Number(editData.category_id) : "");
      formData.set("type_id", editData.type_id ? Number(editData.type_id) : "");
      formData.set("material_id", editData.material_id ? Number(editData.material_id) : "");
      formData.set("color_id", editData.color_id ? Number(editData.color_id) : "");
      formData.set("size_id", editData.size_id ? Number(editData.size_id) : "");
      formData.set("vendor_id", editData.vendor_id ? Number(editData.vendor_id) : "");
      formData.set("quantity_on_hand", editData.quantity_on_hand ? Number(editData.quantity_on_hand) : 0);
      formData.set("min_stock_level", editData.min_stock_level ? Number(editData.min_stock_level) : 0);
      formData.set("cost_price", editData.cost_price ? Number(editData.cost_price) : 0);
      formData.set("selling_price", editData.selling_price ? Number(editData.selling_price) : 0);
      formData.set("tax_percent", editData.tax_percent ? Number(editData.tax_percent) : 0);
  
      // Laravel requires _method=PUT for FormData PUT requests
      formData.append("_method", "PUT");
  
      await api.post(
        `/products/${editData.product_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setAlertState({
        isOpen: true,
        title: "Updated!",
        message: "Product updated successfully.",
        type: "success",
        onView: null,
        onAddMore: null,
      });
  
      fetchProducts();
      setShowEditModal(false);
  
    } catch (error) {
      setAlertState({
        isOpen: true,
        title: "Update Failed",
        message: error.response?.data?.message || "Something went wrong",
        type: "error",
      });
    }
  };
  

  /* =========================
     DELETE flow
     ========================= */
  const handleDelete = (id) => {
    setAlertState({
      isOpen: true,
      type: "confirm",
      title: "Are you sure?",
      message: "This product will be permanently deleted!",
      actionToRun: async () => {
        try {
          await api.delete(`/products/${id}`);
          setAlertState({ isOpen: true, type: "success", title: "Deleted!", message: "Product deleted successfully." });
          fetchProducts();
        } catch {
          setAlertState({ isOpen: true, type: "error", title: "Error!", message: "Failed to delete product." });
        }
      },
    });
  };

  /* =========================
     ADD flow
     - add modal uses same modern modal design
     - onAddSubmit: call POST, on success close modal, show success alert, refresh list
     - color dropdown search included
     ========================= */
  const [addForm, setAddForm] = useState({
    product_code: "",
    sku: "",
    product_name: "",
    product_description: "",
    category_id: "",
    type_id: "",
    material_id: "",
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
    product_image: null,
    previewImage: null,

  });

  // close color dropdown on outside click
  useEffect(() => {
    const handleClick = () => setAddForm((prev) => ({ ...prev, showColorDropdown: false }));
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const resetAddForm = () => {
    setAddForm({
      product_code: "",
      sku: "",
      product_name: "",
      product_description: "",
      category_id: "",
      type_id: "",
      material_id: "",
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

  const onAddSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
  
    try {
      // Use FormData for image upload
      const formData = new FormData();
  
      // Add all fields to FormData
      Object.keys(addForm).forEach((key) => {
        // ignore internal fields
        if (key === "searchColor" || key === "showColorDropdown" || key === "previewImage") return;
  
        formData.append(key, addForm[key]);
      });
  
      // Convert numeric values properly
      formData.set("category_id", addForm.category_id ? Number(addForm.category_id) : "");
      formData.set("type_id", addForm.type_id ? Number(addForm.type_id) : "");
      formData.set("material_id", addForm.material_id ? Number(addForm.material_id) : "");
      formData.set("color_id", addForm.color_id ? Number(addForm.color_id) : "");
      formData.set("size_id", addForm.size_id ? Number(addForm.size_id) : "");
      formData.set("vendor_id", addForm.vendor_id ? Number(addForm.vendor_id) : "");
      formData.set("quantity_on_hand", addForm.quantity_on_hand ? Number(addForm.quantity_on_hand) : 0);
      formData.set("min_stock_level", addForm.min_stock_level ? Number(addForm.min_stock_level) : 0);
      formData.set("cost_price", addForm.cost_price ? Number(addForm.cost_price) : 0);
      formData.set("selling_price", addForm.selling_price ? Number(addForm.selling_price) : 0);
      formData.set("tax_percent", addForm.tax_percent ? Number(addForm.tax_percent) : 0);
  
      // API request with multipart form data
      await api.post("/products/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Success alert (ONLY OK button)
      setShowAddModal(false);
      resetAddForm();
  
      setAlertState({
        isOpen: true,
        title: "Product Added",
        message: "Product added successfully.",
        type: "success",
        onView: null,      // ensure NO second button appears
        onAddMore: null,
      });
  
      fetchProducts();
  
    } catch (err) {
      setAlertState({
        isOpen: true,
        title: "Failed to Add Product",
        message:
          err.response?.data?.message ||
          (err.response?.data?.errors
            ? Object.values(err.response.data.errors).flat().join(", ")
            : "Something went wrong!"),
        type: "error",
      });
    } finally {
      setAdding(false);
    }
  };
  

  /* =========================
     UTIL helpers for display
     ========================= */
  const getColorById = (id) => colors.find((c) => String(c.color_id) === String(id)) || null;

  /* =========================
     UI render - Option A (ProductCategories header style)
     - only UI changed
     ========================= */

     // PAGINATION STATES
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header Card: Title left, Search + Add right */}
        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-700">📦 Product List</h1>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 w-72 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={() => {
                resetAddForm();
                setShowAddModal(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md transition duration-150"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* horizontal scroll wrapper - ensures table can scroll left/right on small screens */}
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">Code</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">SKU</th>
                  <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider">Color</th>
                  <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider">Size</th>
                  <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider">Vendor</th>
                  <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider">Material</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">UOM</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">Qty</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">Min Stock</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">Cost</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">Selling</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">Tax</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">Barcode</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">Image</th>
                  <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
  {(() => {
    const term = searchTerm.toLowerCase();

    // 1️⃣ Filter
    const filtered = products
      .filter((p) =>
        (p.product_code || "").toLowerCase().includes(term)
      );

    // 2️⃣ Sort (newest first)
    filtered.sort((a, b) => b.product_id - a.product_id);

    // 3️⃣ Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        {/* ROWS */}
        {paginated.map((p) => (
          <tr key={p.product_id} className="hover:bg-gray-50 transition duration-150">
            <td className="py-3 px-4 text-center text-sm text-gray-800">{p.product_code}</td>
            <td className="py-3 px-4 text-center text-sm text-gray-800">{p.sku}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-900">{p.product_name}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-800 truncate max-w-xs">{p.product_description}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-800">{p.category?.product_category_name || "-"}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-800">{p.type?.product_type_name || "-"}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-800">{p.color?.color_name || "-"}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-800">{p.size?.size_name || "-"}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-800">{p.vendor?.vendor_name || "-"}</td>
            <td className="py-3 px-4 text-left text-sm text-gray-800">{materialLookup[p.material_id] || "-"}</td>
            <td className="py-3 px-4 text-center text-sm text-gray-800">{p.unit_of_measure}</td>
            <td className="py-3 px-4 text-center text-sm text-gray-800">{p.quantity_on_hand}</td>
            <td className="py-3 px-4 text-center text-sm text-gray-800">{p.min_stock_level}</td>
            <td className="py-3 px-4 text-center text-sm text-gray-800">{p.cost_price}</td>
            <td className="py-3 px-4 text-center text-sm text-gray-800">{p.selling_price}</td>
            <td className="py-3 px-4 text-center text-sm text-gray-800">{p.tax_percent}</td>

            {/* BARCODE */}
            <td className="py-3 px-4 text-center text-sm">
              <Barcode value={String(p.product_id)} height={40} width={1.2} fontSize={10} />
            </td>

            {/* IMAGE */}
            <td className="py-3 px-4 text-center text-sm text-gray-800">
              {p.product_image ? (
                <img
                  //src={`${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`}
                  src={p.image_url}
                  alt="Product"
                  className="w-14 h-14 object-cover rounded-lg shadow mx-auto"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </td>

            {/* ACTIONS */}
            <td className="py-3 px-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="p-2 rounded-full hover:bg-indigo-100 transition text-indigo-600"
                >
                  <FaEdit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(p.product_id)}
                  className="p-2 rounded-full hover:bg-red-100 transition text-red-600"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}

        {/* No results */}
        {filtered.length === 0 && (
          <tr>
            <td colSpan="19" className="py-4 text-center text-gray-500">
              No products found
            </td>
          </tr>
        )}

        {/* PAGINATION CONTROL */}
        <tr>
          <td colSpan="19" className="py-4">
            <div className="flex justify-center items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>

              <span className="px-4">
                Page {currentPage} / {Math.ceil(filtered.length / itemsPerPage)}
              </span>

              <button
                disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </td>
        </tr>
      </>
    );
  })()}
</tbody>

            </table>
          </div>

          {/* no-results message */}
          {products


          
          .filter((p) => {
            const term = searchTerm.toLowerCase();
            return (
             
              (p.product_code || "").toLowerCase().includes(term)
              
            );
          }).length === 0 && (
            <div className="p-6 text-center text-gray-500 font-semibold">No products found</div>
          )}
        </div>
      </div>

      {/* ======================
          ADD PRODUCT MODAL
         ====================== */}
      {showAddModal && (
        <ModalContainer title="Add New Product" onClose={() => setShowAddModal(false)}>
          <form onSubmit={onAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="border p-2 rounded" placeholder="Product Code" value={addForm.product_code} onChange={(e) => setAddForm({ ...addForm, product_code: e.target.value })} />
              <input className="border p-2 rounded" placeholder="SKU" value={addForm.sku} onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })} />
              <input className="border p-2 rounded" placeholder="Product Name" value={addForm.product_name} onChange={(e) => setAddForm({ ...addForm, product_name: e.target.value })} />

              {/* Image Upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border p-2 rounded w-full"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setAddForm({ ...addForm, product_image: file, previewImage: URL.createObjectURL(file) });
                  }}
                />

                {/* preview image */}
                {addForm.previewImage && (
                  <img
                    src={addForm.previewImage}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded border"
                  />
                )}
              </div>

              <select className="border p-2 rounded" value={addForm.category_id} onChange={(e) => setAddForm({ ...addForm, category_id: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.product_category_id} value={c.product_category_id}>{c.product_category_name}</option>)}
              </select>

              <textarea className="border p-2 rounded col-span-2" placeholder="Description" value={addForm.product_description} onChange={(e) => setAddForm({ ...addForm, product_description: e.target.value })} />

              <select className="border p-2 rounded" value={addForm.type_id} onChange={(e) => setAddForm({ ...addForm, type_id: e.target.value })}>
                <option value="">Select Type</option>
                {types.map((t) => <option key={t.product_type_id} value={t.product_type_id}>{t.product_type_name}</option>)}
              </select>

              <select className="border p-2 rounded" value={addForm.size_id} onChange={(e) => setAddForm({ ...addForm, size_id: e.target.value })}>
                <option value="">Select Size</option>
                {sizes.map((s) => <option key={s.size_id} value={s.size_id}>{s.size_name}</option>)}
              </select>

              <select className="border p-2 rounded" value={addForm.vendor_id} onChange={(e) => setAddForm({ ...addForm, vendor_id: e.target.value })}>
                <option value="">Select Vendor</option>
                {vendors.map((v) => <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_name}</option>)}
              </select>

              <select className="border p-2 rounded" value={addForm.material_id} onChange={(e) => setAddForm({ ...addForm, material_id: e.target.value })}>
                <option value="">Select Material</option>
                {materials.map((m) => <option key={m.material_id} value={m.material_id}>{m.material_name}</option>)}
              </select>

              {/* Color search/dropdown */}
              <div className="col-span-2 relative" onClick={(e) => e.stopPropagation()}>
                <label className="text-sm block mb-1">Color</label>
                <input
                  type="text"
                  placeholder="Search color..."
                  className="w-full border p-2 rounded"
                  value={addForm.searchColor}
                  onChange={(e) => setAddForm({ ...addForm, searchColor: e.target.value })}
                  onFocus={() => setAddForm({ ...addForm, showColorDropdown: true })}
                />
                {addForm.showColorDropdown && (
                  <div className="absolute z-30 left-0 right-0 bg-white border rounded mt-1 max-h-48 overflow-y-auto shadow">
                    {colors.filter((c) => c.color_name.toLowerCase().includes(addForm.searchColor.toLowerCase())).map((color) => (
                      <div
                        key={color.color_id}
                        className="p-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
                        onClick={() => setAddForm({ ...addForm, color_id: color.color_id, searchColor: color.color_name, showColorDropdown: false })}
                      >
                        <span className="w-5 h-5 rounded border" style={{ backgroundColor: color.color_code }}></span>
                        <span className="text-sm">{color.color_name}</span>
                      </div>
                    ))}
                    {colors.filter((c) => c.color_name.toLowerCase().includes(addForm.searchColor.toLowerCase())).length === 0 && (
                      <div className="p-2 text-gray-500 text-sm">No colors found</div>
                    )}
                  </div>
                )}
                {addForm.color_id && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-700">Selected:</span>
                    <span className="w-6 h-6 rounded border shadow" style={{ backgroundColor: getColorById(addForm.color_id)?.color_code || "#fff" }}></span>
                    <span className="text-sm text-gray-600">{getColorById(addForm.color_id)?.color_name}</span>
                  </div>
                )}
              </div>

              <input className="border p-2 rounded" placeholder="Unit of Measure" value={addForm.unit_of_measure} onChange={(e) => setAddForm({ ...addForm, unit_of_measure: e.target.value })} />

              <input className="border p-2 rounded" placeholder="Quantity on Hand" type="number" value={addForm.quantity_on_hand} onChange={(e) => setAddForm({ ...addForm, quantity_on_hand: e.target.value })} />

              <input className="border p-2 rounded" placeholder="Min Stock Level" type="number" value={addForm.min_stock_level} onChange={(e) => setAddForm({ ...addForm, min_stock_level: e.target.value })} />

              <input className="border p-2 rounded" placeholder="Cost Price" type="number" value={addForm.cost_price} onChange={(e) => setAddForm({ ...addForm, cost_price: e.target.value })} />

              <input className="border p-2 rounded" placeholder="Selling Price" type="number" value={addForm.selling_price} onChange={(e) => setAddForm({ ...addForm, selling_price: e.target.value })} />

              <input className="border p-2 rounded" placeholder="Tax %" type="number" value={addForm.tax_percent} onChange={(e) => setAddForm({ ...addForm, tax_percent: e.target.value })} />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t mt-3">
            <button 
              type="button" 
              onClick={() => { 
                resetAddForm();   // CLEAR FIELDS
                setShowAddModal(false); 
              }} 
              className="px-5 py-2 border rounded-lg"
            >
              Cancel
            </button>
              <button type="submit" disabled={adding} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                {adding ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </ModalContainer>
      )}

      {/* ======================
          EDIT PRODUCT MODAL (same modern modal design)
         ====================== */}
      {showEditModal && (
  <ModalContainer title="Edit Product" onClose={() => setShowEditModal(false)}>
    <form onSubmit={handleUpdate} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <input
          className="border p-2 rounded"
          placeholder="Product Code"
          value={editData.product_code || ""}
          onChange={(e) =>
            setEditData({ ...editData, product_code: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="SKU"
          value={editData.sku || ""}
          onChange={(e) =>
            setEditData({ ...editData, sku: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Product Name"
          value={editData.product_name || ""}
          onChange={(e) =>
            setEditData({ ...editData, product_name: e.target.value })
          }
        />

        {/* ============================
              IMAGE SECTION
        ============================ */}
        {/* IMAGE PREVIEW SECTION */}
<div className="col-span-2">
  <label className="block text-sm font-medium mb-1">Product Image</label>

  <input
    type="file"
    accept="image/*"
    className="border p-2 rounded w-full"
    onChange={(e) => {
      const file = e.target.files[0];
      setEditData({
        ...editData,
        product_image: file,
        previewImage: URL.createObjectURL(file),
      });
    }}
  />

  {/* 1️⃣ If user selected a new file — show new preview */}
  {editData.previewImage && (
    <img
      src={editData.previewImage}
      alt="Preview"
      className="mt-2 w-32 h-32 object-cover rounded border"
    />
  )}

  {/* 2️⃣ Show saved image ONLY IF preview doesn't exist */}
  {!editData.previewImage && editData.product_image_url && (
    <img
      src={editData.product_image_url}
      alt="Saved Product"
      className="mt-2 w-32 h-32 object-cover rounded border"
    />
  )}
</div>


        {/* ============================
              SELECT FIELDS
        ============================ */}

        <select
          className="border p-2 rounded"
          value={editData.category_id || ""}
          onChange={(e) =>
            setEditData({ ...editData, category_id: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.product_category_id} value={c.product_category_id}>
              {c.product_category_name}
            </option>
          ))}
        </select>

        <textarea
          className="border p-2 rounded col-span-2"
          placeholder="Description"
          value={editData.product_description || ""}
          onChange={(e) =>
            setEditData({ ...editData, product_description: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
          value={editData.type_id || ""}
          onChange={(e) =>
            setEditData({ ...editData, type_id: e.target.value })
          }
        >
          <option value="">Select Type</option>
          {types.map((t) => (
            <option key={t.product_type_id} value={t.product_type_id}>
              {t.product_type_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={editData.size_id || ""}
          onChange={(e) =>
            setEditData({ ...editData, size_id: e.target.value })
          }
        >
          <option value="">Select Size</option>
          {sizes.map((s) => (
            <option key={s.size_id} value={s.size_id}>
              {s.size_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={editData.vendor_id || ""}
          onChange={(e) =>
            setEditData({ ...editData, vendor_id: e.target.value })
          }
        >
          <option value="">Select Vendor</option>
          {vendors.map((v) => (
            <option key={v.vendor_id} value={v.vendor_id}>
              {v.vendor_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={editData.material_id || ""}
          onChange={(e) =>
            setEditData({ ...editData, material_id: e.target.value })
          }
        >
          <option value="">Select Material</option>
          {materials.map((m) => (
            <option key={m.material_id} value={m.material_id}>
              {m.material_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={editData.color_id || ""}
          onChange={(e) =>
            setEditData({ ...editData, color_id: e.target.value })
          }
        >
          <option value="">Select Color</option>
          {colors.map((c) => (
            <option key={c.color_id} value={c.color_id}>
              {c.color_name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          placeholder="Unit of Measure"
          value={editData.unit_of_measure || ""}
          onChange={(e) =>
            setEditData({ ...editData, unit_of_measure: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Quantity on Hand"
          type="number"
          value={editData.quantity_on_hand || ""}
          onChange={(e) =>
            setEditData({ ...editData, quantity_on_hand: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Min Stock Level"
          type="number"
          value={editData.min_stock_level || ""}
          onChange={(e) =>
            setEditData({ ...editData, min_stock_level: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Cost Price"
          type="number"
          value={editData.cost_price || ""}
          onChange={(e) =>
            setEditData({ ...editData, cost_price: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Selling Price"
          type="number"
          value={editData.selling_price || ""}
          onChange={(e) =>
            setEditData({ ...editData, selling_price: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Tax %"
          type="number"
          value={editData.tax_percent || ""}
          onChange={(e) =>
            setEditData({ ...editData, tax_percent: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t mt-3">
        <button
          type="button"
          onClick={() => setShowEditModal(false)}
          className="px-5 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  </ModalContainer>
)}


      {/* GLOBAL ALERT */}
      <CustomAlert
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={() => {
          // if it was success from add product and we want to show the two-button variant (View / Add Another)
          if (alertState.type === "success") {
            // show two-button behavior by passing onView and onAddMore below conditionally
            // but CustomAlert here requires onView/onAddMore — we supply them below conditionally
          }
          closeAlert();
        }}
        onConfirm={() => {
          // used for confirm alerts — run actionToRun if provided
          if (typeof alertState.actionToRun === "function") alertState.actionToRun();
          closeAlert();
        }}
        onView={() => {
          closeAlert();
          // user asked to View Products after adding: navigate or simply refresh
          navigate("/view-products");
        }}
        onAddMore={() => {
          closeAlert(); 
          // reopen add modal for another add
          setShowAddModal(true);
        }}
      />
    </div>
  );
};

export default ViewProducts;
