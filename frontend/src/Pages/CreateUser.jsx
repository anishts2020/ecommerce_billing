import { useEffect, useState } from "react";
import AlertModal from "./AlertModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../Api";


function CreateUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    user_pass: "",
    user_mobile: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [alert, setAlert] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });

  const [reload, setReload] = useState(false);

  const showAlert = (type, title, message) => {
    setAlert({ open: true, type, title, message });
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  // Filter users
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

  // CREATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!/^[A-Za-z\s]+$/.test(form.user_name)) {
      newErrors.user_name = ["Name cannot contain numbers or special characters"];
    }
    if (form.user_pass.length < 8) {
      newErrors.user_pass = ["Password must be at least 8 characters"];
    }
    if (!/^\d{10}$/.test(form.user_mobile)) {
      newErrors.user_mobile = ["Mobile number must be exactly 10 digits"];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post("/users", {
        name: form.user_name,
        email: form.user_email,
        password: form.user_pass,
        mobile: form.user_mobile,
      });
      showAlert("success", "Success", "User created successfully!");
      setReload(!reload);
      setForm({ user_name: "", user_email: "", user_pass: "", user_mobile: "" });
      setIsOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        showAlert("error", "Error", "Failed to save user!");
      }
    }
  };

  // DELETE USER
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
      await api.delete(`/users/${deleteId}`);
      setUsers(users.filter((u) => u.id !== deleteId));
      showAlert("success", "Deleted", "User deleted successfully!");
    } catch {
      showAlert("error", "Failed", "Unable to delete user!");
    } finally {
      setDeleteId(null);
    }
  };

  // EDIT USER
  const startEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
    });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(
        `/users/${editingUser}`,
        editForm
      );
      setUsers(users.map((u) => (u.id === editingUser ? res.data : u)));
      setEditingUser(null);
      showAlert("success", "Updated", "User updated successfully!");
    } catch {
      showAlert("error", "Failed", "Unable to update user!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER + Search + Add User */}
      <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-700">🧾 Users</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search users..."
            className="border p-2 w-64 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* USERS TABLE */}
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
                <td className="py-2 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.mobile}</td>
                <td className="py-2 px-4 flex gap-2">
  <button onClick={() => startEdit(user)} className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full">
    <FaEdit/>
  </button>
  <button onClick={() => confirmDelete(user.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-full">
    <FaTrash/>
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

      {/* Pagination */}
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
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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

      {/* CREATE USER MODAL */}
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8 relative">
            <button className="absolute top-3 right-3 text-xl font-bold" onClick={() => setIsOpen(false)}>×</button>
            <h1 className="text-2xl font-bold text-center mb-6">Create User</h1>
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              <input
                type="text"
                value={form.user_name}
                placeholder="Name"
                className="border rounded-lg p-3 w-full"
                onChange={(e) => setForm({ ...form, user_name: e.target.value })}
              />
              {errors.user_name && <span className="text-red-500 text-sm">{errors.user_name[0]}</span>}

              <input
                type="email"
                value={form.user_email}
                placeholder="Email"
                autoComplete="new-email"
                className="border rounded-lg p-3 w-full"
                onChange={(e) => setForm({ ...form, user_email: e.target.value })}
              />
              {errors.user_email && <span className="text-red-500 text-sm">{errors.user_email[0]}</span>}

              <input
                type="password"
                value={form.user_pass}
                placeholder="Password"
                autoComplete="new-password"
                className="border rounded-lg p-3 w-full"  
                onChange={(e) => setForm({ ...form, user_pass: e.target.value })}
              />
              {errors.user_pass && <span className="text-red-500 text-sm">{errors.user_pass[0]}</span>}

              <input
                type="text"
                value={form.user_mobile}
                placeholder="Mobile"
                maxLength={10}
                className="border rounded-lg p-3 w-full"
                onChange={(e) => setForm({ ...form, user_mobile: e.target.value })}
              />
              {errors.user_mobile && <span className="text-red-500 text-sm">{errors.user_mobile[0]}</span>}

              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Update User</h2>
            <form onSubmit={updateUser} className="space-y-4">
              <input type="text" value={editForm.name} placeholder="Name" className="border p-3 w-full rounded" onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}/>
              <input type="email" value={editForm.email} placeholder="Email" className="border p-3 w-full rounded" onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}/>
              <input type="text" value={editForm.mobile} placeholder="Mobile" maxLength={10} className="border p-3 w-full rounded" onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}/>
              <div className="flex justify-end gap-4">
                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditingUser(null)}>Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALERT MODAL */}
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

export default CreateUser;
