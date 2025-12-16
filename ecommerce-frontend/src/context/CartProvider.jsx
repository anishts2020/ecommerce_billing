import { useMemo, useState } from "react";
import { CartContext } from "./cart.js";

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // ADD ITEM
  const addItem = (product) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);

      // Item already in cart
      if (idx !== -1) {
        const existing = prev[idx];

        // Stock check
        if (
          product.stock !== undefined &&
          existing.qty >= product.stock
        ) {
          alert(`Only ${product.stock} items available in stock!`);
          return prev;
        }

        return prev.map((i, j) =>
          j === idx ? { ...i, qty: (i.qty || 1) + 1 } : i
        );
      }

      // New item stock check
      if (product.stock !== undefined && product.stock <= 0) {
        alert("This product is out of stock!");
        return prev;
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // REMOVE / DECREASE ITEM
  const removeItem = (id) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;

      const current = prev[idx];

      if ((current.qty || 1) > 1) {
        return prev.map((i, j) =>
          j === idx ? { ...i, qty: current.qty - 1 } : i
        );
      }

      // qty becomes 0 → remove item
      return prev.filter((i) => i.id !== id);
    });
  };

  // SET QTY DIRECTLY
  const setQty = (id, qty) => {
    setItems((prev) => {
      if (qty <= 0) {
        return prev.filter((i) => i.id !== id);
      }

      return prev.map((i) =>
        i.id === id ? { ...i, qty } : i
      );
    });
  };

  // CLEAR CART
  const clear = () => {
    setItems([]);
  };

  // TOTAL COUNT
  const count = useMemo(
    () => items.reduce((sum, i) => sum + (i.qty || 1), 0),
    [items]
  );

  const value = {
    items,
    addItem,
    removeItem,
    setQty,
    clear,
    count,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}