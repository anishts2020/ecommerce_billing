import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

// --- START: Reusable Icon Components ---
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
// --- END: Reusable Icon Components ---

// ------------------------------------------------------------------
// CustomAlert Component (FIXED LOGIC)
// ------------------------------------------------------------------
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
    if (!isOpen) return null;

    let icon, bgColor, buttonColor, confirmText, showCancelButton = false;
    
    // Determine the style and text based on the alert type
    switch (type) {
        case 'confirm':
            icon = <AlertTriangleIcon className="w-10 h-10 text-amber-500" />;
            bgColor = 'bg-white rounded-2xl shadow-xl';
            buttonColor = 'bg-red-600 hover:bg-red-700';
            confirmText = 'Yes, Proceed';
            showCancelButton = true;
            break;
        case 'success':
            icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
            bgColor = 'bg-white rounded-xl shadow-lg';
            buttonColor = 'bg-green-600 hover:bg-green-700';
            confirmText = 'Close';
            break;
        case 'error':
            icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
            bgColor = 'bg-white rounded-xl shadow-lg';
            buttonColor = 'bg-red-600 hover:bg-red-700';
            confirmText = 'Close';
            break;
        default: 
            icon = <AlertTriangleIcon className="w-10 h-10 text-blue-500" />;
            bgColor = 'bg-white rounded-xl shadow-lg';
            buttonColor = 'bg-blue-600 hover:bg-blue-700';
            confirmText = 'OK';
    }

    // The primary button action is ALWAYS onConfirm.
    const primaryAction = onConfirm; 

    return (
        <div className="fixed inset-0 z-40 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">
            <div className={`w-full max-w-sm p-6 ${bgColor}`}>
                {/* Header/Icon */}
                <div className="flex justify-center mb-4">
                    {icon}
                </div>

                {/* Content */}
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                        {message}
                    </p>
                </div>

                {/* Footer/Actions */}
                <div className="flex justify-center space-x-3">
                    {showCancelButton && (
                        <button
                            onClick={onClose} // Cancel button calls onClose
                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg 
                                       hover:bg-gray-300 transition duration-150"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={primaryAction} // Primary button calls onConfirm
                        className={`px-6 py-2 text-sm font-bold text-white rounded-lg transition duration-150 ${buttonColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
// ------------------------------------------------------------------


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

  // Custom Alert State
  const [alert, setAlert] = useState({ 
    isOpen: false, 
    title: "", 
    message: "", 
    type: "", 
    // Default onConfirm and onClose are set to just close the alert
    onConfirm: () => setAlert(prev => ({ ...prev, isOpen: false })), 
    onClose: () => setAlert(prev => ({ ...prev, isOpen: false }))
  });


  useEffect(() => {
    fetchCustomers();
  }, []);

  // Function that closes the alert AND fetches customers (used for success cases)
  const handleRefetchAndClose = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
    fetchCustomers();
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setAlert({
        isOpen: true,
        title: "Connection Error",
        message: "Failed to load customer data.",
        type: "error",
        onConfirm: () => setAlert(prev => ({ ...prev, isOpen: false })), // Simple close for error
        onClose: () => setAlert(prev => ({ ...prev, isOpen: false })),
      });
    }
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };
  
  const openEditModal = (cust) => {
    setEditingId(cust.id);
    setFormData({
        customer_name: cust.customer_name || "",
        phone: cust.phone || "",
        email: cust.email || "",
        address: cust.address || "",
        city: cust.city || "",
        state: cust.state || "",
        pincode: cust.pincode || "",
        gst_number: cust.gst_number || "",
    });
    setShowModal(true);
  };

  const closeAndResetModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const url = isEditing 
        ? `http://localhost:8000/api/customers/${editingId}`
        : "http://localhost:8000/api/customers";
    const method = isEditing ? axios.put : axios.post;
    const action = isEditing ? "Updated" : "Added";

    try {
      await method(url, formData);
      
      closeAndResetModal();

      setAlert({
        isOpen: true,
        title: "Success!",
        message: `Customer ${action} Successfully.`,
        type: "success",
        onConfirm: handleRefetchAndClose, // The primary action runs the combined function
        onClose: handleRefetchAndClose, // Although not strictly needed here, it handles possible custom close implementations
      });
    } catch (error) {
      console.error(`Error ${action.toLowerCase()} customer:`, error);
      setAlert({
        isOpen: true,
        title: "Error",
        message: `Failed to ${isEditing ? "Update" : "Add"} Customer.`,
        type: "error",
        onConfirm: () => setAlert(prev => ({ ...prev, isOpen: false })),
        onClose: () => setAlert(prev => ({ ...prev, isOpen: false })),
      });
    }
  };
  
  const handleDeleteConfirmation = (id) => {
    setAlert({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this customer? This cannot be undone.",
      type: "confirm",
      onConfirm: () => handleDelete(id), // The primary action runs the delete
      onClose: () => setAlert(prev => ({ ...prev, isOpen: false })), // Cancel action just closes
    });
  };

  const handleDelete = async (id) => {
    setAlert(prev => ({ ...prev, isOpen: false })); // Close confirmation alert

    try {
        await axios.delete(`http://localhost:8000/api/customers/${id}`);
        setAlert({
            isOpen: true,
            title: "Deleted!",
            message: "Customer deleted successfully.",
            type: "success",
            onConfirm: handleRefetchAndClose, // The primary action runs the combined function
            onClose: handleRefetchAndClose, 
        });
    } catch (error) {
        console.error("Error deleting customer:", error);
        setAlert({
            isOpen: true,
            title: "Error",
            message: "Failed to delete customer.",
            type: "error",
            onConfirm: () => setAlert(prev => ({ ...prev, isOpen: false })),
            onClose: () => setAlert(prev => ({ ...prev, isOpen: false })),
        });
    }
  };


  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            👥 Customer Management
          </h1>
          <input
    type="text"
    placeholder="Search by name..."
    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

          {/* ADD CUSTOMER BUTTON */}
          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full 
                        shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaPlus size={16} />
            <span className="font-semibold">Add Customer</span>
          </button>
        </div>
        
        {/* --- Customer Table --- */}
        <div className="overflow-x-auto rounded-xl shadow-2xl mt-8">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm font-bold uppercase tracking-wider">
                <th className="py-4 px-6 text-left rounded-tl-xl">ID</th>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left hidden sm:table-cell">Phone</th>
                <th className="py-4 px-6 text-left hidden md:table-cell">Email</th>
                <th className="py-4 px-6 text-left hidden lg:table-cell">City</th>
                <th className="py-4 px-6 text-center">Edit</th>
                <th className="py-4 px-6 text-center ">Delete</th>
                
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200">
              {customers.length > 0 ? (
                
  customers
    .filter(cust =>
      cust.customer_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
    .map((cust, index) => (
                
                  <tr key={cust.id} className="hover:bg-indigo-50 transition duration-150 ease-in-out">
                    
                    <td className="py-3 px-6 text-gray-700">{cust.id}</td>
                    <td className="py-3 px-6 font-semibold text-gray-800">{cust.customer_name}</td>
                    <td className="py-3 px-6 hidden sm:table-cell">{cust.phone}</td>
                    <td className="py-3 px-6 hidden md:table-cell text-blue-600 truncate max-w-[150px]">{cust.email}</td>
                    <td className="py-3 px-6 hidden lg:table-cell">{cust.city}</td>

                    <td className="py-3 px-3 text-center w-0">
                      <button
                        onClick={() => openEditModal(cust)}
                        className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center w-0">
                      <button
                        onClick={() => handleDeleteConfirmation(cust.id)}
                        className="p-2 rounded-full text-red-600 hover:bg-red-100 transition duration-150"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                   
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500 text-lg">
                    No customers found. Click 'Add Customer' to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>


      {/* --- ADD/EDIT CUSTOMER MODAL (Attractive Tailwind styling) --- */}
      {showModal && (
        <div className="fixed inset-0 z-40 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-indigo-700">
                {editingId ? "Edit Customer Details" : "Add New Customer"}
              </h3>
              <button
                type="button"
                onClick={closeAndResetModal}
                className="text-gray-400 hover:text-red-500 transition duration-150 p-2 rounded-full hover:bg-red-50"
                title="Close"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Customer Name */}
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-semibold text-gray-700 mb-1">Customer Name</label>
                  <input
                    id="customer_name" type="text" name="customer_name" placeholder="Full Name" 
                    value={formData.customer_name} onChange={handleChange} required
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    id="phone" type="text" name="phone" placeholder="123-456-7890" 
                    value={formData.phone} onChange={handleChange} required
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    id="email" type="email" name="email" placeholder="name@company.com" 
                    value={formData.email} onChange={handleChange} required
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                  />
                </div>
                
                {/* GST Number */}
                <div>
                  <label htmlFor="gst_number" className="block text-sm font-semibold text-gray-700 mb-1">GST Number</label>
                  <input
                    id="gst_number" type="text" name="gst_number" placeholder="Optional" 
                    value={formData.gst_number} onChange={handleChange}
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                  />
                </div>
                
                {/* Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <input
                    id="address" type="text" name="address" placeholder="Street Address" 
                    value={formData.address} onChange={handleChange} required
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                  />
                </div>
                
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input
                    id="city" type="text" name="city" placeholder="City" 
                    value={formData.city} onChange={handleChange} required
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                  />
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <input
                    id="state" type="text" name="state" placeholder="State/Province" 
                    value={formData.state} onChange={handleChange} required
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                  />
                </div>
                
                {/* Pincode */}
                <div className="sm:col-span-2">
                  <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-1">Pincode/Zip</label>
                  <input
                    id="pincode" type="text" name="pincode" placeholder="Pincode" 
                    value={formData.pincode} onChange={handleChange} required
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-150"
                  />
                </div>
                
              </div>
              
              <div className="pt-4 flex justify-end gap-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeAndResetModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 font-medium transform hover:scale-105"
                >
                  {editingId ? "Save Changes" : "Save Customer"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      
      {/* RENDER THE CUSTOM ALERT */}
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

export default Customer;