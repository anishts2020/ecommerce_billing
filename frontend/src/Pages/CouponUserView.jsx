// src/Pages/CouponUserView.jsx
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../Api";

/* ---------- ICONS (SVG alert / confirm / success / error) ---------- */
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

/* ---------- Custom Alert Component ---------- */
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

/* ---------- Main Component ---------- */
export default function CouponUserView() {
  const [couponUsers, setCouponUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    coupon_master_id: "",
    user_id: "",
    usage_count: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    actionToRun: null,
  });

  const [editId, setEditId] = useState(null);

  const [searchText, setSearchText] = useState("");

  // ========== Pagination state ==========
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const closeAlert = () =>
    setAlertState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });

  // UPDATED handleAlertConfirm — runs actionToRun (if present) and DOES NOT auto-close afterward.
  const handleAlertConfirm = async () => {
    // If this is a confirm/delete-confirm and there is an action, run it.
    // Do NOT auto-close afterward so the actionToRun can show a success/error alert that remains visible.
    if ((alertState.type === "confirm" || alertState.type === "delete-confirm") && alertState.actionToRun) {
      // Capture and clear actionToRun to avoid accidental re-run
      const action = alertState.actionToRun;
      setAlertState((s) => ({ ...s, actionToRun: null }));
      try {
        await action();
      } catch (err) {
        // If action throws, show an error alert (safety net)
        setAlertState({
          isOpen: true,
          title: "Action failed",
          message: err?.response?.data?.message || err?.message || "Something went wrong.",
          type: "error",
          actionToRun: null,
        });
      }
      // Do not auto-close here — allow success/error alert from action to be visible.
      return;
    }

    // For non-confirm alerts (e.g. success / error with no action), just close when confirm clicked
    closeAlert();
  };

  const fetchCouponUsers = async () => {
    try {
      const res = await api.get("/coupon-users");
      setCouponUsers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      setAlertState({
        isOpen: true,
        title: "Load failed",
        message: err.response?.data?.message || err.message,
        type: "error",
        actionToRun: null,
      });
    }
  };

  useEffect(() => {
    api.get("/coupons")
      .then((res) => setCoupons(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => {});
    api.get("/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => {});

    fetchCouponUsers();
  }, []);

  // ---- Add new coupon user ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/coupon-users", form);
      await fetchCouponUsers();
      setForm({ coupon_master_id: "", user_id: "", usage_count: "" });
      setIsAddModalOpen(false);
      setAlertState({ isOpen: true, title: "Added", message: "Coupon user added successfully.", type: "success", actionToRun: null });
    } catch (err) {
      setAlertState({ isOpen: true, title: "Add failed", message: err.response?.data?.message || err.message, type: "error", actionToRun: null });
    }
  };

  // ---- Edit existing coupon user ----
  const handleEdit = (row) => {
    setEditId(row.coupon_user_id);
    // store IDs as strings to match option values below
    setForm({
      coupon_master_id: String(row.coupon_master_id ?? ""),
      user_id: String(row.user_id ?? ""),
      usage_count: row.usage_count ?? "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/coupon-users/${editId}`, form);
      await fetchCouponUsers();
      setIsEditModalOpen(false);
      setAlertState({ isOpen: true, title: "Updated", message: "Coupon user updated successfully.", type: "success", actionToRun: null });
    } catch (err) {
      setAlertState({ isOpen: true, title: "Update failed", message: err.response?.data?.message || err.message, type: "error", actionToRun: null });
    }
  };

  // ---- Delete coupon user with confirmation ----
  const handleDelete = (id) => {
    setAlertState({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this coupon user?",
      type: "delete-confirm",
      actionToRun: async () => {
        try {
          await api.delete(`/coupon-users/${id}`);
          await fetchCouponUsers();
          // Show success alert (this will remain visible until user closes it)
          setAlertState({ isOpen: true, title: "Deleted", message: "Coupon user deleted successfully.", type: "success", actionToRun: null });
        } catch (err) {
          setAlertState({ isOpen: true, title: "Delete failed", message: err.response?.data?.message || err.message, type: "error", actionToRun: null });
        }
      },
    });
  };

  // --- Filtering + Pagination logic ---
  const filtered = couponUsers.filter((row) =>
    (`${row.coupon_code ?? ""} ${row.name ?? ""} ${row.usage_count ?? ""}`)
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentList = filtered.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">🎟️ Coupon Users</h1>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Search coupon users..."
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
              className="border p-2 w-64 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => {
                setForm({ coupon_master_id: "", user_id: "", usage_count: "" });
                setIsAddModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
            >
              + Add Coupon User
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 text-center">SI NO</th>
                <th className="py-3 text-center">Coupon Code</th>
                <th className="py-3 text-center">User Name</th>
                <th className="py-3 text-center">Usage Count</th>
                <th className="py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentList.length > 0 ? (
                currentList.map((row, idx) => (
                  <tr key={row.coupon_user_id} className="hover:bg-gray-50">
                    <td className="py-3 text-center">{indexOfFirst + idx + 1}</td>
                    <td className="py-3 text-center">{row.coupon_code}</td>
                    <td className="py-3 text-center">{row.name}</td>
                    <td className="py-3 text-center">{row.usage_count}</td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => handleEdit(row)}
                          className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full">
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(row.coupon_user_id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-full">
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-gray-500">
                    No coupon users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-1 text-sm">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-blue-600 border-blue-600 hover:bg-blue-50"
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
                className={`px-4 py-2 rounded-lg border ${currentPage === totalPages
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl w-full max-w-md shadow-2xl z-50">
            <button
              className="absolute top-3 right-3 text-xl font-bold text-gray-400 hover:text-gray-600"
              onClick={() => setIsAddModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              Add Coupon User
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-medium">Select Coupon</label>
                <select className="border p-2 w-full rounded mb-3"
                  value={form.coupon_master_id}
                  onChange={(e) => setForm({ ...form, coupon_master_id: e.target.value })}
                  required>
                  <option value="">-- Select Coupon --</option>
                  {coupons.map((c) => (
                    <option key={c.coupon_master_id} value={String(c.coupon_master_id)}>
                      {c.coupon_code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-medium">Select User</label>
                <select className="border p-2 w-full rounded mb-3"
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                  required>
                  <option value="">-- Select User --</option>
                  {users.map((u) => (
                    <option key={u.id} value={String(u.id)}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-medium">Usage Count</label>
                <input type="number" className="border p-2 w-full rounded mb-4"
                  value={form.usage_count}
                  onChange={(e) => setForm({ ...form, usage_count: e.target.value })}
                  required />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
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
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl w-full max-w-md shadow-2xl z-50">
            <button
              className="absolute top-3 right-3 text-xl font-bold text-gray-400 hover:text-gray-600"
              onClick={() => setIsEditModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              Edit Coupon User
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="font-medium">Select Coupon</label>
                <select className="border p-2 w-full rounded mb-3"
                  value={form.coupon_master_id}
                  onChange={(e) => setForm({ ...form, coupon_master_id: e.target.value })}
                >
                  <option value="">-- Select Coupon --</option>
                  {coupons.map((c) => (
                    <option key={c.coupon_master_id} value={String(c.coupon_master_id)}>
                      {c.coupon_code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-medium">Select User</label>
                <select className="border p-2 w-full rounded mb-3"
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                >
                  <option value="">-- Select User --</option>
                  {users.map((u) => (
                    <option key={u.id} value={String(u.id)}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-medium">Usage Count</label>
                <input type="number" className="border p-2 w-full rounded mb-4"
                  value={form.usage_count}
                  onChange={(e) => setForm({ ...form, usage_count: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
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
          </div>
        </div>
      )}

      {/* Global Alert / Delete Confirm */}
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
