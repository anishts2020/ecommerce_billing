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
    <div className="bg-white rounded-xl shadow ring-1 ring-gray-100 hover:shadow-xl transition transform hover:-translate-y-0.5 p-4 flex flex-col">
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
