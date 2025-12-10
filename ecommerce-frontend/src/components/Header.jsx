import { Link } from "react-router-dom";
import useCart from "../hooks/useCart.js";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Header() {
  const { items, count, removeItem, addItem, setQty } = useCart();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!btnRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          MyShop
        </Link>

        {/* Right side menu */}
        <nav className="flex items-center space-x-6 relative">
          <ThemeToggle />

          <Link 
            to="/login"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Register
          </Link>

          <button ref={btnRef} onClick={() => setOpen((o) => !o)} className="relative p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700 dark:text-gray-200">
              <path d="M3 3h2l.4 2M7 13h10l2-8H6.4"/>
              <circle cx="9" cy="19" r="2"/>
              <circle cx="17" cy="19" r="2"/>
            </svg>
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
              {count}
            </span>
          </button>

          {open && (
            <div ref={panelRef} className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
              <div className="p-3 border-b font-semibold">Cart</div>
              <div className="max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-4 text-sm text-gray-600 dark:text-gray-300">Your cart is empty</div>
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
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-200">Items: {count}</span>
                <span className="text-sm font-semibold">Total: ₹{items.reduce((s, p) => s + ((Number(p.price) || 0) * (p.qty || 1)), 0)}</span>
              </div>
            </div>
          )}

        </nav>
      </div>
    </header>
  );
}
