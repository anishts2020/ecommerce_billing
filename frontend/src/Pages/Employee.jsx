import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Removed: import Swal from "sweetalert2"; // No longer needed
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import api from "../Api";

// --- START: Icon Components (for CustomAlert) ---
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
// --- END: Icon Components ---

// ------------------------------------------------------------------
// CustomAlert Component
// ------------------------------------------------------------------
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
    if (!isOpen) return null;

    let icon, bgColor, buttonColor, confirmText, showCancelButton = false;
    let confirmAction = onConfirm; // Default action when clicking confirm button

    switch (type) {
        case 'confirm':
            icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
            bgColor = 'bg-white border-4 border-yellow-500';
            buttonColor = 'bg-red-600 hover:bg-red-700';
            confirmText = 'Yes, Delete it!';
            showCancelButton = true;
            break;
        case 'success':
            icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
            bgColor = 'bg-white border-4 border-green-500';
            buttonColor = 'bg-green-600 hover:bg-green-700';
            confirmText = 'Close';
            confirmAction = onClose; // Success/Error typically just closes the modal
            break;
        case 'error':
            icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
            bgColor = 'bg-white border-4 border-red-500';
            buttonColor = 'bg-red-600 hover:bg-red-700';
            confirmText = 'Close';
            confirmAction = onClose; // Success/Error typically just closes the modal
            break;
        default:
            icon = <AlertTriangleIcon className="w-10 h-10 text-gray-500" />;
            bgColor = 'bg-white border-4 border-gray-500';
            buttonColor = 'bg-blue-600 hover:bg-blue-700';
            confirmText = 'OK';
            confirmAction = onClose;
    }

    return (
         <div className="fixed inset-0 z-40 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">
            <div className={`w-full max-w-md p-6 rounded-lg shadow-2xl transform scale-100 transition-all ${bgColor}`}>
                {/* Header/Icon */}
                <div className="flex items-center space-x-4">
                    {icon}
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>

                {/* Message */}
                <div className="mt-4 pl-14">
                    <p className="text-gray-600">{message}</p>
                </div>

                {/* Footer/Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                    {showCancelButton && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg 
                                       hover:bg-gray-300 transition duration-150"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={confirmAction}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition duration-150 ${buttonColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
// ------------------------------------------------------------------


function Employee() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Custom Alert State
  const [alert, setAlert] = useState({ 
    isOpen: false, 
    title: "", 
    message: "", 
    type: "", 
    onConfirm: () => {}, 
    itemId: null 
  });


  // Form fields
  const [employee_code, setEmployeeCode] = useState("");
  const [employee_name, setEmployeeName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [joining_date, setJoiningDate] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary_type, setSalaryType] = useState("");
  const [base_salary, setBaseSalary] = useState("");
  const [is_active, setIsActive] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, []);
   const navigate = useNavigate();
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      // Show error alert on fetch failure
      setAlert({
        isOpen: true,
        title: "Connection Error",
        message: "Failed to load employee data. Check your API connection.",
        type: "error",
        onConfirm: () => setAlert({ ...alert, isOpen: false }),
        onClose: () => setAlert({ ...alert, isOpen: false }),
      });
    }
  };

  // Function to reset all form fields
  const resetFormFields = () => {
    setEmployeeCode("");
    setEmployeeName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setJoiningDate("");
    setDesignation("");
    setSalaryType("");
    setBaseSalary("");
    setIsActive(1);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetFormFields();
    setShowModal(true);
  }

  const closeAndResetModal = () => {
    setShowModal(false);
    resetFormFields();
  }


  const handleAddEmployee = async (e) => {
    e.preventDefault();

    try {
      await api.post("/employees", {
        employee_code,
        employee_name,
        phone,
        email,
        address,
        joining_date,
        designation,
        salary_type,
        base_salary,
        is_active: Number(is_active),
      });

      // 1. Close the form modal
      closeAndResetModal();
      
      // 2. Show Success Alert (using CustomAlert)
      setAlert({
        isOpen: true,
        title: "Success",
        message: "Employee added successfully.",
        type: "success",
        onConfirm: () => {
          setAlert({ ...alert, isOpen: false });
          fetchEmployees(); // Re-fetch data after closing alert
        },
        onClose: () => {
          setAlert({ ...alert, isOpen: false });
          fetchEmployees(); // Re-fetch data
        },
      });
      
    } catch (error) {
  let errorMessage = "Failed to add employee.";

  if (error.response && error.response.status === 422) {
    const errors = error.response.data.errors;
    errorMessage = Object.values(errors).flat().join(" ");
  }

  setAlert({
    isOpen: true,
    title: "Duplicate Entry",
    message: errorMessage,
    type: "error",
    onConfirm: () => setAlert({ ...alert, isOpen: false }),
    onClose: () => setAlert({ ...alert, isOpen: false }),
  });
}

  };
  
  const handleDeleteConfirmation = (id) => {
    // Show Confirmation Alert
    setAlert({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this employee? This action cannot be undone!",
      type: "confirm",
      itemId: id, // Store ID to be deleted
      onConfirm: () => {
        handleDelete(id);
      },
      onClose: () => setAlert({ ...alert, isOpen: false }),
    });
  };

  const handleDelete = async (id) => {
    // 1. Close the confirmation alert first
    setAlert({ ...alert, isOpen: false });

    try {
      await api.delete(`/employees/${id}`);
      
      // Show Success Alert
      setAlert({
        isOpen: true,
        title: "Deleted!",
        message: "Employee removed successfully.",
        type: "success",
        onConfirm: () => {
          setAlert({ ...alert, isOpen: false });
          fetchEmployees(); // Re-fetch data
        },
        onClose: () => {
          setAlert({ ...alert, isOpen: false });
          fetchEmployees(); // Re-fetch data
        },
      });

    } catch (error) {
      console.error("Error deleting employee:", error);
      // Show Error Alert
      setAlert({
        isOpen: true,
        title: "Error",
        message: "Failed to delete employee.",
        type: "error",
        onConfirm: () => setAlert({ ...alert, isOpen: false }),
        onClose: () => setAlert({ ...alert, isOpen: false }),
      });
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/employees/${editingId}`, {
        employee_code,
        employee_name,
        phone,
        email,
        address,
        joining_date,
        designation,
        salary_type,
        base_salary,
        is_active: Number(is_active),
      });

      // 1. Close the form modal
      closeAndResetModal();
      
      // 2. Show Success Alert
      setAlert({
        isOpen: true,
        title: "Success",
        message: "Employee updated successfully.",
        type: "success",
        onConfirm: () => {
          setAlert({ ...alert, isOpen: false });
          fetchEmployees(); // Re-fetch data
        },
        onClose: () => {
          setAlert({ ...alert, isOpen: false });
          fetchEmployees(); // Re-fetch data
        },
      });
    } catch (error) {
  let errorMessage = "Failed to update employee.";

  if (error.response && error.response.status === 422) {
    const errors = error.response.data.errors;
    errorMessage = Object.values(errors).flat().join(" ");
  }

  setAlert({
    isOpen: true,
    title: "Duplicate Entry",
    message: errorMessage,
    type: "error",
    onConfirm: () => setAlert({ ...alert, isOpen: false }),
    onClose: () => setAlert({ ...alert, isOpen: false }),
  });
}

  };


  const handleEdit = (employee) => {
    setEditingId(employee.id);
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    setEmployeeCode(employee.employee_code || "");
    setEmployeeName(employee.employee_name || "");
    setPhone(employee.phone || "");
    setEmail(employee.email || "");
    setAddress(employee.address || "");
    setJoiningDate(formatDate(employee.joining_date) || "");
    setDesignation(employee.designation || "");
    setSalaryType(String(employee.salary_type) || "");
    setBaseSalary(employee.base_salary || "");
    setIsActive(employee.is_active);

    setShowModal(true);
  };


  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg gap-4">

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-indigo-700 whitespace-nowrap">
            <span className="text-gray-900">🏢</span> Employee Management
          </h1>

          {/* Search Bar (smaller) */}
          <input
            type="text"
            placeholder="Search by name..."
            className="w-40 md:w-48 lg:w-56 px-3 py-1.5 border border-gray-300 rounded-full shadow-sm
               focus:ring-2 focus:ring-indigo-300 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Add Button */}
          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full 
               shadow-md hover:bg-indigo-700 transition duration-300 text-sm whitespace-nowrap"
          >
            <FaPlus size={14} />
            <span className="font-semibold">Add New Employee</span>
          </button>

        </div>

        {/* Employee Table - Same styling as before */}
        <div className="overflow-x-auto rounded-xl shadow-2xl mt-8">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm font-bold uppercase tracking-wider">
                <th className="py-4 px-6 text-left rounded-tl-xl">Sr No.</th>
                <th className="py-4 px-6 text-left">ID</th>
                <th className="py-4 px-6 text-left">Code</th>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left hidden sm:table-cell">Phone</th>
                <th className="py-4 px-6 text-left hidden md:table-cell">Email</th>
                <th className="py-4 px-6 text-left hidden lg:table-cell">Designation</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-center" colSpan="2">Actions</th>
                <th className="py-4 px-6 text-center">Salary Details</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-200">
             {employees.length > 0 ? (
  employees
    .filter(emp =>
      emp.employee_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
    .map((emp, index) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-indigo-50 transition duration-150 ease-in-out"
                  >
                    <td className="py-3 px-6 text-gray-700">{index + 1}</td>
                    <td className="py-3 px-6 text-gray-700">{emp.id}</td>
                    <td className="py-3 px-6 font-semibold text-gray-800">{emp.employee_code}</td>
                    <td className="py-3 px-6">{emp.employee_name}</td>
                    <td className="py-3 px-6 hidden sm:table-cell">{emp.phone}</td>
                    <td className="py-3 px-6 hidden md:table-cell text-blue-600 truncate max-w-[150px]">{emp.email}</td>
                    <td className="py-3 px-6 hidden lg:table-cell">{emp.designation}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          emp.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {emp.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    
                    <td className="py-3 px-3 text-center w-0">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center w-0">
                      <button
                        onClick={() => handleDeleteConfirmation(emp.id)}
                        className="p-2 rounded-full text-red-600 hover:bg-red-100 transition duration-150"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                   <td className="py-3 px-3 text-center w-0">
  <button
    onClick={() => navigate(`/salary/${emp.id}`)}
    className="bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition"
  >
    Salary
  </button>
</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-10 text-center text-gray-500 text-lg">
                    No employees found. Please add one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Add/Edit Employee Modal - Unchanged */}
      {showModal && (
        <div className="fixed inset-0 z-40 bg-white-300 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl 
         max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-indigo-700">
                {editingId ? "Edit Employee Details" : "Add New Employee"}
              </h3>
              <button
                type="button"
                onClick={closeAndResetModal}
                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50"
              >
                ✕
              </button>
            </div>

            {/* FORM START */}
            <form onSubmit={editingId ? handleUpdateEmployee : handleAddEmployee} className="space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Employee Code */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={employee_code}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                {/* NAME */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Employee Name</label>
                  <input
                    type="text"
                    value={employee_name}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={joining_date}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                {/* Base Salary */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Base Salary</label>
                  <input
                    type="number"
                    value={base_salary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                {/* Salary Type */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Salary Type</label>
                  <select
                    value={salary_type}
                    onChange={(e) => setSalaryType(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white"
                    required
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="0">Monthly</option>
                    <option value="1">Daily</option>
                  </select>
                </div>

                {/* Address */}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold">Status:</label>
                <div
                  onClick={() => setIsActive(is_active === 1 ? 0 : 1)}
                  className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${is_active ? "bg-green-500" : "bg-gray-400"
                    }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow transform transition ${is_active ? "translate-x-7" : "translate-x-0"
                      }`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-6 flex justify-end gap-4 border-t">
                <button type="button" onClick={closeAndResetModal} className="px-6 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
                  {editingId ? "Save Changes" : "Create Employee"}
                </button>
              </div>

            </form>

            {/* FORM END */}
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

export default Employee;