// src/Pages/Materials.jsx
import { useEffect, useState } from "react";
import axios from "axios";

/* ---------- Custom Alert Icons & Component (same as before) ---------- */
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
/* ---------- End Alert ---------- */

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({ material_name: "", description: "" }); // add form state (for Add)
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: "", material_name: "", description: "" }); // separate edit state

  // alert state
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    actionToRun: null,
  });

  // validation state
  const [nameError, setNameError] = useState("");

  const closeAlert = () => setAlertState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });

  const handleAlertConfirm = async () => {
    if (alertState.type === "confirm" && alertState.actionToRun) {
      await alertState.actionToRun();
    } else {
      closeAlert();
    }
  };

  const normalize = (arr) => (arr || []).map((m) => ({ ...m, id: m.id ?? m.material_id ?? null }));

  const fetchMaterials = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/materials");
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
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addModal, editModal]);

  // ---------- Add ----------
  const handleAdd = async (e) => {
    e.preventDefault();

    const name = (formData.material_name || "").trim();
    // final validation
    if (!/^[A-Za-z ]+$/.test(name)) {
      setNameError("Name can contain only letters and spaces.");
      return;
    }
    setNameError("");

    try {
      await axios.post("http://127.0.0.1:8000/api/materials", {
        material_name: name,
        description: (formData.description || "").trim(),
      });
      await fetchMaterials();
      setAddModal(false);
      setFormData({ material_name: "", description: "" });
      setAlertState({ isOpen: true, title: "Added", message: "Material added successfully.", type: "success" });
    } catch (err) {
      setAlertState({ isOpen: true, title: "Add failed", message: err.response?.data?.message || err.message, type: "error" });
    }
  };

  // ---------- Delete ----------
  const deleteMaterial = (id) => {
    setAlertState({
      isOpen: true,
      title: "Are you sure?",
      message: "This will permanently delete the material.",
      type: "confirm",
      actionToRun: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/materials/${id}`);
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
    setNameError(""); // clear previous error
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

    try {
      await axios.put(`http://127.0.0.1:8000/api/materials/${editData.id}`, {
        material_name: name,
        description: (editData.description || "").trim(),
      });
      await fetchMaterials();
      setEditModal(false);
      setAlertState({ isOpen: true, title: "Updated", message: "Material updated successfully.", type: "success" });
    } catch (err) {
      setAlertState({ isOpen: true, title: "Update failed", message: err.response?.data?.message || err.message, type: "error" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setAddModal(false);
      setEditModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center p-6">
          <h2 className="text-2xl sm:text-2xl font-extrabold text-gray-800">Materials</h2>

          {/* Primary action styled like Salary view */}
          <button
            onClick={() => {
              setFormData({ material_name: "", description: "" });
              setNameError("");
              setAddModal(true);
            }}
            className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold"
          >
            + Add Material
          </button>
        </div>

        <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200">
          {materials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200 table-fixed">
                <thead className="bg-blue-600 text-white uppercase tracking-wider">
                  <tr>
                    <th className="w-16 p-4 text-center font-bold rounded-tl-xl">SL</th>
                    <th className="p-4 text-left font-bold">Name</th>
                    <th className="p-4 text-left font-bold">Description</th>
                    <th className="w-40 p-4 text-center font-bold rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {materials.map((v, index) => (
                    <tr key={v.id} className={`transition duration-150 ease-in-out ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}>
                      <td className="p-4 text-center font-medium text-gray-700">{index + 1}</td>
                      <td className="p-4 font-medium text-gray-700 text-left break-words">{v.material_name || "\u00A0"}</td>
                      <td className="p-4 text-gray-600 text-left break-words">{v.description || "\u00A0"}</td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => openEdit(v)} className="p-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition duration-200 transform hover:scale-105" title="Edit">
                            Edit
                          </button>
                          <button onClick={() => deleteMaterial(v.id)} className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200 transform hover:scale-105" title="Delete">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No materials found. Click 'Add Material' to create the first entry.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {(addModal || editModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-opacity-30 p-4" onKeyDown={handleKeyDown}>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-transform duration-300 scale-100">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="text-2xl font-bold text-gray-800">{addModal ? "Add Material" : "Edit Material"}</h3>
              <button
                type="button"
                onClick={() => {
                  setAddModal(false);
                  setEditModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition duration-150"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Form */}
            {addModal ? (
              <form onSubmit={handleAdd} className="space-y-4">
                {/* Name (letters + spaces only) */}
                <div>
                  <label className="sr-only">Name</label>
                  <input
                    type="text"
                    placeholder="Name (letters & spaces only)"
                    value={formData.material_name}
                    onChange={(e) => {
                      // sanitize: allow only letters and spaces
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
                  <button type="button" onClick={() => { setAddModal(false); setFormData({ material_name: "", description: "" }); setNameError(""); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]">
                    Add
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={updateMaterial} className="space-y-4">
                {/* Name (letters + spaces only) */}
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
                  <button type="button" onClick={() => { setEditModal(false); setEditData({ id: "", material_name: "", description: "" }); setNameError(""); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]">
                    Update
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Global Custom Alert */}
      <CustomAlert isOpen={alertState.isOpen} title={alertState.title} message={alertState.message} type={alertState.type} onConfirm={handleAlertConfirm} onClose={closeAlert} />
    </div>
  );
}
