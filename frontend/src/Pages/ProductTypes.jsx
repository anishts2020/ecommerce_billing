import { useState, useEffect } from "react";
import axios from "axios";
// Importing FaEdit and FaTrash for action buttons
import { FaEdit, FaTrash } from "react-icons/fa"; 

// === ICON COMPONENTS (Keeping the utility icons for AlertModal) ===

// SVG Icons (same as your ProductCategories file)
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

// GLOBAL ALERT COMPONENT (Remains untouched)
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, borderColor, buttonColor, confirmText;

  switch (type) {
    case "confirm":
    case "delete-confirm": 
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
// PRODUCT TYPES MAIN COMPONENT
// ---------------------------------------------------------
export default function ProductTypes() {
  const [types, setTypes] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [product_type_name, setName] = useState("");
  const [description, setDescription] = useState("");


  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Global alert
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    actionToRun: null,
  });

  const closeAlert = () =>
    setAlertState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });

  const handleAlertConfirm = () => {
    if (alertState.type === "delete-confirm" && alertState.actionToRun) {
      alertState.actionToRun();
    }
    closeAlert(); 
  };

  // Fetch product types
  const fetchTypes = () => {
    axios
      .get("http://localhost:8000/api/product-types")
      .then((res) => setTypes(res.data))
      .catch(() =>
        setAlertState({
          isOpen: true,
          title: "Error",
          message: "Failed to load product types",
          type: "error",
        })
      );
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // ---------------------------------------------------------
  // SAVE
  // ---------------------------------------------------------
  const handleSave = () => {
    const baseData = { product_type_name, description };

    if (selectedId) {
        const existingType = types.find(t => t.product_type_id === selectedId);
        const updateData = {
          ...baseData,
          is_active: existingType ? existingType.is_active : true, 
        };

        axios
          .put(`http://localhost:8000/api/product-types/${selectedId}`, updateData)
          .then(() => {
            fetchTypes();
            setOpenModal(false);
            setName("");
            setDescription("");
            setSelectedId(null);

            setAlertState({
              isOpen: true,
              title: "Updated!",
              message: "Product type updated successfully",
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
        const addData = {
            ...baseData,
            is_active: true, 
        };

        axios
          .post("http://localhost:8000/api/product-types", addData)
          .then(() => {
            fetchTypes();
            setOpenModal(false);
            setName("");
            setDescription("");

            setAlertState({
              isOpen: true,
              title: "Success",
              message: "Product type added successfully",
              type: "success",
            });
          })
          .catch(() =>
            setAlertState({
              isOpen: true,
              title: "Error",
              message: "Could not add product type",
              type: "error",
            })
          );
    }
  };

  // ---------------------------------------------------------
  // DELETE 
  // ---------------------------------------------------------
  const deleteProductType = (id) => {
    axios
        .delete(`http://localhost:8000/api/product-types/${id}`)
        .then(() => {
            fetchTypes();
            setAlertState({
                isOpen: true,
                title: "Deleted!",
                message: "Product type deleted successfully",
                type: "success",
            });
        })
        .catch(() => {
            setAlertState({
                isOpen: true,
                title: "Error",
                message: "Failed to delete product type. It may be in use.",
                type: "error",
            });
        });
  };

  const handleDelete = (id) => {
    setAlertState({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this product type?",
      type: "delete-confirm",
      actionToRun: () => deleteProductType(id), 
    });
  };

  // ---------------------------------------------------------
  // SEARCH + PAGINATION
  // ---------------------------------------------------------
  const filtered = types.filter((t) =>
    t.product_type_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);

  // ---------------------------------------------------------
  // RENDER 
  // ---------------------------------------------------------
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
            {/* Close Button */}
            <button className="absolute top-3 right-3 text-xl font-bold text-gray-400 hover:text-gray-600" onClick={() => setOpenModal(false)}>×</button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              {selectedId ? "Edit Product Type" : "Add Product Type"}
            </h2>

            <input
              type="text"
              placeholder="Product Type Name"
              value={product_type_name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2.5 w-full mb-4 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2.5 w-full rounded-lg h-24 focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="flex justify-end gap-3 mt-4">
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
          
          {/* Title Area */}
          <h1 className="text-3xl font-extrabold text-indigo-700">🧾 Product Types</h1> 
          

          {/* Search and Add Button Area */}
          <div className="flex items-center gap-4">
            
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search product types..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="border p-2 w-64 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Add Button */}
            <button
              onClick={() => {
                setSelectedId(null);
                setName("");
                setDescription("");
                setOpenModal(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Product Type
            </button>
          </div>
        </div>

        {/* 2. TABLE CONTENT */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            
            {/* Table Header */}
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider w-[10%]">SI NO</th>
                <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider w-[20%]">Product Type</th>
                <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider w-[50%]">Description</th>
                <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider w-[20%]">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {current.length > 0 ? (
                current.map((pt, idx) => (
                  <tr key={pt.product_type_id} className="hover:bg-gray-50 transition duration-150">
                    {/* SI NO */}
                    <td className="py-3 px-4 text-center text-base text-gray-800">
                      {indexOfFirst + idx + 1}
                    </td>

                    {/* Product Type (Removed font-semibold class) */}
                    <td className="py-3 px-4 text-center text-base text-gray-900">
                      {pt.product_type_name}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-base text-gray-800 text-left">
                      <div className="truncate">{pt.description}</div>
                    </td>

                    {/* ACTION BUTTONS (FaEdit and FaTrash Icons) */}
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        {/* Edit Icon Button */}
                        <button
                          onClick={() => {
                            setSelectedId(pt.product_type_id);
                            setName(pt.product_type_name);
                            setDescription(pt.description);
                            setOpenModal(true);
                          }}
                          // Using indigo color for edit, consistent with CreateUser
                          className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full transition duration-150"
                          title="Edit"
                        >
                          <FaEdit className="w-5 h-5"/>
                        </button>

                        {/* Delete Icon Button */}
                        <button
                          onClick={() => handleDelete(pt.product_type_id)}
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
                    No product types found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-1 text-sm">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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