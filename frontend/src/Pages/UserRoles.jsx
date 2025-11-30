import React, { useState, useEffect } from "react";
import axios from "axios";
import AlertModal from "../Modal/AlertModal";

function UserRoles() {
  const [userRoles, setUserRoles] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const paginatedData = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const [formData, setFormData] = useState({ user_id: "", role_id: "" });
  const [editingId, setEditingId] = useState(null);

  const [formModalOpen, setFormModalOpen] = useState(false);

  // Alert
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

  useEffect(() => {
    handleSearch();
  }, [search, userRoles]);

  const fetchAll = async () => {
    try {
      const [urRes, uRes, rRes] = await Promise.all([
        axios.get("http://localhost:8000/api/user-role"),
        axios.get("http://localhost:8000/api/users"),
        axios.get("http://localhost:8000/api/roles"),
      ]);
      setUserRoles(urRes.data);
      setFiltered(urRes.data);
      setUsers(uRes.data);
      setRoles(rRes.data);
    } catch (err) {
      openAlert("error", "Error", "Failed to load data");
    }
  };

  const handleSearch = () => {
    const s = search.toLowerCase();
    setFiltered(
      userRoles.filter(
        (item) =>
          item.user?.name.toLowerCase().includes(s) ||
          item.role?.name.toLowerCase().includes(s)
      )
    );
    setCurrentPage(1);
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

    if (!formData.user_id)
      return openAlert("error", "Validation Failed", "Please select a User");

    if (!formData.role_id)
      return openAlert("error", "Validation Failed", "Please select a Role");

    if (isDuplicateEntry())
      return openAlert("error", "Failed", "User is already assigned with this role");

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/user-role/${editingId}`,
          formData
        );
        openAlert("success", "Success", "User role updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/user-role", formData);
        openAlert("success", "Success", "Role assigned successfully!");
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

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Roles</h2>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
                <th className="border p-2">SI No</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">
                    {(currentPage - 1) * pageSize + (index + 1)}
                  </td>
                  <td className="border p-2">{item.user?.name}</td>
                  <td className="border p-2">{item.role?.name}</td>
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

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
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
