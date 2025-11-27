import React, { useState, useEffect } from "react";
import axios from "axios";
import AlertModal from "../Modal/AlertModal";

function UserRoles() {
  const [userRoles, setUserRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({ user_id: "", role_id: "" });
  const [editingId, setEditingId] = useState(null);

  const [formModalOpen, setFormModalOpen] = useState(false);

  // ALERT MODAL CONTROL
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "",
  });

  const openAlert = (type, title, message, onConfirm = null) => {
    setAlert({ isOpen: true, type, title, message, onConfirm });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [urRes, uRes, rRes] = await Promise.all([
        axios.get("http://localhost:8000/api/user-role"),
        axios.get("http://localhost:8000/api/users"),
        axios.get("http://localhost:8000/api/roles"),
      ]);
      setUserRoles(urRes.data);
      setUsers(uRes.data);
      setRoles(rRes.data);
    } catch (err) {
      openAlert("error", "Error", "Failed to load data");
    }
  };

  const isDuplicateEntry = () =>
    userRoles.some(
      (ur) =>
        String(ur.user?.id) === String(formData.user_id) &&
        String(ur.role?.id) === String(formData.role_id) &&
        ur.id !== editingId
    );

  const openFormModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        user_id: item.user?.id ?? "",
        role_id: item.role?.id ?? "",
      });
    } else {
      setEditingId(null);
      setFormData({ user_id: "", role_id: "" });
    }
    setFormModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user_id) {
      openAlert("error", "Validation Failed", "Please select a User");
      return;
    }

    if (!formData.role_id) {
      openAlert("error", "Validation Failed", "Please select a Role");
      return;
    }
    // Duplicate validation popup
    if (isDuplicateEntry()) {
      openAlert(
        "error",
        "Failed",
        "User is already assigned with this role"
      );
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/user-role/${editingId}`,
          formData
        );
        openAlert("success", "Success", "User Role updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/user-role", formData);
        openAlert("success", "Success", "Role assigned to user successfully!");
      }

      setFormModalOpen(false);
      setEditingId(null);
      setFormData({ user_id: "", role_id: "" });
      fetchAll();
    } catch (error) {
      openAlert("error", "Error", "Failed to save record");
    }
  };

  const handleDelete = (id) => {
    openAlert(
      "delete-confirm",
      "Are you sure?",
      "This user role will be permanently deleted?",
      () => confirmDelete(id)
    );
  };


  const confirmDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/user-role/${id}`);
      openAlert("success", "Deleted", "Record deleted successfully");
      fetchAll();
    } catch (err) {
      openAlert("error", "Failed", "Failed to delete record");
    }
  };


  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">

        <h2 className="text-2xl font-bold text-center mb-4">User Roles</h2>

        {/* CENTER CREATE BUTTON */}
        <div className="flex justify-center mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => openFormModal()}
          >
            Assign Role
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.map((item) => (
                <tr key={item.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">{item.user?.name ?? "N/A"}</td>
                  <td className="border p-2">{item.role?.name ?? "N/A"}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => openFormModal(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {userRoles.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL */}
      {formModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[360px]">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? "Edit User Role" : "Create User Role"}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <select
                value={formData.user_id}
                onChange={(e) =>
                  setFormData({ ...formData, user_id: e.target.value })
                }
                className="border p-2 rounded"
                required
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.role_id}
                onChange={(e) =>
                  setFormData({ ...formData, role_id: e.target.value })
                }
                className="border p-2 rounded"
                required
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                  onClick={() => {
                    setFormModalOpen(false);
                    setEditingId(null);
                    setFormData({ user_id: "", role_id: "" });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALERT POPUP */}
      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={alert.onConfirm}
      />
    </div>
  );
}

export default UserRoles;
