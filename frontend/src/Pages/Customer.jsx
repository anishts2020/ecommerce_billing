import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

//
// ------------------------------------------------------------
// SVG ICONS (CLEAN - ONE TIME ONLY)
// ------------------------------------------------------------
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

//
// ------------------------------------------------------------
// CUSTOM ALERT COMPONENT (FIXED AND CLEAN)
// ------------------------------------------------------------
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, buttonColor, confirmText, showCancel = false;

  switch (type) {
    case "confirm":
      icon = <AlertTriangleIcon className="w-12 h-12 text-yellow-500" />;
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes, Continue";
      showCancel = true;
      break;

    case "success":
      icon = <CheckCircleIcon className="w-12 h-12 text-green-500" />;
      buttonColor = "bg-green-600 hover:bg-green-700";
      confirmText = "Close";
      break;

    case "error":
      icon = <XCircleIcon className="w-12 h-12 text-red-500" />;
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Close";
      break;

    default:
      icon = <AlertTriangleIcon className="w-12 h-12 text-blue-500" />;
      buttonColor = "bg-blue-600 hover:bg-blue-700";
      confirmText = "OK";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
        <div className="mb-4 flex justify-center">{icon}</div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-center gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-white rounded-lg ${buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

//
// ------------------------------------------------------------
// CUSTOMER COMPONENT
// ------------------------------------------------------------
function Customer() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const emptyForm = {
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gst_number: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("hide-admin-header");
    } else {
      document.body.classList.remove("hide-admin-header");
    }
  }, [showModal]);



  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "",
    onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
    onClose: () => setAlert(a => ({ ...a, isOpen: false })),
  });

  // Load customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/customers");
      setCustomers(res.data);
    } catch (err) {
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Could not load customers.",
        type: "error",
        onConfirm: () => setAlert(a => ({ ...a, isOpen: false })),
      });
    }
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (c) => {
    setEditingId(c.id);
    setFormData(c);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:8000/api/customers/${editingId}`
      : "http://localhost:8000/api/customers";

    try {
      editingId
        ? await axios.put(url, formData)
        : await axios.post(url, formData);

      closeModal();

      setAlert({
        isOpen: true,
        title: "Success",
        message: `Customer ${editingId ? "updated" : "added"} successfully!`,
        type: "success",
        onConfirm: () => {
          setAlert(a => ({ ...a, isOpen: false }));
          fetchCustomers();
        },
      });
    } catch (error) {
      setAlert({
        isOpen: true,
        title: "Error",
        message: `Failed to save customer.`,
        type: "error",
      });
    }
  };

  const confirmDelete = (id) => {
    setAlert({
      isOpen: true,
      title: "Delete Customer?",
      message: "This action cannot be undone.",
      type: "confirm",
      onConfirm: () => handleDelete(id),
      onClose: () => setAlert(a => ({ ...a, isOpen: false })),
    });
  };

  const handleDelete = async (id) => {
    setAlert(a => ({ ...a, isOpen: false }));

    try {
      await axios.delete(`http://localhost:8000/api/customers/${id}`);

      setAlert({
        isOpen: true,
        title: "Deleted",
        message: "Customer removed successfully.",
        type: "success",
        onConfirm: () => {
          setAlert(a => ({ ...a, isOpen: false }));
          fetchCustomers();
        },
      });
    } catch (err) {
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Failed to delete customer.",
        type: "error",
      });
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            👥 Customer Management
          </h1>

          <input
            type="text"
            placeholder="Search customer..."
            className="w-60 px-3 py-2 border rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-indigo-700"
          >
            <FaPlus /> Add Customer
          </button>
        </div>

        {/* CUSTOMER TABLE */}
        <div className="overflow-x-auto shadow-xl rounded-xl">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-center">Edit</th>
                <th className="p-3 text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {customers
                .filter(c => c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(c => (
                  <tr key={c.id} className="border-b hover:bg-indigo-50">
                    <td className="p-3">{c.id}</td>
                    <td className="p-3 font-semibold">{c.customer_name}</td>
                    <td className="p-3">{c.phone}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.city}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => openEditModal(c)}
                        className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full"
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => confirmDelete(c.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded-full"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* CUSTOMER FORM MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4">

            <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl">

              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-xl font-bold text-indigo-700">
                  {editingId ? "Edit Customer" : "Add Customer"}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="customer_name"
                  placeholder="Name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="p-3 border rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="p-3 border rounded-lg"
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="p-3 border rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="gst_number"
                  placeholder="GST Number"
                  value={formData.gst_number}
                  onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                  className="p-3 border rounded-lg"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="p-3 border rounded-lg sm:col-span-2"
                  required
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="p-3 border rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="p-3 border rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="p-3 border rounded-lg sm:col-span-2"
                  required
                />

                <div className="sm:col-span-2 flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingId ? "Update" : "Save"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ALERT */}
        <CustomAlert
          isOpen={alert.isOpen}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onConfirm={alert.onConfirm}
          onClose={alert.onClose}
        />

      </div>
    </div>
  );
}

export default Customer;
