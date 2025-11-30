import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Inline SVG Icons for professional look
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

const AlertTriangleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

// --- Custom Alert/Modal Component (Replaces Swal) ---
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
    if (!isOpen) return null;

    let icon, bgColor, buttonColor, confirmText;
    switch (type) {
        case 'confirm':
            icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
            bgColor = 'bg-yellow-50 border-yellow-500';
            buttonColor = 'bg-red-600 hover:bg-red-700';
            confirmText = 'Yes, delete it!';
            break;
        case 'success':
            icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
            bgColor = 'bg-green-50 border-green-500';
            buttonColor = 'bg-green-600 hover:bg-green-700';
            confirmText = 'Close';
            break;
        case 'error':
            icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
            bgColor = 'bg-red-50 border-red-500';
            buttonColor = 'bg-red-600 hover:bg-red-700';
            confirmText = 'Close';
            break;
        default:
            icon = <AlertTriangleIcon className="w-10 h-10 text-gray-500" />;
            bgColor = 'bg-white border-gray-500';
            buttonColor = 'bg-blue-600 hover:bg-blue-700';
            confirmText = 'OK';
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-50 p-4" onClick={onClose}>
            <div
                className={`bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border-t-8 ${bgColor}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center space-y-4">
                    {icon}
                    <h2 className="text-xl font-bold text-gray-800 text-center">{title}</h2>
                    <p className="text-gray-600 text-center">{message}</p>
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                    {type === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition duration-150"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-150 shadow-md ${buttonColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- End Custom Alert Component ---


function SalaryDetails() {
    // Hardcoded mock ID since useParams is unavailable in a single file
    const { id } = useParams();
    const [salary, setSalary] = useState([]);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [employee, setEmployee] = useState({});

    // Custom Alert State: Refactored to remove redundant onClose
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success', // 'success', 'error', 'confirm'
        actionToRun: null, // Function to execute on confirm
    });

    // Stable closing function
    const closeAlert = useCallback(() => {
        setAlertState({
            isOpen: false,
            title: '',
            message: '',
            type: 'success',
            actionToRun: null,
        });
    }, []);

    // Centralized confirmation handler
    const handleAlertConfirm = () => {
        // If it's a confirmation, execute the stored actionToRun
        if (alertState.type === 'confirm' && alertState.actionToRun) {
            alertState.actionToRun();
        }
        // For success/error/non-confirm types, just close the modal
        else {
            closeAlert();
        }
    };


    // Modal form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        salary_month: "",
        salary_year: "",
        gross_salary: "",
        deductions: "",
        net_salary: "",
        payment_date: "",
        payment_mode: 1,
        remarks: ""
    });

    // Dynamic Modal Title and Submit Button Text
    const modalTitle = useMemo(() => editingId ? "Edit Salary Record" : "Add New Salary Payment", [editingId]);
    const submitButtonText = useMemo(() => editingId ? "Update Salary" : "Add Salary", [editingId]);

    // Month options
    const months = [
        { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
        { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
        { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
        { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 4 }, (_, i) => currentYear - 1 + i);

    // --- Data Fetching Hooks ---

    // Fetch salary history
    const fetchSalary = useCallback(() => {
        // Mocking API call
        axios.get(`http://127.0.0.1:8000/api/salary-payments/${id}`)
            .then(res => setSalary(res.data.data))
            .catch(() => setError("No salary records found for this employee."));
    }, [id]);

    useEffect(() => {
        fetchSalary();
    }, [fetchSalary]);

    // Fetch employee details
    useEffect(() => {
        // Mocking API call
        axios.get(`http://127.0.0.1:8000/api/employees/${id}`)
            .then(res => setEmployee(res.data))
            .catch(err => console.error("Could not fetch employee details:", err));
    }, [id]);

    // --- Utility Functions ---

    // Convert payment mode to display badge
    const paymentMode = (mode) => {
        const m = Number(mode);
        switch (m) {
            case 1: return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Cash</span>;
            case 2: return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Bank Transfer</span>;
            case 3: return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">UPI</span>;
            default: return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">-</span>;
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        // Automatically calculate net salary (Gross - Deductions)
        if (e.target.name === 'gross_salary' || e.target.name === 'deductions') {
            const newFormData = { ...formData, [e.target.name]: e.target.value };
            const gross = parseFloat(newFormData.gross_salary) || 0;
            const deduction = parseFloat(newFormData.deductions) || 0;
            // Ensure net_salary is not negative
            const net = Math.max(0, gross - deduction).toFixed(2);
            setFormData({ ...newFormData, net_salary: net.toString() });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Close form and reset state
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingId(null);
        // Reset form data to initial state
        setFormData({
            salary_month: "", salary_year: "", gross_salary: "", deductions: "",
            net_salary: "", payment_date: "", payment_mode: 1, remarks: ""
        });
    };

    // --- CRUD Handlers ---

    // Handle form submission (Add/Update)
    const handleSubmit = (e) => {
        e.preventDefault();

        const url = editingId
            ? `http://127.0.0.1:8000/api/salary-payments/${editingId}`
            : "http://127.0.0.1:8000/api/salary-payments";

        const method = editingId ? "put" : "post";

        // Prepare data
        const dataToSend = {
            employee_id: id,
            salary_month: Number(formData.salary_month),
            salary_year: Number(formData.salary_year),
            gross_salary: parseFloat(formData.gross_salary),
            deductions: parseFloat(formData.deductions || 0),
            net_salary: parseFloat(formData.net_salary),
            payment_date: formData.payment_date,
            payment_mode: Number(formData.payment_mode),
            remarks: formData.remarks
        };

        axios[method](url, dataToSend)
            .then(res => {
                if (res.data.status) {
                    // Refresh the data list
                    fetchSalary();

                    // Reset form state
                    handleCloseForm();

                    setAlertState({
                        isOpen: true,
                        title: 'Success',
                        message: editingId ? 'Salary record updated successfully!' : 'Salary payment added successfully!',
                        type: 'success',
                        actionToRun: null,
                    });
                }
            })
            .catch(err => {
                console.error(err);
                const msg = err.response?.data?.message
                    || "An error occurred while saving the salary record.";

                setAlertState({
                    isOpen: true,
                    title: 'Duplicate Entry',
                    message: msg,
                    type: 'error',
                    actionToRun: null,
                });
            });
    };

    const handleOpenEdit = (s) => {
        // Format payment_date from YYYY-MM-DD HH:MM:SS to YYYY-MM-DD for input[type="date"]
        const paymentDateOnly = s.payment_date ? s.payment_date.split(' ')[0] : '';

        setFormData({
            salary_month: s.salary_month,
            salary_year: s.salary_year,
            gross_salary: s.gross_salary,
            deductions: s.deductions,
            net_salary: s.net_salary,
            payment_date: paymentDateOnly,
            payment_mode: s.payment_mode,
            remarks: s.remarks || ''
        });
        setEditingId(s.salary_payment_id);
        setShowForm(true);
    };

    // Function to execute the deletion
    const executeDelete = useCallback((salaryId) => {
        // Close the confirmation alert
        closeAlert();

        axios.delete(`http://127.0.0.1:8000/api/salary-payments/${salaryId}`)
            .then(res => {
                if (res.data.status) {
                    // Update UI state directly
                    setSalary(prevSalary => prevSalary.filter(s => s.salary_payment_id !== salaryId));
                    setAlertState({
                        isOpen: true,
                        title: 'Deleted!',
                        message: 'The salary record has been deleted.',
                        type: 'success',
                        actionToRun: null,
                    });
                } else {
                    setAlertState({
                        isOpen: true,
                        title: 'Error!',
                        message: 'Could not delete the record.',
                        type: 'error',
                        actionToRun: null,
                    });
                }
            })
            .catch(err => {
                console.error(err);
                setAlertState({
                    isOpen: true,
                    title: 'Error!',
                    message: 'Could not delete the record.',
                    type: 'error',
                    actionToRun: null,
                });
            });
    }, [closeAlert]);


    // Handle Delete - triggers the confirmation alert
    const handleDelete = (salaryId) => {
        setAlertState({
            isOpen: true,
            title: 'Are you sure?',
            message: "This salary record will be permanently deleted!",
            type: 'confirm',
            // Store the function to run when the user confirms
            actionToRun: () => executeDelete(salaryId),
        });
    };


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center p-6">
                   <h2 className="text-2xl font-bold flex items-center">
                <span className="mr-3 text-indigo-600">🧾</span>
                Salary History (ID: {id})
                {employee?.employee_name && (
    <span className="ml-3 text-gray-600 text-lg">
        — Employee: <span className="font-semibold">{employee.employee_name}</span>
    </span>
)}

               
            </h2>

                    <button
                        onClick={() => {
                            handleCloseForm(); // Reset form for fresh "Add"
                            setShowForm(true);
                        }}
                        className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Record New Payment
                    </button>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow mb-6" role="alert">
                        <p className="font-bold">Information</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* SALARY TABLE */}
                <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200">
                    {salary.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm divide-y divide-gray-200">
                                <thead className="bg-blue-600 text-white uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 text-left font-bold rounded-tl-xl">Month</th>
                                        <th className="p-4 text-left font-bold">Year</th>
                                        <th className="p-4 text-left font-bold">Gross Salary</th>
                                        <th className="p-4 text-left font-bold">Deductions</th>
                                        <th className="p-4 text-left font-bold">Net Salary</th>
                                        <th className="p-4 text-left font-bold">Payment Mode</th>
                                        <th className="p-4 text-left font-bold">Payment Date</th>
                                        <th className="p-4 text-center font-bold rounded-tr-xl">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {salary.map((s, index) => (
                                        <tr
                                            key={s.salary_payment_id}
                                            className={`transition duration-150 ease-in-out ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
                                        >
                                            <td className="p-4 font-medium text-gray-700">{months.find(m => m.value == s.salary_month)?.label}</td>
                                            <td className="p-4 text-gray-600">{s.salary_year}</td>
                                            <td className="p-4 font-medium text-gray-900">₹ {s.gross_salary.toLocaleString()}</td>
                                            <td className="p-4 text-red-600">- ₹ {s.deductions.toLocaleString()}</td>
                                            <td className="p-4 font-extrabold text-green-700">₹ {s.net_salary.toLocaleString()}</td>
                                            <td className="p-4">{paymentMode(s.payment_mode)}</td>
                                            <td className="p-4 text-gray-500">{s.payment_date ? s.payment_date.split(' ')[0] : 'N/A'}</td>

                                            <td className="p-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleOpenEdit(s)}
                                                        className="p-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition duration-200 transform hover:scale-105"
                                                        title="Edit Record"
                                                    >
                                                        <EditIcon className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(s.salary_payment_id)}
                                                        className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200 transform hover:scale-105"
                                                        title="Delete Record"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        !error && (
                            <div className="p-6 text-center text-gray-500">
                                <p>No salary records found. Click 'Record New Payment' to add the first entry.</p>
                            </div>
                        )
                    )}
                </div>

            </div>

            {/* ADD/EDIT SALARY FORM MODAL */}
            {showForm && (
                <div className="fixed inset-0 z-40 backdrop-blur-md bg-opacity-50 flex justify-center items-center p-4 transition-opacity duration-300">
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-transform duration-300 scale-100">
                        <div className="flex justify-between items-center mb-6 border-b pb-3">
                            <h3 className="text-2xl font-bold text-gray-800">{modalTitle}</h3>
                            <button
                                type="button"
                                onClick={handleCloseForm}
                                className="text-gray-400 hover:text-gray-600 transition duration-150"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                {/* Month dropdown */}
                                <div className="col-span-1">
                                    <label htmlFor="salary_month" className="block text-sm font-medium text-gray-700">Salary Month</label>
                                    <select
                                        name="salary_month"
                                        value={formData.salary_month}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
                                    >
                                        <option value="">Select Month</option>
                                        {months.map(m => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year dropdown */}
                                <div className="col-span-1">
                                    <label htmlFor="salary_year" className="block text-sm font-medium text-gray-700">Salary Year</label>
                                    <select
                                        name="salary_year"
                                        value={formData.salary_year}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
                                    >
                                        <option value="">Select Year</option>
                                        {years.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label htmlFor="gross_salary" className="block text-sm font-medium text-gray-700">Gross Salary (₹)</label>
                                    <input type="number" name="gross_salary" placeholder="Gross Salary" value={formData.gross_salary} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="deductions" className="block text-sm font-medium text-gray-700">Deductions (₹)</label>
                                    <input type="number" name="deductions" placeholder="Deductions (e.g., Tax, PF)" value={formData.deductions} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="net_salary" className="block text-sm font-medium text-gray-700">Net Salary (Calculated) (₹)</label>
                                <input type="number" name="net_salary" placeholder="Net Salary" value={formData.net_salary} readOnly className="mt-1 w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">Payment Date</label>
                                    <input type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                </div>

                                <div className="col-span-1">
                                    <label htmlFor="payment_mode" className="block text-sm font-medium text-gray-700">Payment Mode</label>
                                    <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150">
                                        <option value={1}>Cash</option>
                                        <option value={2}>Bank Transfer</option>
                                        <option value={3}>UPI</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
                                <textarea name="remarks" placeholder="Any additional remarks" value={formData.remarks} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]"
                                >
                                    {submitButtonText}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Global Custom Alert/Modal */}
            <CustomAlert
                isOpen={alertState.isOpen}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                // Always use the stable handler for confirmation button press
                onConfirm={handleAlertConfirm}
                // Always use the stable closing function for backdrop/cancel button press
                onClose={closeAlert}
            />
        </div>
    );
}

export default SalaryDetails;

