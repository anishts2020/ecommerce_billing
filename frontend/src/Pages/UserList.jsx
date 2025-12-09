import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AlertModal from "./AlertModal";
import api from "../Api";

function UserList({ reload }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  // Pagination logic
  const filteredUsers = users.filter((u) =>
    u.user_name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const startEdit = (user) => {
    setEditingUser(user);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`);
      setDeleteId(null);
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-4">

      {/* Search + Add Button Row */}
      <div className="flex justify-between items-center mb-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search user..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ADD USER BUTTON */}
        <button
          onClick={() => setEditingUser({})}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4">{user.user_name}</td>
              <td className="py-2 px-4">{user.user_email}</td>
              <td className="py-2 px-4">{user.role_name}</td>

              <td className="py-2 px-4 flex gap-3">
  {/* EDIT ICON */}
  <button
    onClick={() => startEdit(user)}
    className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full"
    title="Edit"
  >
    <FaEdit size={18} />
  </button>

  {/* DELETE ICON */}
  <button
    onClick={() => confirmDelete(user.id)}
    className="text-red-600 hover:bg-red-100 p-2 rounded-full"
    title="Delete"
  >
    <FaTrash size={18} />
  </button>
</td>



            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from(
          { length: Math.ceil(filteredUsers.length / perPage) },
          (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      <AlertModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

    </div>
  );
}

export default UserList;
