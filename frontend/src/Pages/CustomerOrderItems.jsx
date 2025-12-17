import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

export default function CustomerOrderItems() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId"); // 👈 IMPORTANT

  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchTaskStatus();
  }, []);

  /* ---------------------------
     FETCH ORDER ITEMS
  --------------------------- */
  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/orders/${orderId}/items`
      );
      setItems(res.data);
    } catch (error) {
      console.error("Failed to fetch order items:", error);
    }
  };

  /* ---------------------------
     FETCH CURRENT STATUS
  --------------------------- */
  const fetchTaskStatus = async () => {
    if (!taskId) return;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/customer-order-tasks/${taskId}`
      );
      setOrderStatus(res.data.order_status || "pending");
    } catch (error) {
      console.error("Failed to fetch task status:", error);
    }
  };

  /* ---------------------------
     UPDATE STATUS
  --------------------------- */
  const updateStatus = async (status) => {
    if (!taskId) return;

    try {
      setLoading(true);
      await axios.put(
        `http://127.0.0.1:8000/api/customer-order-tasks/${taskId}/status`,
        { order_status: status }
      );
      setOrderStatus(status);
      alert("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------
     STATUS STYLE
  --------------------------- */
  const statusColor = {
    pending: "bg-gray-500",
    in_progress: "bg-yellow-500",
    completed: "bg-green-600",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            📦 Order #{orderId} Items
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            ⬅ Back
          </button>
        </div>

        {/* ORDER STATUS CARD */}
        <div className="mb-6 p-5 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Order Progress
          </h2>

          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-full text-white font-semibold
                ${statusColor[orderStatus]}`}
            >
              {orderStatus.replace("_", " ").toUpperCase()}
            </span>

            <div className="flex gap-4 mb-6">
  <button
    onClick={() => updateStatus("inprogress")}
    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
  >
    In Progress
  </button>

  <button
    onClick={() => updateStatus("delivered")}
    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
  >
    Delivered
  </button>

  <button
    onClick={() => updateStatus("cancelled")}
    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Cancelled
  </button>
</div>

          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="overflow-x-auto rounded-xl shadow-xl bg-white">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm uppercase tracking-wider">
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Qty</th>
                <th className="py-3 px-6">Subtotal</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-200">
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.order_item_id} className="hover:bg-indigo-50">
                    <td className="py-3 px-6">{item.product_name}</td>
                    <td className="py-3 px-6">₹{item.price}</td>
                    <td className="py-3 px-6">{item.quantity}</td>
                    <td className="py-3 px-6 font-bold text-green-700">
                      ₹{item.subtotal}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No items found
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
