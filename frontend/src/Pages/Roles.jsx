import React, { useState, useEffect } from "react";
import AlertModal from "../Modal/AlertModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../Api";

export default function Roles() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [roles, setRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
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
      const res = await api.get("/roles");
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
        await api.put(`/roles/${editingId}`, form);

        setModal({
          open: true,
          type: "success",
          title: "Updated",
          message: "Role updated successfully!",
        });
      } else {
        await api.post("/roles", form);

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
      await api.delete(`/roles/${deleteId}`);
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

  // -----------------------------
  // SEARCH + PAGINATION LOGIC
  // -----------------------------
  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice(
    (currentPage*pageSize) - pageSize,
    currentPage * pageSize
  );
  useEffect(() => {
  if (currentPage > 1 && paginated.length === 0) {
    setCurrentPage(currentPage - 1);
  }
}, [roles, filtered, paginated]);
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl rounded-lg shadow-lg p-6">
        {/* Heading + Search Bar */}
        
        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-6">
          
          {/* Title Area - Updated title and style */}
          <h1 className="text-3xl font-extrabold text-indigo-700">👤 Roles</h1> 
          
          {/* Search and Add Button Area */}
          <div className="flex items-center gap-4">
            
            {/* Search Bar - Updated styling */}
            <input
              type="text"
              placeholder="Search role..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border p-2 w-64 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Add Button - Updated styling */}
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
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">          <table className="min-w-full text-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold tracking-wide">SI No</th>
                <th className="px-6 py-3 text-left font-semibold tracking-wide">
                  Role Name
                </th>
                <th className="px-6 py-3 text-left font-semibold tracking-wide">
                  Description
                </th>
                <th className="px-6 py-3 text-center font-semibold tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((role, index) => (
                  <tr key={role.id} className="hover:bg-gray-100 transition border-b border-gray-200">
                    <td className="px-6 py-3 text-center border-r border-gray-200">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-3 border-r border-gray-200">{role.name}</td>
                    <td className="px-6 py-3 border-r border-gray-200">{role.description}</td>
                    <td className="px-6 py-3 flex gap-2 justify-center">
                      <button
                        className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full transition duration-150"
                        title="Edit"
                        onClick={() => handleEdit(role)}
                      >
                        <FaEdit className="w-5 h-5"/>
                      </button>
                      <button
                        className="text-red-600 hover:bg-red-100 p-2 rounded-full transition duration-150"
                        title="Delete"
                        onClick={() => {
                          setDeleteId(role.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash className="w-5 h-5"/>
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

        {/* Pagination */}
        {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
            <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded disabled:opacity-50`}
            >
            Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
            <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                }`}
            >
                {i + 1}
            </button>
            ))}

            <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded disabled:opacity-50`}
            >
            Next
            </button>
        </div>
        )}
      </div>

      {/* ADD/EDIT FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 animate-fadeIn">

            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? "Update Role" : "Create Role"}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5">

              {/* Role Name */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter role name"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter description"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-full border bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow"
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
