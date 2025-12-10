export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />

      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{product.name}</h3>
      <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-4">₹{product.price}</p>

      <button
        onClick={() => onAddToCart(product)}
        className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}
