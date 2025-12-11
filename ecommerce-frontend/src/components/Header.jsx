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
  const [search, setSearch] = useState("");

  const total = useMemo(
    () =>
      items.reduce(
        (s, p) => s + (Number(p.price) || 0) * (p.qty || 1),
        0
      ),
    [items]
  );

  const uniqueCount = items.length;
  const itemLabel = uniqueCount === 1 ? "ITEM" : "ITEMS";

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
    <header className="bg-white dark:bg-gray-800 shadow">
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    const t = setTimeout(() => setToast((s) => ({ ...s, show: false })), 1600);
    return () => clearTimeout(t);
  };
  return (
    <header className=" top-0 z-50 bg-white border-b transition-colors">
      {/* LOGO */}
      <div className=" mx-auto h-[140px] py-6 flex justify-center border-b border-black">
        <Link to="/" className="text-2xl tracking-[.3em]">
          <span className="px-6 mt-4 py-2 border-2 border-black text-black inline-block">
            BOUTIQUE
          </span>
        </Link>
      </div>

        {/* Right side menu */}
        <nav className="flex items-center space-x-6 relative">
          <ThemeToggle />

          <Link 
            to="/login"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium"

          <Link 
            to="/login"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Login
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

          <button ref={btnRef} onClick={() => setOpen((o) => !o)} className="relative p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700 dark:text-gray-200">
          <button ref={btnRef} onClick={() => setOpen((o) => !o)} className="relative p-2 rounded hover:bg-gray-100" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700">
              <path d="M3 3h2l.4 2M7 13h10l2-8H6.4"/>
              <circle cx="9" cy="19" r="2"/>
              <circle cx="17" cy="19" r="2"/>
            </svg>
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
            <span key={count} className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center animate-bump`}>
              {count}
            </span>
          </button>

          {open && (
            <div ref={panelRef} className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
              <div className="p-3 border-b font-semibold">Cart</div>
              <div className="max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-4 text-sm text-gray-600 dark:text-gray-300">Your cart is empty</div>
            <div ref={panelRef} className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg transition-all duration-200 ease-out">
              <div className="p-3 border-b font-semibold">Cart</div>
              <div className="max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-4 text-sm text-gray-600">Your cart is empty</div>
                ) : (
                  items.map((p, idx) => (
                    <div key={p.id ?? idx} className="flex items-center gap-3 p-3 border-b last:border-b-0">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{p.name}</div>
                        <div className="text-sm text-indigo-500">₹{p.price}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeItem(p.id)} className="px-2 py-1 border rounded text-gray-700 dark:text-gray-200">-</button>
                        <span className="min-w-[24px] text-center text-sm">{p.qty || 1}</span>
                        <button onClick={() => addItem(p)} className="px-2 py-1 border rounded text-gray-700 dark:text-gray-200">+</button>
                        <button onClick={() => setQty(p.id, 0)} className="ml-2 text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/10">Remove</button>
                        <div className="text-sm font-medium text-gray-800">{p.name}</div>
                        <div className="text-sm text-indigo-600">₹{p.price}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { removeItem(p.id); showToast('Removed one'); }} className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50">-</button>
                        <span className="min-w-[24px] text-center text-sm">{p.qty || 1}</span>
                        <button onClick={() => { addItem(p); showToast('Added quantity'); }} className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50">+</button>
                        <button onClick={() => { setQty(p.id, 0); showToast('Removed item', 'error'); }} className="ml-2 text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50">Remove</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-200">Items: {count}</span>
                <span className="text-sm text-gray-700">Items: {count}</span>
                <span className="text-sm font-semibold">Total: ₹{items.reduce((s, p) => s + ((Number(p.price) || 0) * (p.qty || 1)), 0)}</span>
              </div>
            )}

          <div className={`toast ${toast.show ? 'show' : ''}`} style={{ background: toast.type === 'error' ? 'linear-gradient(135deg,#ef4444,#f59e0b)' : undefined }}>
            <span>{toast.message}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
