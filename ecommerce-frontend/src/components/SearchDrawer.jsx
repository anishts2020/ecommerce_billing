import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import api, { BASE_URL } from "../api/api";

export default function SearchDrawer({ onClose, onProductSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setFilteredResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      api
        .get(`/products/search?q=${query}`)
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : res.data.data || [];
          const formatted = list.map((p) => ({
  id: p.id,
  name: p.product_name,
  price: p.selling_price || p.price || 0,
  image: p.product_image
    ? `${BASE_URL.replace("/api", "")}/product_images/${p.product_image}`
    : "/fallback-image.png",
  description: p.product_description || "No description available",
  size: p.size?.size_name || "N/A",   // make sure API returns size object
  color: p.color?.color_name || "N/A",
  material_id: p.material_id || null,
}));

          setResults(formatted);
        })
        .catch(() => {});
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      setFilteredResults([]);
      return;
    }

    const filtered = results.filter((product) =>
      product.name
        .toLowerCase()
        .split(" ")
        .some((word) => word.startsWith(q))
    );

    setFilteredResults(filtered);
  }, [query, results]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[400px] bg-white z-50 shadow-2xl p-6 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-end items-end mb-4">
          <button
            className="text-2xl text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        {/* Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 space-y-4">
  {filteredResults.map((product, index) => (
    <div
      key={product.id ?? index}
      onClick={() => onProductSelect(product)}
      className="flex gap-4 items-center cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex flex-col">
        <p className="font-semibold text-gray-800 underline hover:text-blue-600">
          {product.name}
        </p>
        <p className="text-gray-600">Rs. {product.price}</p> {/* Ensure price is included */}
      </div>
    </div>
  ))}


          {!filteredResults.length && query.trim() && (
            <p className="text-gray-500 text-center mt-10">No results found.</p>
          )}
        </div>
      </div>
    </>
  );
}
