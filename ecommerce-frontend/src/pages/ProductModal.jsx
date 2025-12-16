// src/pages/ProductModal.jsx
import { useState, useEffect, useRef } from "react";
import api from "../api/api";

export default function ProductModal({ productId, onClose, onAddToCart }) {
  const id = productId || 9; // fallback to dummy ID 9
  const [product, setProduct] = useState(null);
  const [variantData, setVariantData] = useState({ colors: [], sizes: [] });
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const imgRef = useRef();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const productRes = await api.get(`/products/${id}`);
        console.log("PRODUCT response data:", productRes.data);
        setProduct(productRes.data);
      } catch (err) {
        console.error("Product fetch error:", err);
      }

      try {
        const variantsRes = await api.get(`/products/${id}/variants`);
        console.log("VARIANTS response data:", variantsRes.data);

        setVariantData({
          colors: Array.isArray(variantsRes.data.colors)
            ? variantsRes.data.colors
            : [],
          sizes: Array.isArray(variantsRes.data.sizes)
            ? variantsRes.data.sizes
            : [],
        });
      } catch (err) {
        console.error("Variants fetch error:", err);
      }
    };

    fetchData();
  }, [id]);

  if (!product) return <div className="p-4 text-center">Loading product...</div>;

  const availableColors = variantData.colors;
  const availableSizes = variantData.sizes;

  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 sm:w-4/5 lg:w-3/4 p-6 relative flex flex-col lg:flex-row gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Image */}
        <div className="w-full lg:w-1/3 rounded overflow-hidden">
          <img
            ref={imgRef}
            src={
              product.product_image
                ? product.product_image.includes("http")
                  ? product.product_image
                  : `/product_images/${product.product_image}`
                : "/placeholder.jpg"
            }
            alt={product.product_name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{product.product_name}</h2>

          <p className="text-gray-700 mb-4">
            {product.product_description || "No description available."}
          </p>

          {/* Colors */}
          <p className="text-gray-800 font-bold mb-2">Select Color:</p>
          <div className="flex gap-2 mb-4">
            {availableColors.length ? (
              availableColors.map((c) => (
                <button
                  key={c.id}
                  className={`px-3 py-1 border rounded ${
                    selectedColor === c.id ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => {
                    setSelectedColor(c.id);
                    setSelectedSize(null); // reset size if color changes
                  }}
                >
                  {c.name}
                </button>
              ))
            ) : (
              <span className="text-gray-500">No colors available</span>
            )}
          </div>

          {/* Sizes (always visible) */}
          <p className="text-gray-800 font-bold mb-2">Select Size:</p>
          <div className="flex gap-2 mb-4">
            {availableSizes.length ? (
              availableSizes.map((s) => (
                <button
                  key={s.id}
                  className={`
                    px-3 py-1 border rounded 
                    ${selectedSize === s.id ? "bg-blue-500 text-white" : ""}
                    ${!selectedColor ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  disabled={!selectedColor}
                  onClick={() => selectedColor && setSelectedSize(s.id)}
                >
                  {s.name}
                </button>
              ))
            ) : (
              <span className="text-gray-500">No sizes available</span>
            )}
          </div>

          {/* Price */}
          <p className="text-gray-800 font-bold mb-1">
            Price: ₹{product.selling_price}
          </p>

          {/* Add to Cart */}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-3 disabled:opacity-50"
            disabled={!selectedColor || !selectedSize}
            onClick={() =>
              onAddToCart({
                ...product,
                color: selectedColor,
                size: selectedSize,
              })
            }
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
