import { useEffect, useState } from "react";
import axios from "axios";
import AlertModal from "./AlertModal";

function UserList({ reload }) {
  const [users, setUsers] = useState([]);
  const [loading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

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
    setAlert({
      open: true,
      type,
      title,
      message,
    });
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);  // 🔥 refresh table when reload changes

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
    } catch (err) {
      showAlert("error", "Failed", "Unable to delete user!");
    } finally {
      setDeleteId(null);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user.id);
    setForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
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
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Users List
      </h1>

      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Mobile</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{user.id}</td>
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
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Update User</h2>

            <form onSubmit={updateUser} className="space-y-4">
              <input
                type="text"
                className="border p-3 w-full rounded"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Name"
              />

              <input
                type="email"
                className="border p-3 w-full rounded"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Email"
              />

              <input
                type="text"
                maxLength={10}
                className="border p-3 w-full rounded"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
                placeholder="Mobile"
              />

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
