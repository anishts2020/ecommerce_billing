import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function ProductCard({
  product,
  onClick,
  onAddToCart,
  onWishlist,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow ring-1 ring-gray-100 hover:shadow-xl transition p-4 flex flex-col cursor-pointer"
      onClick={onClick}
    >
      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
        onError={(e) => (e.target.src = "/fallback-image.png")}
      />

      {/* INFO */}
      <div className="flex-1">
        <h3 className="text-sm font-medium mb-1 text-gray-800">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-indigo-600">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm"
        >
          Add to Cart
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlist?.(product);
          }}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <Heart size={16} />
        </button>
      </div>
    </motion.div>
  );
}