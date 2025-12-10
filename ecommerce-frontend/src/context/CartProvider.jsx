import { useMemo, useState } from "react";
import { CartContext } from "./cart.js";

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx !== -1) {
        return prev.map((i, j) => (j === idx ? { ...i, qty: (i.qty || 1) + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const item = prev[idx];
      if ((item.qty || 1) > 1) {
        return prev.map((i, j) => (j === idx ? { ...i, qty: i.qty - 1 } : i));
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const setQty = (id, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, qty } : i));
    });
  };

  const count = useMemo(() => items.reduce((s, i) => s + (i.qty || 1), 0), [items]);

  const value = { items, addItem, removeItem, setQty, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
