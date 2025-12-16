import { useEffect, useMemo, useState } from "react";
import { WishlistContext } from "./wishlist.js";

export default function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const add = (product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggle = (product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      return exists ? prev.filter((i) => i.id !== product.id) : [...prev, product];
    });
  };

  const isFav = (id) => items.some((i) => i.id === id);

  const count = useMemo(() => items.length, [items]);

  const value = { items, add, remove, toggle, isFav, count };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
