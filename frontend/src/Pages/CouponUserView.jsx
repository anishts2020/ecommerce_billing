import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

/* --------------------- SVG Icons --------------------- */
const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* --------------------- ALERT COMPONENTS --------------------- */
const CustomAlert = ({ isOpen, title, message, type, onClose }) => {
  if (!isOpen) return null;

  let icon, bgColor, buttonColor;

  switch (type) {
    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      bgColor = "bg-green-50 border-green-500";
      buttonColor = "bg-green-600 hover:bg-green-700";
      break;
    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      bgColor = "bg-red-50 border-red-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      break;
    default:
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      bgColor = "bg-yellow-50 border-yellow-500";
      buttonColor = "bg-yellow-600 hover:bg-yellow-700";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border-t-8 ${bgColor}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="text-center space-y-4">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="mt-6 flex justify-center">
          <button onClick={onClose} className={`px-4 py-2 text-white rounded-lg ${buttonColor}`}>OK</button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmAlert = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border-t-8 border-red-500"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-center space-y-4">
          <XCircleIcon className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Confirm Delete</h2>
          <p className="text-gray-600">Are you sure you want to delete this coupon user?</p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* --------------------- MAIN COMPONENT --------------------- */
const CouponUserView = () => {

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
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [searchText, setSearchText] = useState("");

  /* -------- ALERT STATES -------- */
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const openAlert = (title, message, type = "success") => {
    setAlert({ isOpen: true, title, message, type });
  };

  const closeAlert = () => setAlert({ ...alert, isOpen: false });

  const fetchCouponUsers = () => {
    axios
      .get("http://127.0.0.1:8000/api/coupon-users")
      .then((res) => setCouponUsers(res.data))
      .catch(() => openAlert("Error", "Failed to load coupon users", "error"));
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/coupons-list").then((res) => setCoupons(res.data));
    axios.get("http://127.0.0.1:8000/api/users").then((res) => setUsers(res.data));
    fetchCouponUsers();
  }, []);

  /* ================ ADD ================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:8000/api/coupon-users", form)
      .then(() => {
        openAlert("Added!", "Coupon user added successfully", "success");
        setForm({ coupon_master_id: "", user_id: "", usage_count: "" });
        setIsAddModalOpen(false);
        fetchCouponUsers();
      })
      .catch(() => openAlert("Error", "Failed to add coupon user", "error"));
  };

  /* ================ EDIT ================== */
  const handleEdit = (row) => {
    setEditId(row.coupon_user_id);

    setForm({
      coupon_master_id: String(row.coupon_master_id),
      user_id: String(row.user_id),
      usage_count: row.usage_count,
    });

    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    axios.put(`http://127.0.0.1:8000/api/coupon-users/${editId}`, form)
      .then(() => {
        openAlert("Updated!", "Coupon user updated successfully", "success");
        setIsEditModalOpen(false);
        fetchCouponUsers();
      })
      .catch(() => openAlert("Error", "Failed to update coupon user", "error"));
  };

  /* ================ DELETE ================== */
  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://127.0.0.1:8000/api/coupon-users/${deleteId}`)
      .then(() => {
        openAlert("Deleted!", "Coupon user deleted successfully", "success");
        setIsDeleteConfirmOpen(false);
        fetchCouponUsers();
      })
      .catch(() => openAlert("Error", "Failed to delete coupon user", "error"));
  };

  /* ---------------- SEARCH + PAGINATION ---------------- */
  const filteredCouponUsers = couponUsers.filter((row) =>
    `${row.coupon_code ?? ""} ${row.name ?? ""} ${row.usage_count ?? ""}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

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
              onChange={(e) => setSearchText(e.target.value)}
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
              {filteredCouponUsers.length > 0 ? (
                filteredCouponUsers.map((row, idx) => (
                  <tr key={row.coupon_user_id} className="hover:bg-gray-50">
                    <td className="py-3 text-center">{idx + 1}</td>
                    <td className="py-3 text-center">{row.coupon_code}</td>
                    <td className="py-3 text-center">{row.name}</td>
                    <td className="py-3 text-center">{row.usage_count}</td>

                    <td className="py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => handleEdit(row)}
                          className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full">
                          <FaEdit />
                        </button>

                        <button onClick={() => handleDelete(row.coupon_user_id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-full">
                          <FaTrash />
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

        {/* ⭐ ADD MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Add Coupon User</h2>

              <form onSubmit={handleSubmit}>
                <label className="font-medium">Select Coupon</label>
                <select className="border p-2 w-full rounded mb-3"
                  value={form.coupon_master_id}
                  onChange={(e) => setForm({ ...form, coupon_master_id: e.target.value })}
                  required>
                  <option value="">-- Select Coupon --</option>
                  {coupons.map((c) => (
                    <option key={c.coupon_master_id} value={c.coupon_master_id}>
                      {c.coupon_code}
                    </option>
                  ))}
                </select>

                <label className="font-medium">Select User</label>
                <select className="border p-2 w-full rounded mb-3"
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                  required>
                  <option value="">-- Select User --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                <label className="font-medium">Usage Count</label>
                <input type="number" className="border p-2 w-full rounded mb-4"
                  value={form.usage_count}
                  onChange={(e) => setForm({ ...form, usage_count: e.target.value })}
                  required />

                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-gray-300 rounded-lg"
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </button>

                  <button type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ⭐ EDIT MODAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Edit Coupon User</h2>

              <label className="font-medium">Select Coupon</label>
              <select className="border p-2 w-full rounded mb-3"
                value={form.coupon_master_id}
                onChange={(e) => setForm({ ...form, coupon_master_id: e.target.value })}>
                <option value="">-- Select Coupon --</option>
                {coupons.map((c) => (
                  <option key={c.coupon_master_id} value={c.coupon_master_id}>
                    {c.coupon_code}
                  </option>
                ))}
              </select>

              <label className="font-medium">Select User</label>
              <select className="border p-2 w-full rounded mb-3"
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}>
                <option value="">-- Select User --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <label className="font-medium">Usage Count</label>
              <input type="number" className="border p-2 w-full rounded mb-4"
                value={form.usage_count}
                onChange={(e) => setForm({ ...form, usage_count: e.target.value })} />

              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ⭐ DELETE CONFIRM */}
        <DeleteConfirmAlert
          isOpen={isDeleteConfirmOpen}
          onConfirm={confirmDelete}
          onClose={() => setIsDeleteConfirmOpen(false)}
        />

        {/* ⭐ ALERT */}
        <CustomAlert
          isOpen={alert.isOpen}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClose={closeAlert}
        />

      </div>
    </div>
  );
};

export default CouponUserView;
