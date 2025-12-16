// src/pages/OrderSummary.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function OrderSummary() {
  const [items, setItems] = useState([]);
  const [orderTotals, setOrderTotals] = useState({
    total_amount: 0,
    gst_amount: 0,
    grand_total: 0,
  });

  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD"); // default

  const navigate = useNavigate();

  useEffect(() => {
    const isSingle = sessionStorage.getItem("is_single_buy") === "true";

    if (isSingle) {
      const item = JSON.parse(sessionStorage.getItem("single_buy_item"));
      if (item) {
        setItems([item]);
        const total = Number(item.subtotal);
        const gst = +(total * 0.05).toFixed(2);
        setOrderTotals({ total_amount: total, gst_amount: gst, grand_total: +(total + gst).toFixed(2) });
      }
      return;
    }

    const cartId = sessionStorage.getItem("cart_id_for_order");
    if (!cartId) return;

    api.get(`/cart/${cartId}`).then((res) => {
      setItems(res.data);
      const total = res.data.reduce((sum, i) => sum + Number(i.subtotal), 0);
      const gst = +(total * 0.05).toFixed(2);
      setOrderTotals({ total_amount: total, gst_amount: gst, grand_total: +(total + gst).toFixed(2) });
    });
  }, []);

  const updateGST = (val) => {
    const gst = Number(val) || 0;
    setOrderTotals((prev) => ({
      ...prev,
      gst_amount: gst,
      grand_total: +(prev.total_amount + gst).toFixed(2),
    }));
  };

  // Open PaymentPage with pending order saved
  const goToPayment = () => {
    // Build payload preview (not saved yet)
    const isSingle = sessionStorage.getItem("is_single_buy") === "true";
    const cartIdForOrder = sessionStorage.getItem("cart_id_for_order") || null;

    const pending = {
      is_single: isSingle,
      cart_id: cartIdForOrder,
      items,
      total_amount: orderTotals.total_amount,
      gst_amount: orderTotals.gst_amount,
      grand_total: orderTotals.grand_total,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      payment_mode: paymentMode,
    };

    sessionStorage.setItem("pending_order", JSON.stringify(pending));
    navigate("/payment");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        {/* Items Preview */}
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.cart_item_id ?? idx} className="border-b">
                <td className="p-3">{item.product?.product_name ?? item.product_name}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">₹{item.price}</td>
                <td className="p-3 text-right font-bold">₹{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Price Summary */}
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <p><b>Total Amount:</b> ₹{orderTotals.total_amount}</p>

          <div className="mt-3">
            <label className="block font-semibold mb-1">GST Amount (Editable)</label>
            <input
              type="number"
              value={orderTotals.gst_amount}
              onChange={(e) => updateGST(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <p className="text-xl font-bold mt-3">
            Grand Total: ₹{orderTotals.grand_total}
          </p>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="font-bold mb-2">Billing Address</h3>
            <textarea
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              className="w-full border rounded p-2"
              rows="4"
              placeholder="Enter billing address..."
            />
          </div>

          <div className="p-4 border rounded bg-gray-50">
            <h3 className="font-bold mb-2">Shipping Address</h3>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full border rounded p-2"
              rows="4"
              placeholder="Enter shipping address..."
            />
          </div>
        </div>

        {/* Payment Mode */}
        <div className="mt-6 p-4 border rounded bg-white">
          <label className="font-semibold block mb-2">Select Payment Mode</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="CARD">Card</option>
            <option value="UPI">UPI</option>
            <option value="NETBANKING">Net Banking</option>
          </select>
        </div>

        {/* Actions */}
        <div className="mt-6 text-right">
          <button
            onClick={goToPayment}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </Layout>
  );
}
