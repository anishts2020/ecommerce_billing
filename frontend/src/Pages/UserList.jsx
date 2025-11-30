import { useEffect, useState } from "react";
import axios from "axios";
import AlertModal from "./AlertModal";

function UserList({ reload }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });

  const showAlert = (type, title, message) => {
    setAlert({ open: true, type, title, message });
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  // ✅ Filter safely
  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      (u.name?.toLowerCase() || "").includes(s) ||
      (u.email?.toLowerCase() || "").includes(s) ||
      (u.mobile?.toString() || "").includes(s)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(start, start + itemsPerPage);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setAlert({
      open: true,
      type: "delete-confirm",
      title: "Are you sure?",
      message: "This user will be permanently deleted.",
    });
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${deleteId}`);
      setUsers(users.filter((u) => u.id !== deleteId));
      showAlert("success", "Deleted", "User deleted successfully!");
    } catch {
      showAlert("error", "Failed", "Unable to delete user!");
    } finally {
      setDeleteId(null);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
    });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8000/api/users/${editingUser}`,
        form
      );
      setUsers(users.map((u) => (u.id === editingUser ? res.data : u)));
      setEditingUser(null);
      showAlert("success", "Updated", "User updated successfully!");
    } catch {
      showAlert("error", "Failed", "Unable to update user!");
    }
  };

  return (
    <div className="p-6">
      {/* Search */}
      <div className="my-4 flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="border p-2 w-56 rounded-xl shadow-sm "
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset to page 1 on search
          }}
        />
      </div>

      {/* Table */}
      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4">SI NO</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Mobile</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
  {paginatedUsers.length > 0 ? (
    paginatedUsers.map((user, index) => (
      <tr key={user.id} className="border-b hover:bg-gray-100">
        {/* Serial number */}
        <td className="py-2 px-4">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td className="py-2 px-4">{user.name}</td>
        <td className="py-2 px-4">{user.email}</td>
        <td className="py-2 px-4">{user.mobile}</td>
        <td className="py-2 px-4 flex gap-2">
          <button
            onClick={() => startEdit(user)}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => confirmDelete(user.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center py-4 text-gray-500 font-semibold">
        No users found
      </td>
    </tr>
  )}
</tbody>

      </table>

      {/* Pagination with numbers */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Update User</h2>
            <form onSubmit={updateUser} className="space-y-4">
              <input
                type="text"
                className="border p-3 w-full rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="email"
                className="border p-3 w-full rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="text"
                maxLength={10}
                className="border p-3 w-full rounded"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="Mobile"
              />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert */}
      <AlertModal
        isOpen={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
        onConfirm={alert.type === "delete-confirm" ? deleteUser : null}
      />
    </div>
  );
}

export default UserList;
