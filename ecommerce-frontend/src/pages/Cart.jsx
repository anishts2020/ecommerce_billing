import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api, { BASE_URL } from "../api/api";

export default function Cart() {
  const [data, setData] = useState({ cart: null, items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || 1;
    api
      .get("/cart/latest", { params: { user_id: userId } })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load cart");
      })
      .finally(() => setLoading(false));
  }, []);

  const items = useMemo(() => data.items || [], [data.items]);
  const total = useMemo(() => items.reduce((s, it) => s + Number(it.subtotal || 0), 0), [items]);

  const updateQty = async (cart_item_id, nextQty) => {
    try {
      const res = await api.put(`/cart/items/${cart_item_id}, { quantity: nextQty }`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to update quantity");
    }
  };

  const removeItem = async (cart_item_id) => {
    try {
      const res = await api.delete(`/cart/items/${cart_item_id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to remove item");
    }
  };

  const proceedToPay = () => {
    alert(`Proceeding to payment. Total: ₹${Number(total).toFixed(2)}`);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-2">Shopping Bag</h2>
        <div className="text-sm text-black mb-6">{items.length} items in your bag.</div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !data.cart ? (
          <div className="text-gray-600">No cart found.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Product</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Price</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Quantity</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.cart_item_id} className="border-t dark:border-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={`${BASE_URL.replace("/api", "")}/product_images/${it.product_image}`}
                            alt={it.product_name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="uppercase font-bold text-gray-900 dark:text-black tracking-wide">{it.product_name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {it.color_name ? <span>Color • {it.color_name}</span> : null}
                              {it.size_name ? <span className="ml-3">Size • {it.size_name}</span> : null}
                            </div>
                          </div>
                          <button onClick={() => removeItem(it.cart_item_id)} className="text-gray-400 hover:text-black">×</button>
                        </div>
                      </td>
                      <td className="px-6 py-4">₹{Number(it.price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQty(it.cart_item_id, Math.max(1, (it.quantity || 1) - 1))} className="px-2 py-1 border rounded">-</button>
                          <span>{it.quantity}</span>
                          <button onClick={() => updateQty(it.cart_item_id, (it.quantity || 1) + 1)} className="px-2 py-1 border rounded">+</button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-orange-500 font-semibold">₹{Number(it.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-6 flex items-center justify-between border-t dark:border-gray-700">
                <div className="text-lg font-semibold">Total: ₹{Number(total).toFixed(2)}</div>
                <button onClick={proceedToPay} className="bg-black text-white px-6 py-3 rounded">Proceed To Checkout</button>
              </div>
            </div>
            <div className="bg-white  rounded-2xl shadow-xl p-6">
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={`sum-${it.cart_item_id}`} className="flex justify-between text-sm">
                    <span className="text-black">{it.product_name}</span>
                    <span className="text-black">₹{Number(it.subtotal).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm border-t pt-3">
                  <span className="">Sales Tax</span>
                  <span className="text-gray-500">included</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>₹{Number(total).toFixed(2)}</span>
                </div>
                <button onClick={proceedToPay} className="w-full bg-black text-white py-3 rounded">PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}