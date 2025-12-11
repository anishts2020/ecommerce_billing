import useWishlist from "../hooks/useWishlist.js";
import { useMemo } from "react";

export default function ProductCard({ product, onAddToCart }) {
  const { toggle, isFav } = useWishlist();
  const fav = useMemo(() => isFav(product.id), [product.id, isFav]);

  return (
    <div className="relative bg-white rounded-xl shadow ring-1 ring-gray-100 hover:shadow-xl transition transform hover:-translate-y-0.5 p-4 flex flex-col">
      {/* Wishlist Heart */}
      <button
        aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={fav}
        onClick={() => toggle(product)}
        className="absolute top-3 right-3 p-2 rounded-full border border-gray-200 hover:border-gray-300 bg-white shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill={fav ? "#ef4444" : "none"} stroke={fav ? "#ef4444" : "currentColor"}>
          <path d="M12 21s-7-4.35-9.5-7.5A5.9 5.9 0 0 1 3 6a5.5 5.5 0 0 1 9 1 5.5 5.5 0 0 1 9-1 5.9 5.9 0 0 1 .5 7.5C19 16.65 12 21 12 21z" />
        </svg>
      </button>

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
      <p className="text-indigo-600 font-bold mb-4">₹{product.price}</p>

      <button
        onClick={() => onAddToCart(product)}
        className="mt-auto bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white py-2 rounded-lg shadow"
      >
        Add to Cart
      </button>
    </div>
  );
}
