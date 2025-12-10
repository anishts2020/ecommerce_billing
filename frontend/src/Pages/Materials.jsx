// src/Pages/Materials.jsx
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../Api";

// ICONS (kept as svg for alert modal)
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

// GLOBAL ALERT COMPONENT
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

// MAIN COMPONENT
export default function Materials() {
  // data + UI state
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({ material_name: "", description: "" });
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: "", material_name: "", description: "" });

  // validation + alerts
  const [nameError, setNameError] = useState("");
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    actionToRun: null,
  });

  // search + pagination (styling borrowed from ProductCategories)
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const closeAlert = () =>
    setAlertState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });

  const handleAlertConfirm = async () => {
    if ((alertState.type === "confirm" || alertState.type === "delete-confirm") && alertState.actionToRun) {
      await alertState.actionToRun();
    }
    closeAlert();
  };

  // ensure consistent id/name fields
  const normalize = (arr) =>
    (arr || []).map((m) => {
      const name = (m.material_name ?? "").toString().trim();
      return { ...m, id: m.id ?? m.material_id ?? null, material_name: name, description: (m.description ?? "").toString().trim() };
    });

  // fetch
  const fetchMaterials = async () => {
    try {
      const res = await api.get("/materials");
      setMaterials(normalize(res.data));
    } catch (err) {
      setAlertState({ isOpen: true, title: "Load failed", message: err.response?.data?.message || err.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = addModal || editModal ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [addModal, editModal]);

  // ---------- Add ----------
  const handleAdd = async (e) => {
    e.preventDefault();

    const name = (formData.material_name || "").trim();
    if (!/^[A-Za-z ]+$/.test(name)) {
      setNameError("Name can contain only letters and spaces.");
      return;
    }
    setNameError("");

    // duplicate check
    const exists = materials.some((m) => (m.material_name || "").toLowerCase() === name.toLowerCase());
    if (exists) {
      setAlertState({ isOpen: true, title: "Already exists", message: "A material with that name already exists.", type: "error" });
      return;
    }

    try {
      await api.post("/materials", {
        material_name: name,
        description: (formData.description || "").trim(),
      });
      await fetchMaterials();
      setAddModal(false);
      setFormData({ material_name: "", description: "" });
      setAlertState({ isOpen: true, title: "Added", message: "Material added successfully.", type: "success" });
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.response?.data?.error;
      if (err.response?.status === 409 || /duplicate|unique/i.test(backendMsg || "")) {
        setAlertState({ isOpen: true, title: "Already exists", message: backendMsg || "A material with that name already exists.", type: "error" });
      } else {
        setAlertState({ isOpen: true, title: "Add failed", message: backendMsg || err.message, type: "error" });
      }
    }
  };

  // ---------- Delete ----------
  const deleteMaterial = (id) => {
    setAlertState({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this material permanently?",
      type: "delete-confirm",
      actionToRun: async () => {
        try {
          await api.delete(`/materials/${id}`);
          await fetchMaterials();
          setAlertState({ isOpen: true, title: "Deleted", message: "Material deleted successfully.", type: "success" });
        } catch (err) {
          setAlertState({ isOpen: true, title: "Delete failed", message: err.response?.data?.message || err.message, type: "error" });
        }
      },
    });
  };

  // ---------- Edit ----------
  const openEdit = (v) => {
    setEditData({ id: v.id ?? v.material_id, material_name: v.material_name ?? "", description: v.description ?? "" });
    setNameError("");
    setEditModal(true);
  };

  const updateMaterial = async (e) => {
    e.preventDefault();

    const name = (editData.material_name || "").trim();
    if (!/^[A-Za-z ]+$/.test(name)) {
      setNameError("Name can contain only letters and spaces.");
      return;
    }
    setNameError("");

    // duplicate check excluding current item
    const exists = materials.some((m) => {
      const mid = m.id ?? m.material_id;
      return mid !== editData.id && (m.material_name || "").toLowerCase() === name.toLowerCase();
    });
    if (exists) {
      setAlertState({ isOpen: true, title: "Already exists", message: "Another material with that name already exists.", type: "error" });
      return;
    }

    try {
      await api.put(`/materials/${editData.id}`, {
        material_name: name,
        description: (editData.description || "").trim(),
      });
      await fetchMaterials();
      setEditModal(false);
      setAlertState({ isOpen: true, title: "Updated", message: "Material updated successfully.", type: "success" });
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.response?.data?.error;
      if (err.response?.status === 409 || /duplicate|unique/i.test(backendMsg || "")) {
        setAlertState({ isOpen: true, title: "Already exists", message: backendMsg || "Another material with that name already exists.", type: "error" });
      } else {
        setAlertState({ isOpen: true, title: "Update failed", message: backendMsg || err.message, type: "error" });
      }
    }
  };

  // keyboard escape to close modals
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setAddModal(false);
      setEditModal(false);
    }
  };

  // ---------- SEARCH + PAGINATION ----------
  const filteredMaterials = materials.filter((m) =>
    (m.material_name || "").toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    else if (totalPages === 0) setCurrentPage(1);
  }, [totalPages, currentPage]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  // ---------- RENDER ----------
  return (
    <div className="p-8 bg-gray-100 min-h-screen" onKeyDown={handleKeyDown}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">🧾 Materials</h1>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
              className="border p-2 w-64 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={() => {
                setFormData({ material_name: "", description: "" });
                setNameError("");
                setAddModal(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md transition duration-150"
            >
              + Add Material
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider w-[10%]">SI NO</th>
                <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider w-[35%]">Name</th>
                <th className="py-3 px-4 text-left text-sm font-bold uppercase tracking-wider w-[40%]">Description</th>
                <th className="py-3 px-4 text-center text-sm font-bold uppercase tracking-wider w-[15%]">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentMaterials.length > 0 ? (
                currentMaterials.map((v, idx) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="py-3 px-4 text-center text-base text-gray-800">
                      {indexOfFirstItem + idx + 1}
                    </td>

                    <td className="py-3 px-4 text-base text-gray-900 text-left break-words">
                      {v.material_name || "\u00A0"}
                    </td>

                    <td className="py-3 px-4 text-base text-gray-800 text-left break-words">
                      <div className="truncate">{v.description || "\u00A0"}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => openEdit(v)}
                          className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full transition duration-150"
                          title="Edit"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteMaterial(v.id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-full transition duration-150"
                          title="Delete"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500 font-semibold">
                    No materials found
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
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-blue-600 border-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Prev
                </button>

                <span className="px-4 py-2 border bg-blue-600 text-white rounded-lg">
                  {currentPage}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === totalPages ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-blue-600 border-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal (Add / Edit) */}
      {(addModal || editModal) && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <button
              className="absolute top-3 right-3 text-xl font-bold text-gray-400 hover:text-gray-600"
              onClick={() => {
                setAddModal(false);
                setEditModal(false);
                setEditData({ id: "", material_name: "", description: "" });
                setFormData({ material_name: "", description: "" });
                setNameError("");
              }}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              {addModal ? "Add Material" : "Edit Material"}
            </h2>

            {addModal ? (
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="sr-only">Name</label>
                  <input
                    type="text"
                    placeholder="Name (letters & spaces only)"
                    value={formData.material_name}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^A-Za-z ]+/g, "");
                      setFormData((prev) => ({ ...prev, material_name: sanitized }));
                      setNameError(sanitized.trim() === "" ? "Name is required" : "");
                    }}
                    className={`mt-1 block w-full p-2 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${nameError ? "border-red-500" : "border-gray-300"}`}
                    required
                    autoFocus
                  />
                  {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
                </div>

                <div>
                  <label className="sr-only">Description</label>
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t">
                  <button
                    type="button"
                    onClick={() => { setAddModal(false); setFormData({ material_name: "", description: "" }); setNameError(""); }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]"
                  >
                    Add
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={updateMaterial} className="space-y-4">
                <div>
                  <label className="sr-only">Name</label>
                  <input
                    type="text"
                    placeholder="Name (letters & spaces only)"
                    value={editData.material_name}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^A-Za-z ]+/g, "");
                      setEditData((prev) => ({ ...prev, material_name: sanitized }));
                      setNameError(sanitized.trim() === "" ? "Name is required" : "");
                    }}
                    className={`mt-1 block w-full p-2 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${nameError ? "border-red-500" : "border-gray-300"}`}
                    required
                    autoFocus
                  />
                  {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
                </div>

                <div>
                  <label className="sr-only">Description</label>
                  <textarea
                    placeholder="Description"
                    value={editData.description}
                    onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t">
                  <button
                    type="button"
                    onClick={() => { setEditModal(false); setEditData({ id: "", material_name: "", description: "" }); setNameError(""); }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]"
                  >
                    Update
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
