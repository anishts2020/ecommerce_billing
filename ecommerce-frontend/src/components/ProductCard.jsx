export default function ProductCard({ product, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />

      <h3 className="font-semibold text-lg text-gray-800">
        {product.name}
      </h3>

      <p className="text-indigo-600 font-bold mb-4">
        ₹{product.price}
      </p>

      <button className="mt-auto bg-indigo-600 text-white py-2 rounded">
        View Details
      </button>
    </div>
  );
}
