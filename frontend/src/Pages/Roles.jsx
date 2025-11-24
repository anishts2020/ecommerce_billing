import React, { useState, useEffect } from "react";
import axios from "axios";
import AlertModal from "../Modal/AlertModal";

export default function Roles() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [roles, setRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Alert Modal State
  const [modal, setModal] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });

  // Delete confirm modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/roles");
      setRoles(res.data);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isDuplicate = () =>
    roles.some(
      (r) => r.name.toLowerCase() === form.name.toLowerCase() && r.id !== editingId
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDuplicate()) {
      setModal({
        open: true,
        type: "error",
        title: "Failed",
        message: "Role name already exists!",
      });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/roles/${editingId}`, form);

        setModal({
          open: true,
          type: "success",
          title: "Updated",
          message: "Role updated successfully!",
        });
      } else {
        await axios.post("http://localhost:8000/api/roles", form);

        setModal({
          open: true,
          type: "success",
          title: "Created",
          message: "Role created successfully!",
        });
      }

      setForm({ name: "", description: "" });
      setEditingId(null);
      setShowModal(false);
      fetchRoles();
    } catch (error) {
      setModal({
        open: true,
        type: "error",
        title: "Failed",
        message: "Error saving role",
      });
    }
  };
  const handleEdit = (role) => {
    setForm({ name: role.name, description: role.description });
    setEditingId(role.id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/roles/${deleteId}`);
      setShowDeleteModal(false);

      setModal({
        open: true,
        type: "success",
        title: "Deleted",
        message: "Role deleted successfully!",
      });

      fetchRoles();
    } catch (error) {
      setModal({
        open: true,
        type: "error",
        title: "Failed",
        message: "Error deleting role",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">

        <h1 className="text-3xl font-bold text-center mb-6">Manage Roles</h1>

        <div className="flex justify-center mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setForm({ name: "", description: "" });
              setEditingId(null);
              setShowModal(true);
            }}
          >
            Add Role
          </button>
        </div>

        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Role Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-100 transition">
                  <td className="border p-2 text-center">{role.id}</td>
                  <td className="border p-2">{role.name}</td>
                  <td className="border p-2">{role.description}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(role)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => {
                        setDeleteId(role.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-3 text-gray-500 border" colSpan="4">
                  No roles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD/EDIT FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-bold text-center mb-4">
              {editingId ? "Update Role" : "Create Role"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Role Name"
                className="w-full p-2 mb-3 border rounded"
                required
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter Description"
                className="w-full p-2 mb-4 border rounded"
                required
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  className="w-full bg-gray-500 text-white py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          type="delete-confirm"
          title="Are you sure?"
          message="This role will be permanently deleted."
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* ALERT MESSAGE MODAL */}
      {modal.open && (
        <AlertModal
          isOpen={modal.open}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal({ ...modal, open: false })}
        />
      )}
    </div>
  );
}
