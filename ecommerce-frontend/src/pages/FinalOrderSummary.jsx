// src/pages/FinalOrderSummary.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";

export default function FinalOrderSummary() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = sessionStorage.getItem("last_order_id");

    if (!orderId) {
      navigate("/");
      return;
    }

    api.get(`/orders/${orderId}`).then((res) => {
      setOrder(res.data);
    });
  }, []);

  if (!order) {
    return (
      <Layout>
        <p className="text-center text-gray-600 mt-10">Loading order...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white shadow-lg rounded-lg">

        {/* Header */}
        <h2 className="text-3xl font-bold text-green-600 mb-3">
          ✔ Order Placed Successfully!
        </h2>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Order Info */}
        <div className="border rounded p-4 bg-gray-50 mb-6">
          <p><strong>Order No:</strong> {order.order_no}</p>
          <p><strong>Order Status:</strong> {order.order_status}</p>
          <p><strong>Payment Mode:</strong> {order.payment_mode}</p>
          <p><strong>Payment Status:</strong> {order.payment_status}</p>
        </div>

        {/* Items */}
        <h3 className="text-xl font-bold mb-3">Items Purchased</h3>
        <table className="w-full border mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.order_item_id} className="border-b">
                <td className="p-3">{item.product?.product_name}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">₹{item.price}</td>
                <td className="p-3 text-right font-bold">₹{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Amount Summary */}
        <div className="border rounded p-4 bg-gray-50 mb-6">
          <h3 className="text-lg font-bold mb-3">Price Summary</h3>

          <div className="flex justify-between mb-2">
            <span>Total Amount:</span>
            <span>₹{order.total_amount}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>GST:</span>
            <span>₹{order.gst_amount}</span>
          </div>

          <div className="flex justify-between text-xl font-bold text-green-700 mt-3">
            <span>Grand Total:</span>
            <span>₹{order.grand_total}</span>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="font-bold mb-2">Billing Address</h3>
            <p>{order.billing_address}</p>
          </div>

          <div className="p-4 border rounded bg-gray-50">
            <h3 className="font-bold mb-2">Shipping Address</h3>
            <p>{order.shipping_address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => window.print()}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800"
          >
            Print Receipt
          </button>
        </div>

      </div>
    </Layout>
  );
}
