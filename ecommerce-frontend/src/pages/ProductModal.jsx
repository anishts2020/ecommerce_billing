import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../components/Layout";

const IMAGE_BASE = "http://127.0.0.1:8000/product_images/";

export default function ProductModal() {
  const { productCode } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const preselectedColorId = query.get("color");
  const preselectedSizeId = query.get("size");

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /* ---------- ZOOM ---------- */
  const imgRef = useRef(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [mobileZoom, setMobileZoom] = useState(false);

  /* ---------- FETCH PRODUCT ---------- */
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/product-details/${productCode}`)
      .then(res => res.json())
      .then(data => {
        setProduct({
          name: data.product_name,
          description: data.description,
          material: data.material,
        });

        setVariants(data.variants);

        const uniqueColors = [];
        data.variants.forEach(v => {
          if (!uniqueColors.find(c => c.color_id === v.color_id)) {
            uniqueColors.push({
              color_id: v.color_id,
              color_name: v.color_name,
              image: v.image,
            });
          }
        });

        setColors(uniqueColors);

        const matchedColor = preselectedColorId
          ? uniqueColors.find(c => String(c.color_id) === String(preselectedColorId))
          : uniqueColors[0];

        setSelectedColor(matchedColor || uniqueColors[0] || null);
      });
  }, [productCode, preselectedColorId]);

  /* ---------- UPDATE SIZES WHEN COLOR CHANGES ---------- */
  useEffect(() => {
    if (!selectedColor) return;

    const validVariants = variants.filter(
      v => v.color_id === selectedColor.color_id
    );

    const uniqueSizes = [];
    validVariants.forEach(v => {
      if (!uniqueSizes.find(s => s.size_id === v.size_id)) {
        uniqueSizes.push({
          size_id: v.size_id,
          size_name: v.size_name,
          price: v.price,
        });
      }
    });

    setSizes(uniqueSizes);

    let finalSize = null;

    if (preselectedSizeId) {
      finalSize = uniqueSizes.find(
        s => String(s.size_id) === String(preselectedSizeId)
      );
    }

    if (!finalSize && uniqueSizes.length > 0) {
      finalSize = uniqueSizes[0];
    }

    setSelectedSize(finalSize || null);
    setPrice(finalSize?.price || 0);
  }, [selectedColor, variants, preselectedSizeId]);

  const mainImage = selectedColor
    ? IMAGE_BASE + selectedColor.image
    : "/fallback-image.png";

  /* ---------- ZOOM ---------- */
  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();

    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (!product) {
    return (
      <Layout>
        <div className="p-10 text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-14">

          {/* IMAGE */}
          <div className="flex gap-6">
            <div className="w-full lg:w-96">
              <img
                ref={imgRef}
                src={mainImage}
                alt={product.name}
                className="w-full object-contain cursor-zoom-in select-none"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setMobileZoom(true)}
                draggable={false}
                onError={(e) => (e.target.src = "/fallback-image.png")}
              />
            </div>

            {showZoom && (
              <div className="hidden lg:block w-96 h-96 overflow-hidden bg-white">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${mainImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "500%",
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              <p className="text-gray-700 mt-2">{product.description}</p>
              <p className="text-2xl font-bold mt-4">₹ {price}</p>
            </div>

            <span className="inline-block rounded-full bg-gray-100 px-0 py-1 text-sm">
              Material: {product.material}
            </span>

            {/* SIZE */}
            <div>
              {/* ✅ DISPLAY SELECTED SIZE (ONLY ADDITION) */}
              {selectedSize && (
                 <p className="font-medium mb-3">Size:{" "}
                  <span className="font-medium">
                    {selectedSize.size_name}
                  </span>
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {sizes.map((s) => {
                  const selected = selectedSize?.size_id === s.size_id;
                  return (
                    <button
                      key={s.size_id}
                      onClick={() => {
                        setSelectedSize(s);
                        setPrice(s.price);
                      }}
                      className={`
                        w-20 py-2 rounded-full border text-center transition
                        ${
                          selected
                            ? "border-blue-600 text-blue-600"
                            : "border-gray-400 text-gray-800"
                        }
                      `}
                    >
                      <div className="font-semibold">{s.size_name}</div>
                      <div className="text-sm">₹{s.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLOR */}
            <div>
              <p className="font-medium mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const selected = selectedColor?.color_id === c.color_id;
                  return (
                    <button
                      key={c.color_id}
                      onClick={() => setSelectedColor(c)}
                      className={`
                        px-4 py-1.5 rounded border text-sm transition
                        ${
                          selected
                            ? "border-blue-600 text-blue-600"
                            : "border-gray-300 text-gray-800"
                        }
                      `}
                    >
                      {c.color_name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY */}
            <div>
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 border rounded"
                >
                  −
                </button>
                <span className="font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 border rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              disabled={!selectedColor || sizes.length === 0}
              className="px-10 py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-3 border-2 border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700 hover:bg-blue-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2zM7.16 14h9.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49-1.75-.97L16.65 12H7.53L4.27 4H1v2h2l3.6 7.59-1.35 2.44C4.52 16.37 5.48 18 7 18h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE ZOOM */}
      {mobileZoom && (
        <div
          onClick={() => setMobileZoom(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-auto"
        >
          <img src={mainImage} alt="Zoom" />
        </div>
      )}
    </Layout>
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
