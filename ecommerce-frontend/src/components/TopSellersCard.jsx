import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function TopSellersCard({ product, onAddToCart, onWishlist }) {
  return (
    <motion.div
      className="group text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden w-full h-[300px] sm:h-[340px] md:h-[380px] flex items-center justify-center bg-gray-100">

        {/* ⭐ Top Seller Badge */}
        <div className="absolute top-4 left-4 bg-black text-white text-[10px] px-3 py-1 tracking-wider uppercase z-30">
          Top Seller
        </div>

        {/* ❤️ Wishlist Icon */}
        <motion.button
          onClick={() => onWishlist(product)}
          className="
            absolute top-4 right-4 
            p-2 rounded-full bg-white shadow-md
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            z-30
          "
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className="w-5 h-5 text-black" />
        </motion.button>

        {/* Product Image */}
        <motion.img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain z-0"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Dark Overlay (Add to Cart) */}
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          <motion.button
            onClick={() => onAddToCart(product)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6 bg-black text-white px-10 py-3 text-sm tracking-widest uppercase shadow-lg"
          >
            Add to Cart
          </motion.button>
        </motion.div>
      </div>

      {/* Name + Price */}
      <div className="py-4">
        <h3 className="text-sm font-medium mb-1">{product.name}</h3>

        {/* ⭐ Optional Rating */}
        {product.rating && (
          <p className="text-xs text-yellow-500 mb-1">
            ⭐ {product.rating} / 5
          </p>
        )}

        <p className="text-sm font-semibold">
          Rs. {Number(product.price).toLocaleString("en-IN")}
        </p>
      </div>
    </motion.div>
  );
}
