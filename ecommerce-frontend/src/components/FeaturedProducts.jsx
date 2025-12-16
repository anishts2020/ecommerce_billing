import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function FeaturedProductsCard({ product, onAddToCart, onWishlist }) {
  return (
    <motion.div
      className="group text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 object-contain"
        />
        <button
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
          onClick={() => onWishlist(product)}
        >
          <Star className="w-5 h-5 text-yellow-400" />
        </button>
      </div>
      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="mt-1 text-gold font-bold">${product.price}</p>
      <button
        className="mt-3 px-4 py-2 bg-gold text-white rounded-lg hover:bg-yellow-600 transition"
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </button>
    </motion.div>
  );
}
