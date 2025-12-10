import { Link } from "react-router-dom";
import useCart from "../hooks/useCart.js";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const { items, count, removeItem, addItem, setQty } = useCart();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  useEffect(() => {
    const handler = (e) => {
      if (!btnRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    const t = setTimeout(() => setToast((s) => ({ ...s, show: false })), 1600);
    return () => clearTimeout(t);
  };
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          MyShop
        </Link>

        {/* Right side menu */}
        <nav className="flex items-center space-x-6 relative">

          <Link 
            to="/login"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Register
          </Link>

          <button ref={btnRef} onClick={() => setOpen((o) => !o)} className="relative p-2 rounded hover:bg-gray-100" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700">
              <path d="M3 3h2l.4 2M7 13h10l2-8H6.4"/>
              <circle cx="9" cy="19" r="2"/>
              <circle cx="17" cy="19" r="2"/>
            </svg>
            <span key={count} className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center animate-bump`}>
              {count}
            </span>
          </button>

          {open && (
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
                        <div className="text-sm font-medium text-gray-800">{p.name}</div>
                        <div className="text-sm text-indigo-600">₹{p.price}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { removeItem(p.id); showToast('Removed one'); }} className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50">-</button>
                        <span className="min-w-[24px] text-center text-sm">{p.qty || 1}</span>
                        <button onClick={() => { addItem(p); showToast('Added quantity'); }} className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-50">+</button>
                        <button onClick={() => { setQty(p.id, 0); showToast('Removed item', 'error'); }} className="ml-2 text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50">Remove</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm text-gray-700">Items: {count}</span>
                <span className="text-sm font-semibold">Total: ₹{items.reduce((s, p) => s + ((Number(p.price) || 0) * (p.qty || 1)), 0)}</span>
              </div>
            </div>
          )}

          <div className={`toast ${toast.show ? 'show' : ''}`} style={{ background: toast.type === 'error' ? 'linear-gradient(135deg,#ef4444,#f59e0b)' : undefined }}>
            <span>{toast.message}</span>
          </div>

        </nav>
      </div>
    </header>
  );
}
