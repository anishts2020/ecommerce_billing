import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const cartId = sessionStorage.getItem("cart_id");

  const loadCart = () => {
    if (!cartId) return;
    api.get(`/cart/${cartId}`).then((res) => setItems(res.data));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (cartItemId) => {
    await api.delete(`/cart/item/${cartItemId}`);
    loadCart();
  };

  // ⭐ CHANGE QUANTITY
  const updateQuantity = async (item, newQty) => {
    if (newQty < 1) return; // do not allow 0 qty

    try {
      await api.post("/cart/update-qty", {
        cart_item_id: item.cart_item_id,
        quantity: newQty,
      });

      loadCart();
    } catch (err) {
      console.error("Qty update failed:", err.response?.data || err);
    }
  };

  // ⭐ ORDER NOW (NO ORDER CREATION HERE)
  const handleOrderNow = () => {
    sessionStorage.setItem("is_single_buy", "false");
    sessionStorage.setItem("cart_id_for_order", cartId);
    navigate("/order-summary");
  };

  const grandTotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {items.length === 0 ? (
          <p className="text-gray-500 text-lg">No products in cart</p>
        ) : (
          <>
            <table className="w-full bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Product</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.cart_item_id} className="border-b">
                    <td className="p-3">{item.product?.product_name}</td>

                    {/* ⭐ QUANTITY BUTTONS */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-300 rounded"
                        >
                          -
                        </button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-300 rounded"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="p-3">₹{item.price}</td>
                    <td className="p-3 font-bold">₹{item.subtotal}</td>

                    <td className="p-3 flex justify-center">
                      <button
                        onClick={() => handleRemove(item.cart_item_id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ⭐ GRAND TOTAL */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-xl font-bold">
                Grand Total:{" "}
                <span className="text-green-700">₹{grandTotal}</span>
              </div>

              <button
                onClick={handleOrderNow}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow"
              >
                Order Now
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
