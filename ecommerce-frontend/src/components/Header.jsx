import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import useCart from "../hooks/useCart";
import LoginModal from "./LoginModal";
import api from "../api/api";

export default function Header() {
  /* ---------------- CART ---------------- */
  const { items, count, removeItem, addItem, setQty } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const btnRef = useRef(null);
  const panelRef = useRef(null);

  /* ---------------- USER ---------------- */
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  /* ---------------- UI STATE ---------------- */
  const [search, setSearch] = useState("");
  const [hideLogo, setHideLogo] = useState(false);

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const u = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    }

    if (token && api?.defaults) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  /* ---------------- CART TOTAL ---------------- */
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

  /* ---------------- CLOSE CART ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (
        !btnRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- SCROLL → HIDE LOGO ---------------- */
  useEffect(() => {
    const HIDE_AT = 140;
    const SHOW_AT = 40;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const scrollingDown = currentY > lastScrollY;
        const scrollingUp = currentY < lastScrollY;

        if (!hideLogo && scrollingDown && currentY > HIDE_AT) {
          setHideLogo(true);
        }

        if (hideLogo && scrollingUp && currentY < SHOW_AT) {
          setHideLogo(false);
        }

        lastScrollY = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideLogo]);

  /* ---------------- AUTH ---------------- */
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    if (api?.defaults)
      delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const onLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  /* ---------------- MENU ---------------- */
  const menuItems = [
    { name: "HOME", to: "/home" },
    { name: "SHOP", to: "/products" },
    { name: "BLOG", to: "/blog" },
    { name: "CONTACT", to: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b">
        {/* LOGO */}
        <Motion.div
          initial={false}
          animate={{
            height: hideLogo ? 0 : 140,
            opacity: hideLogo ? 0 : 1,
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="overflow-hidden border-b border-black flex items-center justify-center"
        >
          <Link to="/" className="text-2xl tracking-[.3em]">
            <span className="px-6 py-2 border-2 border-black">
              BOUTIQUE
            </span>
          </Link>
        </Motion.div>

        {/* NAVBAR */}
        <div className="max-w-6xl mx-auto px-4 h-[70px] flex items-center justify-between">
          {/* MENU */}
          <nav className="hidden md:flex gap-6 text-sm text-gray-700">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="hover:text-yellow-400"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* SEARCH */}
          <div className="flex-1 px-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full px-4 py-2 text-sm bg-gray-100 border"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-5 relative">
            {/* LOGIN / USER */}
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Hi, <b>{user?.name || user?.username}</b>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm text-gray-700"
              >
                Login
              </button>
            )}

            {/* CART */}
            <Motion.button
              ref={btnRef}
              onClick={() => setCartOpen((o) => !o)}
              className="relative"
            >
              🛒
              <Motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-2 bg-yellow-500 text-white text-[10px] rounded-full px-1.5"
              >
                {count}
              </Motion.span>
            </Motion.button>

            <span className="text-sm">₹{total.toFixed(2)}</span>

            {/* CART PANEL */}
            <AnimatePresence>
              {cartOpen && (
                <Motion.div
                  ref={panelRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-3 w-88 bg-white border rounded shadow-xl"
                >
                  <div className="px-4 py-3 text-xs border-b">
                    YOU HAVE {uniqueCount} {itemLabel}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">
                        Cart is empty
                      </div>
                    ) : (
                      items.map((p) => (
                        <div
                          key={p.id}
                          className="px-4 py-3 border-b flex gap-3"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-14 h-14 object-cover"
                          />
                          <div className="flex-1">
                            <div className="text-sm">{p.name}</div>
                            <div className="text-sm text-gray-600">
                              {p.qty} × ₹{p.price}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => removeItem(p.id)}>-</button>
                              <button onClick={() => addItem(p)}>+</button>
                            </div>
                          </div>
                          <button onClick={() => setQty(p.id, 0)}>×</button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-3 border-t">
                    <Link
                      to="/cart"
                      className="block w-full bg-black text-white py-3 text-center"
                    >
                      VIEW CART
                    </Link>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={onLoginSuccess}
      />
    </>
  );
}