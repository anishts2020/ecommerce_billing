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

  /* ---------- IMAGE ZOOM ---------- */
  const imgRef = useRef(null);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [mobileZoom, setMobileZoom] = useState(false);

  /* ---------- FETCH PRODUCT ---------- */
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/product-details/${productCode}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct({
          name: data.product_name,
          description: data.description,
          material: data.material,
        });

        setVariants(data.variants || []);

        const uniqueColors = [];
        (data.variants || []).forEach((v) => {
          if (!uniqueColors.find((c) => c.color_id === v.color_id)) {
            uniqueColors.push({
              color_id: v.color_id,
              color_name: v.color_name,
              image: v.image,
            });
          }
        });

        setColors(uniqueColors);

        const matchedColor = preselectedColorId
          ? uniqueColors.find(
              (c) => String(c.color_id) === String(preselectedColorId)
            )
          : uniqueColors[0];

        setSelectedColor(matchedColor || null);
      });
  }, [productCode, preselectedColorId]);

  /* ---------- UPDATE SIZES ---------- */
  useEffect(() => {
    if (!selectedColor) return;

    const validVariants = variants.filter(
      (v) => v.color_id === selectedColor.color_id
    );

    const uniqueSizes = [];
    validVariants.forEach((v) => {
      if (!uniqueSizes.find((s) => s.size_id === v.size_id)) {
        uniqueSizes.push({
          size_id: v.size_id,
          size_name: v.size_name,
          price: v.price,
        });
      }
    });

    setSizes(uniqueSizes);

    let finalSize =
      preselectedSizeId &&
      uniqueSizes.find(
        (s) => String(s.size_id) === String(preselectedSizeId)
      );

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
                className="w-full object-contain cursor-zoom-in"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setMobileZoom(true)}
                draggable={false}
                onError={(e) => (e.target.src = "/fallback-image.png")}
              />
            </div>

            {showZoom && (
              <div className="hidden lg:block w-96 h-96 overflow-hidden">
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
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-2xl font-bold">₹ {price}</p>

            <p className="text-sm bg-gray-100 inline-block px-3 py-1 rounded">
              Material: {product.material}
            </p>

            {/* SIZE */}
            <div>
              <p className="font-medium mb-2">Size</p>
              <div className="flex gap-3">
                {sizes.map((s) => (
                  <button
                    key={s.size_id}
                    onClick={() => {
                      setSelectedSize(s);
                      setPrice(s.price);
                    }}
                    className={`px-4 py-2 border rounded ${
                      selectedSize?.size_id === s.size_id
                        ? "border-blue-600 text-blue-600"
                        : "border-gray-400"
                    }`}
                  >
                    {s.size_name} – ₹{s.price}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div>
              <p className="font-medium mb-2">Color</p>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.color_id}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-1 border rounded ${
                      selectedColor?.color_id === c.color_id
                        ? "border-blue-600 text-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {c.color_name}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div>
              <p className="font-medium mb-1">Quantity</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>

            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE ZOOM */}
      {mobileZoom && (
        <div
          onClick={() => setMobileZoom(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <img src={mainImage} alt="Zoom" />
        </div>
      )}
    </Layout>
  );
}