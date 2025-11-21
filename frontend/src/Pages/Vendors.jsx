import { useEffect, useState } from "react";
import axios from "axios";

// SVG Icons for alert/modal
const EditIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PlusIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

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

// --- Custom Alert Component ---
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, bgColor, buttonColor, confirmText;
  switch (type) {
    case "confirm":
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      bgColor = "bg-yellow-50 border-yellow-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes, delete it!";
      break;
    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      bgColor = "bg-green-50 border-green-500";
      buttonColor = "bg-green-600 hover:bg-green-700";
      confirmText = "Close";
      break;
    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      bgColor = "bg-red-50 border-red-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Close";
      break;
    default:
      icon = <AlertTriangleIcon className="w-10 h-10 text-gray-500" />;
      bgColor = "bg-white border-gray-500";
      buttonColor = "bg-blue-600 hover:bg-blue-700";
      confirmText = "OK";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-40 p-4" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border-t-8 ${bgColor}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center space-y-4">
          {icon}
          <h2 className="text-xl font-bold text-gray-800 text-center">{title}</h2>
          <p className="text-gray-600 text-center">{message}</p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-150"
            >
              Cancel
            </button>
          )}
          <button onClick={onConfirm} className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-150 shadow-md ${buttonColor}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
// --- End Custom Alert ---

export default function Vendors() {
  const [vendors, setVendors] = useState([]);

  const [formData, setFormData] = useState({
    vendor_name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    gst_number: "",
  });

  const [editModal, setEditModal] = useState(false);

  const [editData, setEditData] = useState({ ...formData, id: "" });

  // --- Custom Alert State ---
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    actionToRun: null,
  });

  const closeAlert = () => setAlertState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });

  const handleAlertConfirm = () => {
    if (alertState.type === "confirm" && alertState.actionToRun) {
      alertState.actionToRun();
    } else {
      closeAlert();
    }
  };

  // --- Fetch Vendors ---
  const fetchVendors = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/vendors");
      setVendors(res.data);
    } catch (err) {
      setAlertState({ isOpen: true, title: "Error", message: "Failed to fetch vendors", type: "error" });
    }
  };

  useEffect(() => fetchVendors(), []);

  // --- Add Vendor ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/vendors", formData);
      setAlertState({ isOpen: true, title: "Success", message: "Vendor added successfully!", type: "success" });
      fetchVendors();
      setFormData({ vendor_name: "", email: "", phone: "", address: "", state: "", city: "", pincode: "", gst_number: "" });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const messages = Object.values(error.response.data.errors).flat();
        setAlertState({ isOpen: true, title: "Validation Error", message: messages.join(", "), type: "error" });
      }
    }
  };

  // --- Delete Vendor ---
  const handleDelete = (id) => {
    setAlertState({
      isOpen: true,
      title: "Are you sure?",
      message: "This vendor will be permanently deleted!",
      type: "confirm",
      actionToRun: async () => {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/vendors/${id}`);
          fetchVendors();
          setAlertState({ isOpen: true, title: "Deleted", message: "Vendor deleted successfully!", type: "success" });
        } catch {
          setAlertState({ isOpen: true, title: "Error", message: "Could not delete vendor", type: "error" });
        }
      },
    });
  };

  // --- Open Edit Modal ---
  const openEdit = (v) => {
    setEditData(v);
    setEditModal(true);
  };

  // --- Update Vendor ---
  const updateVendor = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/vendors/${editData.id}`, editData);
      setAlertState({ isOpen: true, title: "Success", message: "Vendor updated successfully!", type: "success" });
      setEditModal(false);
      fetchVendors();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const messages = Object.values(error.response.data.errors).flat();
        setAlertState({ isOpen: true, title: "Validation Error", message: messages.join(", "), type: "error" });
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Vendor Management</h2>

      {/* ADD VENDOR FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow mb-8">
        {["vendor_name", "email", "phone", "address", "state", "city", "pincode", "gst_number"].map((field) => (
          <input
            key={field}
            type={field === "email" ? "email" : "text"}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
        ))}
        <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Vendor
        </button>
      </form>

      {/* VENDORS TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              {["Name","Email","Phone","Address","State","City","Pincode","GST","Actions"].map((th) => <th key={th} className="p-2">{th}</th>)}
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} className="border-b text-center hover:bg-gray-100">
                <td className="p-2">{v.vendor_name}</td>
                <td className="p-2">{v.email}</td>
                <td className="p-2">{v.phone}</td>
                <td className="p-2">{v.address}</td>
                <td className="p-2">{v.state}</td>
                <td className="p-2">{v.city}</td>
                <td className="p-2">{v.pincode}</td>
                <td className="p-2">{v.gst_number}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button onClick={() => openEdit(v)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"><EditIcon className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(v.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"><TrashIcon className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Vendor</h3>
            <form onSubmit={updateVendor} className="space-y-3">
              {["vendor_name","email","phone","address","state","city","pincode","gst_number"].map((field) => (
                <input key={field} type={field==="email"?"email":"text"} value={editData[field]} onChange={(e)=>setEditData({...editData,[field]:e.target.value})} className="border rounded px-3 py-2 w-full"/>
              ))}
              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update</button>
                <button onClick={()=>setEditModal(false)} type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL ALERT */}
      <CustomAlert
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={handleAlertConfirm}
        onClose={closeAlert}
      />
    </div>
  );
}
                                                                                    