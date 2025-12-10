import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api";

function EmployeeDetails() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get("/employees");
            setEmployees(res.data);
            setError("");
        } catch (err) {
            setError("Unable to fetch employees");
        }
    };

    const openSalary = (id) => {
        navigate(`/salary/${id}`);     // ✅ Now this will work
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Employee List</h2>

            {error && (
                <p className="text-red-600 mb-4 font-semibold">{error}</p>
            )}

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">

                    {/* Table Header */}
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Employee Code</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Phone</th>
                            <th className="px-4 py-3 text-left">Designation</th>
                            <th className="px-4 py-3 text-left">Joining Date</th>
                            <th className="px-4 py-3 text-left">Salary</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {employees.map((emp, index) => (
                            <tr
                                key={emp.id}
                                className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } hover:bg-blue-50`}
                            >
                                <td className="px-4 py-3">{emp.id}</td>
                                <td className="px-4 py-3">{emp.employee_code}</td>
                                <td className="px-4 py-3 font-medium">{emp.emp_name}</td>
                                <td className="px-4 py-3">{emp.email}</td>
                                <td className="px-4 py-3">{emp.phone}</td>
                                <td className="px-4 py-3">{emp.designation}</td>
                                <td className="px-4 py-3">{emp.joining_date}</td>
                                <td className="px-4 py-3">{emp.base_salary}</td>
                                <td>
                                    <button
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                        onClick={() => navigate(`/salary/${emp.id}`)}
                                    >
                                        Salary
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeDetails;
