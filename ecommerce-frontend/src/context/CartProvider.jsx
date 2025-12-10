import { useMemo, useState } from "react";
import { CartContext } from "./cart.js";

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // ADD ITEM (Shows alert only when exceeding stock)
  const addItem = (product) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);

      // If product already in cart
      if (idx !== -1) {
        const existing = prev[idx];

        // ⭐ ALERT ONLY WHEN ADDING (+ button)
        if (existing.qty >= existing.stock) {
          alert(`Only ${existing.stock} items available in stock!`);
          return prev;
        }

        return prev.map((i, j) =>
          j === idx ? { ...i, qty: existing.qty + 1 } : i
        );
      }

      // If first time adding but stock is 0
      if (product.stock <= 0) {
        alert("This product is out of stock!");
        return prev;
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // REMOVE ITEM (No alerts here)
  const removeItem = (id) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;

      const item = prev[idx];

      // ⭐ Decrease quantity quietly (NO ALERT)
      if ((item.qty || 1) > 1) {
        return prev.map((i, j) =>
          j === idx ? { ...i, qty: item.qty - 1 } : i
        );
      }

      // If qty becomes 0, remove item silently
      return prev.filter((i) => i.id !== id);
    });
  };

  // SET QUANTITY DIRECTLY (Still NO alerts)
  const setQty = (id, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.id !== id);

      return prev.map((i) =>
        i.id === id ? { ...i, qty } : i
      );
    });
  };

  // Total count for header cart icon
  const count = useMemo(
    () => items.reduce((s, i) => s + (i.qty || 1), 0),
    [items]
  );

  const value = { items, addItem, removeItem, setQty, count };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
