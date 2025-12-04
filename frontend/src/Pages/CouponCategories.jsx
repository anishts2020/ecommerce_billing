import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTag, FaTrash, FaEdit } from "react-icons/fa";

// --- START: Icon Components for Alerts ---
const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
// --- END: Icons ---

// CustomAlert component
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, bgColor, buttonColor, confirmText, showCancelButton = false;
  let confirmAction = onConfirm;

  switch (type) {
    case "confirm":
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      bgColor = "bg-white border border-yellow-300 shadow-xl rounded-xl";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes, Delete it!";
      showCancelButton = true;
      break;
    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      bgColor = "bg-white border-4 border-green-500";
      buttonColor = "bg-green-600 hover:bg-green-700";
      confirmText = "Close";
      confirmAction = onClose;
      break;
    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      bgColor = "bg-white border-4 border-red-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Close";
      confirmAction = onClose;
      break;
    default:
      icon = <AlertTriangleIcon className="w-10 h-10 text-gray-500" />;
      bgColor = "bg-white border-4 border-gray-500";
      buttonColor = "bg-blue-600 hover:bg-blue-700";
      confirmText = "OK";
      confirmAction = onClose;
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
      <div className={`w-full max-w-md p-6 rounded-lg shadow-2xl ${bgColor}`}>
        <div className="flex items-center space-x-4">
          {icon}
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>

        <div className="mt-4 pl-14">
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {showCancelButton && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
          <button
            onClick={confirmAction}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CouponCategory() {
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ coupon_id: "", category_id: "" });
  const [editData, setEditData] = useState(null);
  const [alert, setAlert] = useState({ isOpen: false, title: "", message: "", type: "", onConfirm: () => {}, onClose: () => {} });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Fetch product categories
  useEffect(() => {
    axios.get("http://localhost:8000/api/product-categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch coupons
  useEffect(() => {
    axios.get("http://localhost:8000/api/coupons")
      .then(res => setCoupons(res.data.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch list
  const loadList = () => {
    axios.get("http://localhost:8000/api/coupon-categories")
      .then(res => setList(res.data.data))
      .catch(err => console.error(err));
  };
  useEffect(() => { loadList(); }, []);

  // Add mapping
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/coupon-categories", form);
      setForm({ coupon_id: "", category_id: "" });
      setAlert({
        isOpen: true,
        title: "Success",
        message: "Mapping added successfully",
        type: "success",
        onConfirm: () => { setAlert({ ...alert, isOpen: false }); loadList(); },
        onClose: () => { setAlert({ ...alert, isOpen: false }); loadList(); }
      });
    } catch (err) {
      setAlert({
        isOpen: true,
        title: "Error",
        message: err.response?.data?.message || "Failed to add mapping",
        type: "error",
        onConfirm: () => setAlert({ ...alert, isOpen: false }),
        onClose: () => setAlert({ ...alert, isOpen: false })
      });
    }
  };

  // Delete mapping
  const handleDeleteConfirmation = (id) => {
    setAlert({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete?",
      type: "confirm",
      onConfirm: () => handleDelete(id),
      onClose: () => setAlert({ ...alert, isOpen: false })
    });
  };

  const handleDelete = async (id) => {
    setAlert({ ...alert, isOpen: false });
    try {
      await axios.delete(`http://localhost:8000/api/coupon-categories/${id}`);
      setAlert({
        isOpen: true,
        title: "Deleted",
        message: "Removed successfully",
        type: "success",
        onConfirm: () => { setAlert({ ...alert, isOpen: false }); loadList(); },
        onClose: () => { setAlert({ ...alert, isOpen: false }); loadList(); }
      });
    } catch (err) {
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Failed to delete",
        type: "error",
        onConfirm: () => setAlert({ ...alert, isOpen: false }),
        onClose: () => setAlert({ ...alert, isOpen: false })
      });
    }
  };

  // Update
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/api/coupon-categories/${editData.id}`, editData);
      setEditData(null);
      setAlert({
        isOpen: true,
        title: "Updated",
        message: "Updated successfully",
        type: "success",
        onConfirm: () => { setAlert({ ...alert, isOpen: false }); loadList(); },
        onClose: () => { setAlert({ ...alert, isOpen: false }); loadList(); }
      });
    } catch (err) {
      setAlert({
        isOpen: true,
        title: "Error",
        message: err.response?.data?.message || "Failed to update",
        type: "error",
        onConfirm: () => setAlert({ ...alert, isOpen: false }),
        onClose: () => setAlert({ ...alert, isOpen: false })
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-xl mb-6 flex items-center gap-3">
        <FaTag className="text-3xl text-yellow-500" />
        <span className="text-3xl font-bold text-indigo-700">Coupon Categories</span>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-5 w-full">
            <div className="flex-1 min-w-[48%]">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Coupon</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.coupon_id}
                onChange={(e) => setForm({ ...form, coupon_id: e.target.value })}
              >
                <option value="">Choose Coupon</option>
                {coupons.map((c) => (
                  <option key={c.coupon_master_id} value={c.coupon_master_id}>
                    {c.coupon_code}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[48%]">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Product Category</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">Choose Category</option>
                {categories.map((cat) => (
                  <option key={cat.product_category_id} value={cat.product_category_id}>
                    {cat.product_category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-8 rounded-xl shadow-xl bg-white">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-600 text-white text-sm uppercase tracking-wider">
              <th className="py-3 px-6">SI No</th>
              <th className="py-3 px-6">Coupon Code</th>
              <th className="py-3 px-6">Product Category</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-200">
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td className="py-3 px-6">{indexOfFirstItem + index + 1}</td>
                <td className="py-3 px-6">{item.coupon_code}</td>
                <td className="py-3 px-6">{item.product_category_name}</td>
                <td className="py-3 px-6 flex gap-4">
                  <FaEdit className="text-indigo-600 cursor-pointer" size={18} onClick={() => setEditData(item)} />
                  <FaTrash className="text-red-600 cursor-pointer" size={18} onClick={() => handleDeleteConfirmation(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-5">
        <button
          className={`px-4 py-1 border rounded-lg ${
            currentPage === 1 ? "text-gray-400 border-gray-300 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-4 py-1 border rounded-lg ${
              currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "border-gray-400"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          className={`px-4 py-1 border rounded-lg ${
            currentPage === totalPages ? "text-gray-400 border-gray-300 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editData && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-white w-96 p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-center">Update Mapping</h2>

              <label className="block text-sm font-semibold mb-1">Coupon</label>
              <select
                className="w-full border rounded-lg px-3 py-2 mb-3"
                value={editData.coupon_id}
                onChange={(e) => setEditData({ ...editData, coupon_id: e.target.value })}
              >
                {coupons.map((c) => (
                  <option key={c.coupon_master_id} value={c.coupon_master_id}>{c.coupon_code}</option>
                ))}
              </select>

              <label className="block text-sm font-semibold mb-1">Category</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={editData.category_id}
                onChange={(e) => setEditData({ ...editData, category_id: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.product_category_id} value={cat.product_category_id}>{cat.product_category_name}</option>
                ))}
              </select>

              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setEditData(null)} className="px-4 py-2 rounded-lg bg-gray-300">Cancel</button>
                <button onClick={handleUpdate} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Update</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={alert.onConfirm}
        onClose={alert.onClose}
      />
    </div>
  );
}
