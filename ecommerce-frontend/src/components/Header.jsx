import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { items, count, removeItem, addItem, setQty } = useCart();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hideLogo, setHideLogo] = useState(false);

  const btnRef = useRef(null);
  const panelRef = useRef(null);

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
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- SCROLL HANDLER ---------------- */
useEffect(() => {
  const HIDE_AT = 140;
  const SHOW_AT = 40; // much smaller to prevent flicker

  let lastScrollY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY;
      const scrollingUp = currentY < lastScrollY;

      // Hide ONLY when scrolling DOWN past threshold
      if (!hideLogo && scrollingDown && currentY > HIDE_AT) {
        setHideLogo(true);
      }

      // Show ONLY when scrolling UP close to top
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



  /* ---------------- MENU ---------------- */
  const menuItems = [
    { name: "HOME", to: "/home" },
    { name: "PAGES", to: "/pages" },
    { name: "SHOP", to: "/products" },
    { name: "FEATURES", to: "/features" },
    { name: "BLOG", to: "/blog" },
    { name: "CONTACT", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      {/* ---------------- LOGO (HEIGHT COLLAPSE — NO GAP) ---------------- */}
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
          <span className="px-6 py-2 border-2 border-black text-black inline-block">
            BOUTIQUE
          </span>
        </Link>
      </Motion.div>

      {/* ---------------- NAVBAR ---------------- */}
      <div className="max-w-6xl mx-auto px-4 h-[70px] flex items-center justify-between">
        {/* MENU */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-700">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="hover:text-yellow-400 transition-colors"
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
            placeholder="Search everything..."
            className="w-full rounded-full px-4 py-2 text-sm bg-gray-100 text-black border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-5 relative">
          {/* CART BUTTON */}
          <Motion.button
            ref={btnRef}
            onClick={() => setOpen((o) => !o)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="relative text-gray-700"
          >
            🛒
            <Motion.span
              key={count}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
              className="absolute -top-1 -right-2 bg-yellow-500 text-white text-[10px] rounded-full px-1.5"
            >
              {count}
            </Motion.span>
          </Motion.button>

          <span className="text-sm text-gray-700">
            ₹{total.toFixed(2)}
          </span>

          {/* CART PANEL */}
          <AnimatePresence>
            {open && (
              <Motion.div
                ref={panelRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="absolute right-0 top-full mt-3 w-88 bg-white border border-gray-200 rounded shadow-xl"
              >
                <div className="px-4 py-3 text-xs border-b text-gray-700">
                  YOU HAVE (
                  <span className="text-orange-500">
                    {uniqueCount} {itemLabel}
                  </span>
                  ) IN YOUR CART
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      Your cart is empty
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
                          className="w-14 h-14 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-black">{p.name}</div>
                          <div className="text-sm text-gray-600">
                            {p.qty || 1} × ₹{p.price}
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
                  <div className="text-center text-sm text-gray-700">
                    Subtotal ₹{total.toFixed(2)}
                  </div>
                  <div className="mt-3 space-y-3">
                    <Link
                      to="/cart"
                      className="block w-full bg-black text-white py-3 text-sm text-center"
                    >
                      VIEW CART
                    </Link>
                    <Link
                      to="/checkout"
                      className="block w-full border border-black py-3 text-sm text-black text-center"
                    >
                      CHECKOUT
                    </Link>
                  </div>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
