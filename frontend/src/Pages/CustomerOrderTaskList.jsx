import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomerOrderTaskList() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api/customer-order-tasks";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };
// const renderStatus = (status) => {
//   switch (status) {
//     case "completed":
//       return "bg-green-600";
//     case "in_progress":
//       return "bg-yellow-500";
//     default:
//       return "bg-gray-500";
//   }
// };

  /* -----------------------------
     PAYMENT MODE RENDERER
     ----------------------------- */
  const renderPaymentMode = (mode) => {
    if (!mode) return <span className="text-gray-500">N/A</span>;

    const value = mode.toUpperCase();

    if (value.includes("COD")) {
      return <span className="text-gray-700 font-semibold">COD</span>;
    }
    if (value.includes("UPI")) {
      return <span className="text-blue-600 font-semibold">UPI</span>;
    }
    if (value.includes("CARD")) {
      return <span className="text-purple-600 font-semibold">CARD</span>;
    }

    return <span className="text-green-600 font-semibold">{mode}</span>;
  };
const statusStyle = (status) => {
  switch (status) {
    case "delivered":
      return "bg-green-600";
    case "cancelled":
      return "bg-red-600";
    default:
      return "bg-yellow-500"; // inprogress
  }
};



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            📦 Customer Order Tasks
          </h1>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl shadow-xl bg-white">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm uppercase tracking-wider">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Payment Date</th>
                <th className="py-3 px-6">Payment Mode</th>
                <th className="py-3 px-6">Order Date</th>
                <th className="py-3 px-6">Status</th>

                <th className="py-3 px-6">Items</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-indigo-50 transition"
                  >
                    <td className="py-3 px-6 font-semibold">
                      {row.id}
                    </td>

                    <td className="py-3 px-6">
                      {row.order_id}
                    </td>

                    <td className="py-3 px-6 font-bold text-gray-800">
                      ₹{row.amount}
                    </td>

                    <td className="py-3 px-6">
                      {row.payment_date || "-"}
                    </td>

                    <td className="py-3 px-6 font-semibold text-gray-800">
  {row.payment_mode || "N/A"}
</td>

                    <td className="py-3 px-6">
                      {row.order_date || "-"}
                    </td>
                  <td className="py-3 px-6">
  <button
  onClick={() =>
    navigate(`/customer-order-items/${row.order_id}?taskId=${row.id}`)
  }
  className={`px-4 py-2 rounded-lg text-white font-semibold
    ${statusStyle(row.order_status)} hover:opacity-90`}
>
  {row.order_status
    ? row.order_status.toUpperCase()
    : "INPROGRESS"}
</button>

</td>


                    <td className="py-3 px-6">
                      <button
                        onClick={() =>
                          navigate(`/customer-order-items/${row.order_id}`)
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow 
                                   hover:bg-green-700 transition duration-200"
                      >
                        <span>📦</span> Items
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 px-6 text-center text-gray-500"
                  >
                    No customer order tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default CustomerOrderTaskList;
