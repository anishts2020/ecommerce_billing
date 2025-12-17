import { useState, useEffect } from "react";
// 1. Importing FaEdit and FaTrash for action buttons
import { FaEdit, FaTrash } from "react-icons/fa"; 
import api from "../Api";

// === ICON COMPONENTS (Keeping the utility icons for AlertModal) ===

// SVG Icons (re-included for completeness)
const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 
      2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
      0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 
      0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 
      2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// GLOBAL ALERT COMPONENT (Updated the 'confirm' case to match the new delete logic)
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, borderColor, buttonColor, confirmText;

  switch (type) {
    case "confirm": // Original was "confirm"
    case "delete-confirm": // Adding specific delete confirm type for clarity
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      borderColor = "border-yellow-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes, Delete";
      break;

    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      borderColor = "border-green-500";
      buttonColor = "bg-green-600 hover:bg-green-700";
      confirmText = "OK";
      break;

    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      borderColor = "border-red-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Close";
      break;

    default:
      icon = <AlertTriangleIcon className="w-10 h-10 text-gray-500" />;
      borderColor = "border-gray-500";
      buttonColor = "bg-blue-600 hover:bg-blue-700";
      confirmText = "OK";
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white p-6 rounded-xl w-96 border-t-8 shadow-xl ${borderColor}`}
      >
        <div className="flex flex-col items-center space-y-4">
          {icon}
          <h1 className="text-xl font-bold text-center">{title}</h1>
          <p className="text-gray-600 text-center">{message}</p>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          {(type === "confirm" || type === "delete-confirm") && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg shadow ${buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// PRODUCT CATEGORIES MAIN COMPONENT
// ---------------------------------------------------------
export default function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [product_category_name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // GLOBAL ALERT
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    actionToRun: null,
  });

  const closeAlert = () =>
    setAlertState({
      isOpen: false,
      title: "",
      message: "",
      type: "success",
      actionToRun: null,
    });

  const handleAlertConfirm = () => {
    if ((alertState.type === "confirm" || alertState.type === "delete-confirm") && alertState.actionToRun) {
      alertState.actionToRun();
    }
    closeAlert();
  };

  // ---------------------------------------------------------
  const fetchCategories = () => {
    api
      .get("/product-categories")
      .then((res) => setCategories(res.data))
      .catch(() =>
        setAlertState({
          isOpen: true,
          title: "Error",
          message: "Failed to load categories",
          type: "error",
        })
      );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------------------------------------------------
  const handleSave = () => {
    const data = { product_category_name, description };

    if (selectedId) {
      api
        .put(`/product-categories/${selectedId}`, data)
        .then(() => {
          fetchCategories();
          setOpenModal(false);
          setName("");
          setDescription("");
          setSelectedId(null);

          setAlertState({
            isOpen: true,
            title: "Updated!",
            message: "Category updated successfully",
            type: "success",
          });
        })
        .catch(() =>
          setAlertState({
            isOpen: true,
            title: "Error",
            message: "Update failed",
            type: "error",
          })
        );
    } else {
      api
        .post("/product-categories", data)
        .then(() => {
          fetchCategories();
          setOpenModal(false);
          setName("");
          setDescription("");

          setAlertState({
            isOpen: true,
            title: "Success",
            message: "Category added successfully",
            type: "success",
          });
        })
        .catch((err) => {
          let msg = "Could not add category";

          if (err.response?.status === 422) {
            msg =
              err.response.data.errors?.product_category_name?.[0] ||
              "Validation error";
          }

          setAlertState({
            isOpen: true,
            title: "Error",
            message: msg,
            type: "error",
          });
        });
    }
  };

  // ---------------------------------------------------------
  const deleteCategory = async (id) => {
    try {
      await api.delete(
        `/product-categories/${id}`
      );
      fetchCategories();

      setAlertState({
        isOpen: true,
        title: "Deleted",
        message: "Category deleted successfully",
        type: "success",
      });
    } catch {
      setAlertState({
        isOpen: true,
        title: "Error",
        message: "Delete failed. This category may be in use.",
        type: "error",
      });
    }
  };
  
  const handleDelete = (id) => {
    setAlertState({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this category permanently?",
      type: "delete-confirm", // Using delete-confirm type
      actionToRun: () => deleteCategory(id),
    });
  };

  // ---------------------------------------------------------
  // PAGINATION LOGIC
  // ---------------------------------------------------------

  // Filter categories based on search text
  const filteredCategories = categories.filter((cat) =>
    cat.product_category_name
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // Calculate total pages for the *filtered* data
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Recalculate the current page if it's out of bounds after filtering/deleting
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);


  // Get current items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handlers for Previous/Next buttons
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // ---------------------------------------------------------
  // RENDER FUNCTION
  // ---------------------------------------------------------
  return (
    // Updated: p-8 and bg-gray-100 for a cleaner background
    <div className="p-8 bg-gray-100 min-h-screen">
      
      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          {/* Updated: Rounded and shadow styling */}
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
            {/* Close Button */}
            <button 
                className="absolute top-3 right-3 text-xl font-bold text-gray-400 hover:text-gray-600" 
                onClick={() => setOpenModal(false)}>
                    ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              {selectedId ? "Edit Product Category" : "Add Product Category"}
            </h2>

            {/* Updated: Input styling */}
            <input
              type="text"
              placeholder="Category Name"
              value={product_category_name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2.5 w-full mb-4 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Updated: Textarea styling */}
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2.5 w-full rounded-lg h-24 focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="flex justify-end gap-3 mt-4">
              {/* Updated: Button styling */}
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm transition duration-150"
              >
                Close
              </button>

              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md text-sm transition duration-150"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Container Card */}
      <div className="max-w-6xl mx-auto">
        
        {/* 1. TOP HEADER (Title, Search, and Add Button) */}
        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-6">
          
          {/* Title Area - Updated title and style */}
          <h1 className="text-3xl font-extrabold text-indigo-700">🧾 Product Categories</h1> 
          
          {/* Search and Add Button Area */}
          <div className="flex items-center gap-4">
            
            {/* Search Bar - Updated styling */}
            <input
              type="text"
              placeholder="Search categories..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="border p-2 w-64 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Add Button - Updated styling */}
            <button
              onClick={() => {
                setSelectedId(null);
                setName("");
                setDescription("");
                setOpenModal(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md transition duration-150"
            >
              + Add Category
            </button>
          </div>
        </div>

        {/* 2. TABLE CONTENT */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table wrapper updated to remove border-collapse and use the divide-y structure */}
          <table className="min-w-full"> 
            
            {/* Table Header - Updated background and text style */}
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider w-[10%]">SI NO</th>
                <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider w-[20%]">Category Name</th>
                <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider w-[50%]">Description</th>
                <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider w-[20%]">Action</th>
              </tr>
            </thead>

            {/* Table Body - Updated with dark divider lines */}
            <tbody className="bg-white divide-y  divide-gray-200">
              {currentCategories.length > 0 ? (
                currentCategories.map((cat, idx) => (
                  // Row styling updated for better hover effect
                  <tr key={cat.product_category_id} className="hover:bg-gray-50 transition duration-150">
                    {/* SI NO */}
                    <td className="py-3 px-4 text-center text-base text-gray-800">
                      {indexOfFirstItem + idx + 1}
                    </td>

                    {/* Category Name */}
                    <td className="py-3 px-4 text-center text-base text-gray-900">
                      {cat.product_category_name}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-base text-gray-800 text-left">
                      <div className="truncate">{cat.description}</div>
                    </td>

                    {/* ACTION BUTTONS (FaEdit and FaTrash Icons) */}
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        {/* Edit Icon Button */}
                        <button
                          onClick={() => {
                            setSelectedId(cat.product_category_id);
                            setName(cat.product_category_name);
                            setDescription(cat.description);
                            setOpenModal(true);
                          }}
                          // Using indigo color for edit
                          className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full transition duration-150"
                          title="Edit"
                        >
                          <FaEdit className="w-5 h-5"/>
                        </button>

                        {/* Delete Icon Button */}
                        <button
                          onClick={() => handleDelete(cat.product_category_id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-full transition duration-150"
                          title="Delete"
                        >
                          <FaTrash className="w-5 h-5"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-gray-500 font-semibold">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination - Updated styling */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-1 text-sm">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-blue-600 border-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Prev
                </button>
                
                {/* Current Page Number Display */}
                <span className="px-4 py-2 border bg-blue-600 text-white rounded-lg">
                  {currentPage}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === totalPages
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-blue-600 border-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Global Alert */}
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