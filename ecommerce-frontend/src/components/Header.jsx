import { Link } from "react-router-dom";
import useCart from "../hooks/useCart.js";
import useWishlist from "../hooks/useWishlist.js";
import { useEffect, useRef, useState, useMemo } from "react";
import api from "../api/api";

export default function Header() {
  const { items, count, removeItem, addItem, setQty, clear } = useCart();
  const { items: witems, count: wcount, remove: wremove } = useWishlist();
  const [open, setOpen] = useState(false);
  const [wOpen, setWOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const wBtnRef = useRef(null);
  const wPanelRef = useRef(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [search, setSearch] = useState("");

  const total = useMemo(
    () => items.reduce((s, p) => s + (Number(p.price) * (p.qty || 1)), 0),
    [items]
  );

  const uniqueCount = items.length;
  const itemLabel = uniqueCount === 1 ? "ITEM" : "ITEMS";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        !btnRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
      if (
        !wBtnRef.current?.contains(e.target) &&
        !wPanelRef.current?.contains(e.target)
      ) {
        setWOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🚀 FIXED — FINAL WORKING CHECKOUT FUNCTION
  const proceedToCheckout = async () => {
    if (!items.length) return;

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const payload = {
        user_id: user?.id || 1,
        items: items.map((p) => ({
          product_id: p.id,
          quantity: p.qty || 1,
          price: Number(p.price),
        })),
      };

      // Send to backend
      const res = await api.post("/cart/checkout", payload);

      // Close dropdown
      setOpen(false);

      // ⭐ Clear frontend cart (reset basket count to 0)
      clear?.();

      // Toast message
      setToast({
        show: true,
        message: `Checkout saved (Cart #${res?.data?.cart_id ?? ""})`,
        type: "success",
      });

      setTimeout(() => setToast((s) => ({ ...s, show: false })), 1500);

    } catch (err) {
      console.error("Checkout failed", err);

      setToast({
        show: true,
        message: "Failed to save checkout",
        type: "error",
      });

      setTimeout(() => setToast((s) => ({ ...s, show: false })), 1800);
    }
  };

  return (
    <header className="bg-white relative z-[9999]">
      <div className="border-b">
        <div className="max-w-6xl mx-auto py-6 flex justify-center">
          <Link to="/" className="text-2xl tracking-[.3em]">
            <span className="px-6 py-2 border border-black inline-block">
              BOUTIQUE
            </span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm text-gray-700">
            <Link to="/" className="text-orange-400">HOME</Link>
            <button className="hover:text-black">PAGES</button>
            <button className="hover:text-black">SHOP</button>
            <button className="hover:text-black">FEATURES</button>
            <button className="hover:text-black">BLOG</button>
            <button className="hover:text-black">CONTACT US</button>
          </nav>

          {/* Search */}
          <div className="flex-1 px-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search everything..."
              className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-6 relative">
            <div className="relative">
            {/* Wishlist Icon */}
            <button
              ref={wBtnRef}
              onClick={() => setWOpen((o) => !o)}
              className="relative p-2 text-gray-700 hover:text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 21s-7-4.35-9.5-7.5A5.9 5.9 0 0 1 3 6a5.5 5.5 0 0 1 9 1 5.5 5.5 0 0 1 9-1 5.9 5.9 0 0 1 .5 7.5C19 16.65 12 21 12 21z" />
              </svg>
              <span key={`w${wcount}`} className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bump">
                {wcount}
              </span>
            </button>

            {wOpen && (
              <div
                ref={wPanelRef}
                className="right-0 top-full mt-2 w-[22rem] bg-white border border-gray-200 rounded shadow-lg"
              >
                <div className="px-4 py-3 text-xs tracking-wider text-gray-700 border-b">
                  WISHLIST (<span className="text-red-500">{wcount}</span>) ITEMS
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {witems.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">Your wishlist is empty</div>
                  ) : (
                    witems.map((p, idx) => (
                      <div key={p.id ?? idx} className="px-4 py-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">{p.name}</div>
                            <div className="text-sm text-gray-700">₹{p.price}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => addItem(p)} className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50">Add to Cart</button>
                            <button onClick={() => wremove(p.id)} className="text-gray-600 hover:text-black">×</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
            {/* Search Icon */}
            <button className="p-2 text-gray-700 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>

            {/* Cart Icon */}

            <button
              ref={btnRef}
              onClick={() => setOpen((o) => !o)}
              className="absolute top-2 right-2 z-50 p-2 text-gray-700 hover:text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l2-8H6.4" />
                <circle cx="9" cy="19" r="2" />
                <circle cx="17" cy="19" r="2" />
              </svg>

              {/* Cart Count Badge */}
              <span key={count} className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 bg-yellow-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bump">
                {count}
              </span>
            </button>

            {/* Subtotal */}
            <div className="text-sm text-gray-700">₹{total.toFixed(2)}</div>

            {/* Settings icon */}
            <button className="p-2 text-gray-700 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                <path d="M2 12h2m16 0h2M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
              </svg>
            </button>

            {/* Dropdown Cart */}
            {open && (
              <div
                ref={panelRef}
                className="absolute right-0 top-full mt-2 w-[22rem] bg-white border border-gray-200 rounded shadow-lg z-[9999]"
              >
                <div className="px-4 py-3 text-xs tracking-wider text-gray-700 border-b">
                  YOU HAVE (<span className="text-orange-500">{uniqueCount} {itemLabel}</span>) IN YOUR CART
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {/* Empty cart */}
                  {items.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">Your cart is empty</div>
                  ) : (
                    items.map((p, idx) => (
                      <div key={p.id ?? idx} className="px-4 py-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />

                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">{p.name}</div>
                            <div className="text-sm text-gray-700">{p.qty || 1}x ₹{p.price}</div>

                            {/* Qty Buttons */}
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={() => { removeItem(p.id); }}
                                className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50"
                              >
                                -
                              </button>

                              <span className="min-w-[24px] text-center text-sm">{p.qty}</span>

                              <button
                                onClick={() => { addItem(p); }}
                                className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Remove All */}
                          <button
                            onClick={() => setQty(p.id, 0)}
                            className="text-gray-600 hover:text-black"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Checkout / View Cart */}
                <div className="px-4 py-3 border-t">
                  <div className="text-center text-sm">Subtotal ₹{total.toFixed(2)}</div>

                  <div className="mt-3 space-y-3">
                    <Link
                      to="/cart"
                      onClick={() => setOpen(false)}
                      className="block w-full bg-black text-white py-3 text-sm tracking-wide text-center"
                    >
                      VIEW CART
                    </Link>

                    <button
                      onClick={proceedToCheckout}
                      className="w-full border border-black text-black py-3 text-sm tracking-wide"
                    >
                      PROCEED TO CHECKOUT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Toast */}
            <div
              className={`toast ${toast.show ? "show" : ""}`}
              style={{
                background:
                  toast.type === "error"
                    ? "linear-gradient(135deg,#ef4444,#f59e0b)"
                    : undefined,
              }}
            >
              <span>{toast.message}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
