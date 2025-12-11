// src/pages/PaymentPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";

export default function PaymentPage() {
  const navigate = useNavigate();

  const [pending, setPending] = useState(null);
  const [paymentMode, setPaymentMode] = useState("COD");

  // Card form
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // UPI
  const [upiId, setUpiId] = useState("");

  // Netbanking (simple select for banks)
  const [bank, setBank] = useState("");

  // loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("pending_order");
    if (!raw) {
      // nothing to pay for — go back
      navigate("/");
      return;
    }
    const obj = JSON.parse(raw);
    setPending(obj);
    setPaymentMode(obj.payment_mode || "COD");
  }, []);

  if (!pending) {
    return (
      <Layout>
        <p className="text-center mt-8">Preparing payment...</p>
      </Layout>
    );
  }

  const total = pending.total_amount ?? 0;
  const gst = pending.gst_amount ?? 0;
  const grand = pending.grand_total ?? total + gst;

  const confirmPayment = async () => {
    setLoading(true);

    // Basic client-side validation for card/upi/netbanking
    if (paymentMode === "CARD") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        alert("Please fill card details");
        setLoading(false);
        return;
      }
    } else if (paymentMode === "UPI") {
      if (!upiId) {
        alert("Please enter UPI ID");
        setLoading(false);
        return;
      }
    } else if (paymentMode === "NETBANKING") {
      if (!bank) {
        alert("Please select bank");
        setLoading(false);
        return;
      }
    }

    try {
      // Build final payload to save order (server will create order + order_items)
      const payload = {
        user_id: 0,
        total_amount: total,
        gst_amount: gst,
        grand_total: grand,
        billing_address: pending.billing_address || "",
        shipping_address: pending.shipping_address || "",
        payment_mode: paymentMode,
        payment_details: {
          // optional — store minimal card/upi info (not PCI-compliant, just demo)
          card: paymentMode === "CARD" ? { cardNumber, cardName, cardExpiry } : null,
          upi: paymentMode === "UPI" ? { upiId } : null,
          bank: paymentMode === "NETBANKING" ? { bank } : null
        },
        items: pending.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price: i.price,
          subtotal: i.subtotal,
        })),
        // if this came from cart, include cart_id so backend can clear it
        cart_id: pending.cart_id || null,
      };

      const res = await api.post("/orders", payload);

      // server returns order and order_id
      const createdOrder = res.data.order;
      sessionStorage.setItem("last_order_id", createdOrder.order_id);

      // clear cart keys on frontend
      sessionStorage.removeItem("cart_id");
      sessionStorage.removeItem("cart_id_for_order");
      sessionStorage.removeItem("is_single_buy");
      sessionStorage.removeItem("single_buy_item");
      sessionStorage.removeItem("pending_order");

      // navigate to final order summary (or order details page)
      navigate("/order-summary-final");
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      alert("Payment/Order failed: " + (err.response?.data?.message || "Try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
        <h2 className="text-2xl font-bold mb-4">Payment</h2>

        {/* Order preview */}
        <div className="border rounded p-4 mb-4 bg-gray-50">
          <h4 className="font-semibold mb-2">Order Preview</h4>
          {pending.items.map((it, idx) => (
            <div key={idx} className="flex justify-between py-2">
              <div>{it.product?.product_name ?? it.product_name}</div>
              <div>₹{it.subtotal}</div>
            </div>
          ))}

          <div className="mt-3 border-t pt-3">
            <div className="flex justify-between">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Grand Total</span>
              <span>₹{grand}</span>
            </div>
          </div>
        </div>

        {/* Addresses & payment mode controls */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-3 border rounded">
            <h4 className="font-semibold mb-2">Billing Address</h4>
            <div className="text-sm text-gray-700">{pending.billing_address || "Not provided"}</div>
          </div>

          <div className="p-3 border rounded">
            <h4 className="font-semibold mb-2">Shipping Address</h4>
            <div className="text-sm text-gray-700">{pending.shipping_address || "Not provided"}</div>
          </div>

          <div className="p-3 border rounded">
            <label className="font-semibold">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full p-2 border rounded mt-2"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
              <option value="NETBANKING">Net Banking</option>
            </select>

            {/* Render selected payment inputs */}
            <div className="mt-3">
              {paymentMode === "CARD" && (
                <div className="space-y-2">
                  <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" className="w-full p-2 border rounded" />
                  <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on Card" className="w-full p-2 border rounded" />
                  <div className="flex gap-2">
                    <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" className="w-1/2 p-2 border rounded" />
                    <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="CVV" className="w-1/2 p-2 border rounded" />
                  </div>
                </div>
              )}

              {paymentMode === "UPI" && (
                <div>
                  <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="example@bank" className="w-full p-2 border rounded" />
                </div>
              )}

              {paymentMode === "NETBANKING" && (
                <div>
                  <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full p-2 border rounded">
                    <option value="">Select bank</option>
                    <option value="HDFC">HDFC</option>
                    <option value="ICICI">ICICI</option>
                    <option value="SBI">SBI</option>
                    <option value="AXIS">AXIS</option>
                  </select>
                </div>
              )}

              {paymentMode === "COD" && (
                <div className="text-sm text-gray-600 mt-2">You will pay on delivery. No additional steps required.</div>
              )}
            </div>
          </div>
        </div>

        {/* Confirm */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">You can change payment mode before confirming</div>
          <button
            onClick={confirmPayment}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Processing..." : `Confirm & Pay ₹${grand}`}
          </button>
        </div>
      </div>
    </Layout>
  );
}
